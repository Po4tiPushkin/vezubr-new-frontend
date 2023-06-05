import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import _pick from 'lodash/pick';
import { observer } from 'mobx-react';
import { OrderContext } from '../../context';
import OrderFormFieldAddresses from '../../components/order-form-field-addresses';
import { showConfirm } from '@vezubr/elements';
import { FIELDS as FIELDS_ADDRESS } from '@vezubr/address';
import { FIELDS } from '../../form-extends/order-field-address-editor';
import ReactDiffViewer from 'react-diff-viewer';
import { useObserver } from "mobx-react";

const FIELDS_CHECK = {
  [FIELDS_ADDRESS.addressString]: 'Адрес',
  [FIELDS_ADDRESS.latitude]: 'Широта',
  [FIELDS_ADDRESS.longitude]: 'Долгота',
  [FIELDS.comment]: 'Комментарий',
  [FIELDS.email]: 'Email',
  [FIELDS.phone]: 'Телефон',
  [FIELDS.secondPhone]: 'Телефон 2',
  [FIELDS.contacts]: 'Контакты',
};

function reduceNullValue(obj) {
  return Object.keys(obj).reduce((result, key) => {
    if (obj[key]) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

function formatDiff(objectKeys, values) {
  let returnString = '';
  for (const key of Object.keys(objectKeys)) {
    if (typeof values[key] !== 'undefined') {
      returnString += `${objectKeys[key]}: ${values[key]} \n`;
    }
  }
  return returnString;
}

function changeAddressVerifiedBy(index, addresses, oldAddresses) {
  const address = { ...addresses[index] };
  if (!address?.verifiedBy) {
    return addresses;
  }
  const oldIndex = oldAddresses.findIndex((item) => item.guid === address.guid);
  if (oldIndex !== -1) {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...oldAddresses[oldIndex], ...address };
    return newAddresses;
  }
  return addresses;
}

function cancelAddress(currentItemAddress, addresses) {
  delete currentItemAddress.id;

  return addresses;
}


function OrderFieldAddresses(props) {
  const { store } = React.useContext(OrderContext);
  const { name, onTrackUpdated, validatorAddressItem, disabled: disabledInput, ...otherProps } = props;
  const { loadingTypes, disabledLoadingTypesByVehicleAndBody, orderType } = store.data;
  const value = React.useMemo(() => store.getDataItem('addresses'), [store.data.addresses, store.data.toStartAtTime, store.data.toStartAtDate])
  const disabled = store.isDisabled(name) || disabledInput;
  const error = store.getError(name);
  const { field: fieldError, items: itemsError } = error ? JSON.parse(error) : {};
  const client = useObserver(() => store.getDataItem('client'))
  const onChange = React.useCallback(
    (addresses) => {
      store.setDataItem(name, addresses);
    },
    [name],
  );

  const onConfirmChange = React.useCallback(
    (addresses) => {
      let foundPrevAddress = null;
      let oldAddressPick = null;
      let newAddressPick = null;
      for (const currentItemAddress of addresses) {

        const foundPrevIndex = value.findIndex(
          (item) => item.guid === currentItemAddress.guid && item.id && item.id === currentItemAddress.id,
        );
        if (foundPrevIndex !== -1) {
          foundPrevAddress = value[foundPrevIndex]
          oldAddressPick = reduceNullValue(_pick(foundPrevAddress, Object.keys(FIELDS_CHECK)));
          newAddressPick = reduceNullValue(_pick(currentItemAddress, Object.keys(FIELDS_CHECK)));
      

          if (!_isEqual(oldAddressPick, newAddressPick)) {
            
            showConfirm({
              title: `Изменились данные для адреса: ${currentItemAddress.addressString}`,
              width: 1000,
              content: (
                <>
                  <p>Данные адреса были заменены. Редактировать существующий, или добавить как новый?</p>
                  <ReactDiffViewer
                    oldValue={formatDiff(FIELDS_CHECK, oldAddressPick)}
                    newValue={formatDiff(FIELDS_CHECK, newAddressPick)}
                    splitView={true}
                  />
                </>
              ),
              okText: 'Редактировать',
              cancelText: 'Новый',
              onOk: () => {
                const newAddresses = changeAddressVerifiedBy(foundPrevIndex, addresses, value);
                onChange(newAddresses);
              },
    
              onCancel: () => {
                const deletedAddress = cancelAddress(currentItemAddress, addresses);
                onChange(deletedAddress);
              },
            }); 
          }
        }
      }
      onChange(addresses);
    },
    [value, onChange],
  );
  return (
    <OrderFormFieldAddresses
      {...otherProps}
      onChange={onConfirmChange}
      error={fieldError}
      errors={itemsError}
      addresses={value}
      disabled={disabled}
      onTrackUpdated={onTrackUpdated}
      validatorAddressItem={validatorAddressItem}
      loadingTypes={loadingTypes}
      orderType={orderType}
      disabledLoadingTypes={orderType == 2 ? [] : disabledLoadingTypesByVehicleAndBody}
    />
  );
}
OrderFieldAddresses.propTypes = {
  name: PropTypes.string.isRequired,
  onTrackUpdated: PropTypes.func,
  validatorAddressItem: PropTypes.objectOf(PropTypes.func).isRequired,
  disabled: PropTypes.bool,
};
export default observer(OrderFieldAddresses);
