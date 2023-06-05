import React, { useCallback } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import { Draggable } from 'react-beautiful-dnd';
import cn from 'classnames';
import AddressItem from '../../elements/address-item';
import AddressFavoriteChooseAction from '../address-favorite-choose-action';
import PropTypes from 'prop-types';
import useAutoResolvers from './useAutoResolvers';
import _compact from 'lodash/compact';
import { AddressContext } from './context';
import { isNumber } from '@vezubr/common/utils';

const Address = (props) => {
  const {
    addresses,
    address,
    index,
    error,
    onEdit,
    disabled,
    canChange,
    labelComponent,
    extraFieldComponent,
    onUpdatedAddress,
    onReorderAddresses,
    onDelete,
    useFavorite,
    onReplaceFromFavorite,
    isDisableMove,
    isSkippedAddressClassName,
    id
  } = props;

  const addressesCount = addresses.length;
  const { client } = React.useContext(AddressContext)

  const handleSwitchTop = useCallback(
    (e) => {
      let { index } = e.target.dataset
      index = ~~index;
      onReorderAddresses(index, index - 1)
    },
    [onReorderAddresses]
  );

  const handleSwitchBottom = useCallback(
    (e) => {
      let { index } = e.target.dataset
      index = ~~index;
      onReorderAddresses(index, index + 1)
    },
    [onReorderAddresses],
  );

  const hasError = VzForm.Utils.isHasError(error);

  const { isNew, guid } = address;

  let label = index === 0 ? 'Адрес подачи' : index === addressesCount - 1 ? 'Адрес доставки' : 'Промежуточный адрес';

  if (labelComponent) {
    const LabelComponent = labelComponent;
    label = <LabelComponent address={address} index={index} label={label} addressesCount={addressesCount} />;
  }

  let extra = null;
  if (extraFieldComponent) {
    const ExtraFieldComponent = extraFieldComponent;
    extra = <ExtraFieldComponent address={address} index={index} addressesCount={addressesCount} />;
  }

  const propsAddressActions = {};

  if (!disabled) {

    if (isNew) {
      propsAddressActions.onAdd = () => {
        onEdit(index);
      };
    } else {
      propsAddressActions.onRemove = () => {
        onDelete(index);
      };
    }
  }
  propsAddressActions.onEdit = () => {
    onEdit(index);
  };

  const onChooseFavorite = useCallback(
    (chooseArray, currentIndex) => {
      onReplaceFromFavorite(chooseArray[0], isNumber(currentIndex) ? currentIndex : index)
      onReplaceFromFavorite(chooseArray[0], isNumber(currentIndex) ? currentIndex : index)
    },
    [index, onReplaceFromFavorite],
  );

  useAutoResolvers({ address, index, onUpdatedAddress })

  const addressData = [
    address?.id,
    address?.externalId,
    address?.addressString || address?.address,
  ]

  return (
    <Draggable isDragDisabled={isDisableMove} draggableId={guid} index={index}>
      {(provided) => (
        <div
          className={cn('vz-form-field-addresses__item', { 'field-has-error': hasError })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {!isDisableMove && (
            <div className={cn('vz-form-field-addresses__item__navigation')}>
              <Ant.Icon
                className={
                  'vz-form-field-addresses__item__navigation__action vz-form-field-addresses__item__navigation__action--up'
                }
                data-index={index}
                type={'arrow-up'}
                onClick={handleSwitchTop}
              />
              <Ant.Icon
                className={
                  'vz-form-field-addresses__item__navigation__action vz-form-field-addresses__item__navigation__action--drag'
                }
                type={'drag'}
              />
              <Ant.Icon
                className={
                  'vz-form-field-addresses__item__navigation__action vz-form-field-addresses__item__navigation__action--down'
                }
                data-index={index}
                type={'arrow-down'}
                onClick={handleSwitchBottom}
              />
            </div>
          )}

          <div className={'vz-form-field-addresses__item__wrap'}>
            <AddressItem
              label={label}
              extraClassName={isSkippedAddressClassName}
              canChange={canChange}
              extra={extra}
              {...propsAddressActions}
              addressData={addressData}>
                {_compact(addressData).join('/ ')}
              <VzForm.TooltipError error={error} />
            </AddressItem>

            {!disabled && useFavorite && canChange && (
              <AddressFavoriteChooseAction id={`${id}-${index}`} client={client} selectedAddress={!isNew ? address : undefined} onChoose={onChooseFavorite} />
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

Address.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object),
  isDisableMove: PropTypes.bool,
  canChange: PropTypes.bool,
  error: PropTypes.any,
  useFavorite: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReplaceFromFavorite: PropTypes.func.isRequired,
  onUpdatedAddress: PropTypes.func.isRequired,
  onReorderAddresses: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  index: PropTypes.number,
  address: PropTypes.object,
  isSkippedAddressClassName: PropTypes.string,
  labelComponent: PropTypes.elementType,
  extraFieldComponent: PropTypes.elementType,
};


export default Address;
