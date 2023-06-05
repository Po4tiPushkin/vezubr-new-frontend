import React from 'react';
import { InputNumber } from '../../../antd';
import PropTypes from 'prop-types';

function FormFieldCurrency(props) {
  const {
    currency = 'RUB',
    local = 'ru-RU',
    valueInPenny = true,
    decimalSeparator: decimalSeparatorInput,
    ...otherProps
  } = props;

  const numberFormat = React.useMemo(() => new Intl.NumberFormat(local, { style: 'currency', currency }), [
    currency,
    local,
  ]);

  const decimalSeparator = React.useMemo(() => {
    if (decimalSeparatorInput) {
      return decimalSeparatorInput;
    }
    const example = numberFormat.format(1000);
    const match = example.match(/([\.\,])\d\d/gi);

    if (match) {
      return match[1];
    }

    throw new Error('Could not determine decimalSeparator');
  }, [numberFormat, decimalSeparatorInput]);

  const parser = React.useCallback(
    (valueInput) => {
      let valueString = valueInput;

      let decimalPlaces = '';
      const req = new RegExp(`${decimalSeparator}(\d\d)`, 'ig');
      const match = valueString.match(req);
      if (match) {
        decimalPlaces = match[1];
        valueString = valueString.replace(match[0], '');
      }

      valueString = valueString.replace(/[^0-9]/gi, '');

      valueString = valueString + (decimalPlaces ? `${decimalSeparator}${decimalPlaces}` : '');
      const value = parseFloat(valueString);

      return valueInPenny ? value * 100 : value;
    },
    [decimalSeparator, valueInPenny],
  );

  const formatter = React.useCallback(
    (value) => {
      const amount = valueInPenny ? value / 100 : value;
      return numberFormat.format(amount);
    },
    [numberFormat, valueInPenny],
  );

  return <InputNumber {...otherProps} decimalSeparator={decimalSeparator} formatter={formatter} parser={parser} />;
}

FormFieldCurrency.propTypes = {
  currency: PropTypes.string,
  local: PropTypes.string,
  valueInPenny: PropTypes.bool,
  decimalSeparator: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  step: PropTypes.number,
  defaultValue: PropTypes.number,
  disabled: PropTypes.number,
};

export default FormFieldCurrency;
