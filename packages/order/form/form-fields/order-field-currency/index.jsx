import React from 'react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import cn from 'classnames';
import { isNumber } from '@vezubr/common/utils';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';

function OrderFieldCurrency(props) {
  const {
    name,
    setValue,
    decimalSeparator = ',',
    valueInPenny = true,
    value: valueInput,
    className,
    ...otherProps
  } = props;

  const onChange = React.useCallback(
    (value) => {
      let savingValue = value;
      if (valueInPenny && isNumber(value)) {
        savingValue = value * 100;
      }
      setValue(Math.round(savingValue));
    },
    [valueInPenny],
  );

  let value = valueInput;
  if (valueInPenny && isNumber(valueInput)) {
    value = valueInput / 100;
  }

  if (typeof otherProps.placeholder == 'number') {
    otherProps.placeholder = (otherProps.placeholder / 100).toFixed(2);
    otherProps.placeholder = otherProps.placeholder.toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  return (
    <Ant.InputNumber
      {...otherProps}
      value={value}
      decimalSeparator={decimalSeparator}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      onChange={onChange}
      className={cn('order-field-number', className)}
    />
  );
}

OrderFieldCurrency.propTypes = {
  ...OrderFormFieldProps,
  valueInPenny: PropTypes.bool,
  decimalSeparator: PropTypes.string,
  placeholder: PropTypes.string,
};

export default compose([withOrderFormFieldWrapper])(OrderFieldCurrency);
