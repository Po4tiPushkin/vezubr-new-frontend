import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { VzForm } from '@vezubr/elements';
import Address from './Address';
import { AddressContext } from './context';

function List(props) {
  const { labelComponent, errors, extraFieldComponent, id } = props;

  const {
    addresses,
    positions,
    useFavorite,
    canMovePredicateFn,
    canChangePredicateFn,
    getExtraClassAddressItemFn,
    onReorderAddresses,
    onUpdatedAddress,
    onReplaceFromFavorite,
    onEdit,
    onDelete,
    disabled,
  } = useContext(AddressContext);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const targetAddress = addresses[result.destination.index];

      if (!canMovePredicateFn(targetAddress, positions?.[targetAddress?.guid])) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      onReorderAddresses(result.source.index, result.destination.index);

    },
    [addresses, onReorderAddresses],
  );

  const addressesCount = addresses.length;

  const renderAddress = (address, index) => {
    const { disabled: addressDisabled = false } = address || {}; 
    const isDisableMove = addressDisabled || disabled || addressesCount < 2 || (canMovePredicateFn && !canMovePredicateFn(address, positions?.[address.guid]));
    const canChange = !addressDisabled && canChangePredicateFn(address, positions?.[address.guid]);
    const error = errors?.[address.guid]
    const isSkippedAddressClassName = getExtraClassAddressItemFn && getExtraClassAddressItemFn(address);

    return (
      <Address
        address={address}
        addresses={addresses}
        index={index}
        useFavorite={useFavorite}
        onUpdatedAddress={onUpdatedAddress}
        onReorderAddresses={onReorderAddresses}
        onReplaceFromFavorite={onReplaceFromFavorite}
        onEdit={onEdit}
        onDelete={onDelete}
        error={error}
        disabled={addressDisabled || disabled}
        isDisableMove={isDisableMove}
        isSkippedAddressClassName={isSkippedAddressClassName}
        canChange={canChange}
        key={address.guid}
        labelComponent={labelComponent}
        extraFieldComponent={extraFieldComponent}
        id={id}
      />
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            className={'vz-form-field-addresses__items'}
            ref={provided.innerRef}
          >
            {addresses.map(renderAddress)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

List.propTypes = {
  errors: PropTypes.objectOf(VzForm.Types.ErrorItemProp),
  labelComponent: PropTypes.elementType,
  extraFieldComponent: PropTypes.elementType,
};

export default List;
