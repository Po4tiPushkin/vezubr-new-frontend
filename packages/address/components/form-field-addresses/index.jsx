import React, { useMemo, useCallback, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { VzForm } from '@vezubr/elements';
import { getStoreAddress } from '../../utils';
import { AddressContext } from './context';
import Editor from './Editor';
import List from './List';
import Map from './Map';
import { Utils } from '@vezubr/common/common';
import { OrderContext } from '@vezubr/order/form/context';
import { isNumber } from '@vezubr/common/utils';

export const FormFieldAddressesProps = {
  addresses: PropTypes.arrayOf(PropTypes.object),
  error: VzForm.Types.ErrorItemProp,
  errors: PropTypes.objectOf(VzForm.Types.ErrorItemProp),
  children: PropTypes.func,
  useFavorite: PropTypes.bool,
  canMovePredicateFn: PropTypes.func,
  canChangePredicateFn: PropTypes.func,
  getExtraClassAddressItemFn: PropTypes.func,
  useMap: PropTypes.bool,
  onChange: PropTypes.func,
  onTrackUpdated: PropTypes.func,
  max: PropTypes.number,
  validatorAddressItem: PropTypes.objectOf(PropTypes.func).isRequired,
  disabled: PropTypes.bool,
  labelComponent: PropTypes.elementType,
  extraFieldComponent: PropTypes.elementType,
  prepareAddressFromFavoriteFn: PropTypes.func,
};

export const reorder = (list, startIndex, endIndex) => {
  if ((endIndex === 0 || startIndex === 0) && Array.isArray(list) && list[0]?.disabled) {
    return list;
  }
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function canChangePredicateFnDefault(address) {
  return !!address;
}

function FormFieldAddresses(props) {
  const {
    addresses: addressesInput,
    useMap,
    onChange,
    onTrackUpdated,
    useFavorite,
    children,
    error,
    errors,
    canMovePredicateFn,
    canChangePredicateFn: canChangePredicateFnInput,
    getExtraClassAddressItemFn,
    max,
    validatorAddressItem,
    disabled,
    labelComponent,
    extraFieldComponent,
    prepareAddressFromFavoriteFn,
    client,
    viewRoute = true,
    polyLine = null,
    id,
  } = props;

  const canChangePredicateFn = canChangePredicateFnInput || canChangePredicateFnDefault;

  const hasError = VzForm.Utils.isHasError(error);

  const [favoritesModalVisible, setFavoritesModalVisible] = React.useState(false);

  const toggleFavoritesModal = React.useCallback(
    (index) => {
      setFavoritesModalVisible(isNumber(index) ? index : favoritesModalVisible === false ? true : false);
    },
    [favoritesModalVisible],
  );

  const [currentIndex, setCurrentIndex] = useState(null);

  const { store } = React.useContext(OrderContext);

  const addresses = useMemo(() => {
    let hasNew = false;

    const addresses = addressesInput.map((a) => {
      const updated = {
        ...a,
      };

      delete updated.position;

      if (!updated.guid) {
        updated.guid = Utils.uuid;
      }

      if (a.isNew) {
        hasNew = true;
      }

      return updated;
    });

    const addressesInitialCount = addresses.length;

    if (!disabled && !hasNew && (!max || max > addressesInitialCount)) {
      if (addressesInitialCount >= 2) {
        addresses.splice(addressesInitialCount - 1, 0, {
          isNew: true,
          guid: Utils.uuid,
        });
      } else {
        addresses.push({
          isNew: true,
          guid: Utils.uuid,
        });
      }
    }

    return addresses;
  }, [addressesInput, max, disabled, store?.data?.toStartAtDate, store?.data?.toStartAtTime]);

  const positions = useMemo(
    () =>
      addresses
        .filter((a) => !a.isNew)
        .reduce((posObj, a, index) => {
          posObj[a.guid] = index + 1;
          return posObj;
        }, {}),
    [addresses],
  );

  const onEdit = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const onClearCurrentIndex = useCallback(() => {
    setCurrentIndex(null);
  }, []);

  const onReorderAddresses = useCallback(
    (sourceIndex, destinationIndex) => {
      const onUpdatedAddresses = reorder(addresses, sourceIndex, destinationIndex);

      if (onChange) {
        onChange(onUpdatedAddresses);
      }
    },
    [addresses, onChange],
  );

  const onUpdatedAddress = useCallback(
    (valuesInput, index) => {
      const values = { ...valuesInput };
      delete values.guid;

      const currentAddress = { ...addresses[index] };

      const currentIsNew = currentAddress.isNew;

      const onUpdatedAddress = {
        ...currentAddress,
        ...values,
      };
      delete onUpdatedAddress.isNew;

      let onUpdatedAddresses = [...addresses];
      onUpdatedAddresses[index] = onUpdatedAddress;

      if (currentIsNew) {
        const currentLength = onUpdatedAddresses.length;
        const lastIndex = currentLength - 1;
        const replaceIndex = lastIndex === index && lastIndex !== 0 ? lastIndex : index + 1;

        if (!max || max > onUpdatedAddresses.length) {
          onUpdatedAddresses.splice(replaceIndex, 0, {
            isNew: true,
            guid: Utils.uuid,
          });
        }
      }

      if (onChange) {
        onChange(onUpdatedAddresses);
      }
    },
    [addresses, onChange, max],
  );

  const onReplaceFromFavorite = useCallback(
    (valuesInput, index) => {
      const chooseAddress = getStoreAddress(valuesInput);
      const insertAddress = prepareAddressFromFavoriteFn
        ? prepareAddressFromFavoriteFn(chooseAddress, index)
        : chooseAddress;
      onUpdatedAddress(insertAddress, index);
    },
    [onUpdatedAddress, prepareAddressFromFavoriteFn],
  );

  const onDelete = useCallback(
    (currentIndex) => {
      let onUpdatedAddresses = [...addresses];

      onUpdatedAddresses.splice(currentIndex, 1);
      onUpdatedAddresses = onUpdatedAddresses.map((a, index) => ({ ...a, position: index + 1 }));

      if (onChange) {
        onChange(onUpdatedAddresses);
      }
    },
    [addresses, onChange],
  );

  const context = useMemo(
    () => ({
      addresses,
      positions,
      onUpdatedAddress,
      onTrackUpdated,
      onDelete,
      onReorderAddresses,
      onEdit,
      onClearCurrentIndex,
      onReplaceFromFavorite,
      useFavorite,
      useMap,
      canMovePredicateFn,
      canChangePredicateFn,
      getExtraClassAddressItemFn,
      disabled,
      client,
      toggleFavoritesModal,
      favoritesModalVisible,
    }),
    [
      addresses,
      positions,
      onUpdatedAddress,
      onTrackUpdated,
      onDelete,
      onReorderAddresses,
      onEdit,
      onClearCurrentIndex,
      onReplaceFromFavorite,
      useFavorite,
      useMap,
      canMovePredicateFn,
      canChangePredicateFn,
      getExtraClassAddressItemFn,
      disabled,
      client,
      toggleFavoritesModal,
      favoritesModalVisible,
    ],
  );

  return (
    <AddressContext.Provider value={context}>
      <div
        className={cn('vz-form-field-addresses', {
          'vz-form-field-addresses--has-error': hasError,
          'vz-form-field-addresses--full-width': max == 1,
        })}
      >
        <List id={id} errors={errors} labelComponent={labelComponent} extraFieldComponent={extraFieldComponent} />

        <Map
          addresses={addresses}
          useMap={useMap}
          onTrackUpdated={onTrackUpdated}
          viewRoute={viewRoute}
          polyLine={polyLine}
        />

        <Editor currentIndex={currentIndex} onCancel={onClearCurrentIndex} validatorAddressItem={validatorAddressItem}>
          {children}
        </Editor>

        <VzForm.TooltipError error={error} />
      </div>
    </AddressContext.Provider>
  );
}

FormFieldAddresses.propTypes = FormFieldAddressesProps;

export default FormFieldAddresses;
