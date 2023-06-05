import React from 'react';
import PropTypes from 'prop-types';
import { OrderContext } from '../context';
import { observer } from 'mobx-react';
import { VzForm } from '@vezubr/elements';

export const OrderFormFieldWrapperProps = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  shortInfo: PropTypes.object,
};

export const OrderFormFieldProps = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  setValue: PropTypes.func,
  disabled: PropTypes.bool,
};

export default function withOrderFormFieldWrapper(WrappedComponent) {
  function OrderFormFieldWrapper(props) {
    const { store } = React.useContext(OrderContext);
    const { label, shortInfo, disabled: disabledInput, wrapped = true , ...otherProps } = props;
    const { name } = props;

    const value = store.getDataItem(name);
    const disabled = disabledInput || store.isDisabled(name);
    const error = store.getError(name);
    const itemError = !disabled && error;
    const placeholder = store.getDataItem(name + 'Placeholder')

    const setValue = React.useCallback(
      (value) => {
        store.setDataItem(name, value);
      },
      [name],
    );

    if (!wrapped) {
      return <WrappedComponent {...{ ...otherProps, setValue, value, shortInfo, label, error: itemError, disabled  }} />
    }

    return (
      <VzForm.Item shortInfo={shortInfo} label={label} error={itemError} disabled={disabled}>
        <WrappedComponent {...{ ...otherProps, setValue, value, disabled, placeholder }} />
      </VzForm.Item>
    );
  }

  OrderFormFieldWrapper.propTypes = OrderFormFieldWrapperProps;

  return observer(OrderFormFieldWrapper);
}
