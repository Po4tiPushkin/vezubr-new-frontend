import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { OrderContext } from '../../context';
import { VzForm } from '@vezubr/elements';
import { Ant } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import moment from 'moment';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';
import { changeFirstAddressDate } from '../../utils';

function OrderFieldDate(props) {
  const {
    formatData: formatDataInput,
    formatView: formatViewInput,
    value: valueStore,
    setValue,
    placeholder,
    changeAddress = true,
    ...otherProps
  } = props;

  const formatData = formatDataInput || 'YYYY-MM-DD';
  const formatView = formatViewInput || 'DD.MM.YYYY';

  const value = (valueStore && moment(valueStore, formatData)) || null;

  const { store } = React.useContext(OrderContext)

  const onChange = React.useCallback(
    (time) => {
      setValue((time && time.format(formatData)) || '');
      if (changeAddress) {
        changeFirstAddressDate(store, time ? `${time.format(formatData)} ${store.data.toStartAtTime || '00:00'}` : '')
      }
    },
    [formatData, changeAddress],
  );

  return (
    <Ant.DatePicker
      placeholder={placeholder || 'дд.мм.гггг'}
      allowClear={true}
      {...otherProps}
      format={formatView}
      value={value}
      onChange={onChange}
    />
  );
}

OrderFieldDate.propTypes = {
  ...OrderFormFieldProps,
  formatData: PropTypes.string,
  formatView: PropTypes.string,
  placeholder: PropTypes.string,
};

export default compose([withOrderFormFieldWrapper])(OrderFieldDate);
