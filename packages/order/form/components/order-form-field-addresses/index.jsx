import React from 'react';
import PropTypes from 'prop-types';
import * as Address from '@vezubr/address';
import OrderFieldAddressEditor from '../../form-extends/order-field-address-editor';
import OrderAddressLabel from '../order-address-label'


function OrderFormFieldAddresses(props) {
  const { loadingTypes, disabledLoadingTypes, ...otherProps } = props;

  return (
    <Address.FormFieldAddresses labelComponent={OrderAddressLabel} {...otherProps}>
      {(props) => <OrderFieldAddressEditor {...{ ...props, loadingTypes , disabledLoadingTypes, ...otherProps }} />}
    </Address.FormFieldAddresses>
  );
}

OrderFormFieldAddresses.propTypes = {
  ...Address.FormFieldAddressesProps,
  loadingTypes: PropTypes.array,
};

export default OrderFormFieldAddresses;
