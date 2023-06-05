import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import moment from 'moment';
import { TariffContext } from '../../context';
import { Ant, VzForm } from '@vezubr/elements';

const { RangePicker } = Ant.DatePicker;

function TariffFieldDateRange(props) {
  const {
    label,
    fromSetterProp,
    fromPropField,
    toSetterProp,
    toPropField,
    formatView,
    formatData,
    ...otherProps
  } = props;

  const { store } = React.useContext(TariffContext);

  const value = React.useMemo(() => {
    const valueFromMoment = moment(store[fromPropField], formatData);
    const valueToMoment = moment(store[toPropField], formatData);

    if (valueFromMoment.isValid() && valueToMoment.isValid()) {
      return [valueFromMoment, valueToMoment];
    }

    return [];
  }, [store[fromPropField], store[toPropField], formatData, formatData]);

  const onChange = React.useCallback(
    (dates) => {
      store[fromSetterProp || fromPropField](dates?.[0]?.format && dates[0].format(formatData));
      store[toSetterProp || toPropField](dates?.[1]?.format && dates[1].format(formatData));
    },
    [formatData, fromSetterProp, fromPropField, toSetterProp, toPropField],
  );

  return (
    <VzForm.Item
      className={'tariff-field-date-range'}
      label={label}
      error={store.getError(fromPropField) || store.getError(toPropField)}
    >
      <RangePicker {...otherProps} value={value} format={formatView} disabled={!store.editable} onChange={onChange} />
    </VzForm.Item>
  );
}

TariffFieldDateRange.propTypes = {
  label: PropTypes.string.isRequired,
  formatData: PropTypes.string.isRequired,
  formatView: PropTypes.string.isRequired,
  fromSetterProp: PropTypes.string,
  fromPropField: PropTypes.string.isRequired,
  toSetterProp: PropTypes.string,
  toPropField: PropTypes.string.isRequired,
};

export default observer(TariffFieldDateRange);
