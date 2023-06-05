import React, { useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { VzForm } from '@vezubr/elements';
import { FormContext } from '../context';

function RangeTimeHour(props) {
  const { label, fieldNameFrom, fieldNameTo, format, ...otherProps } = props;

  const { store } = useContext(FormContext);

  const valueFromInput = store.getItem(fieldNameFrom);
  const valueToInput = store.getItem(fieldNameTo);

  const value = useMemo(() => [valueFromInput, valueToInput], [valueFromInput, valueToInput]);

  const onChange = useCallback(
    (value) => {
      const [valueFrom, valueTo] = value;
      store.setItem(fieldNameFrom, valueFrom);
      store.setItem(fieldNameTo, valueTo);
    },
    [fieldNameFrom, fieldNameTo, store],
  );

  return (
    <VzForm.Item className={'settings-form-field-time-range'} label={label} type={'div'}>
      <VzForm.FieldRangeTime
        {...otherProps}
        value={value}
        disabled={store.isDisabled}
        format={format}
        onChange={onChange}
      />
    </VzForm.Item>
  );
}

RangeTimeHour.propTypes = {
  label: PropTypes.string,
  format: PropTypes.string.isRequired,
  fieldNameFrom: PropTypes.string.isRequired,
  fieldNameTo: PropTypes.string.isRequired,
};

export default observer(RangeTimeHour);
