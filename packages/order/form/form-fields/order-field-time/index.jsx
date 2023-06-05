import React from 'react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';

import moment from 'moment';
import { changeFirstAddressDate } from '../../utils';
import { OrderContext } from '../../context';

function OrderFieldTime(props) {
  const { placeholder, value: storeValue, setValue, format: formatInput, changeAddress = true, ...otherProps } = props;

  const format = formatInput || 'HH:mm';

  const value = (storeValue && moment(storeValue, format)) || null;

  const { store } = React.useContext(OrderContext)

  const onChange = React.useCallback(
    (time, timeString) => {
      setValue(timeString);
      if (changeAddress) {
        changeFirstAddressDate(store, time && store.data.toStartAtDate ? `${store.data.toStartAtDate} ${timeString}` : '')
      }
    },
    [setValue, changeAddress],
  );

  return (
    <Ant.TimePicker
      placeholder={placeholder || 'чч:мм'}
      allowClear={true}
      minuteStep={5}
      {...otherProps}
      value={value}
      format={format}
      onChange={onChange}
    />
  );
}

OrderFieldTime.propTypes = {
  ...OrderFormFieldProps,
  placeholder: PropTypes.string,
};

export default compose([withOrderFormFieldWrapper])(OrderFieldTime);
