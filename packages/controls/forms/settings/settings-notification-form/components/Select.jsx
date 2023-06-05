import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { FormContext } from '../context';

function Select(props) {
  const { status, timeOutType, fieldList, defaultValue } = props;

  const { store } = useContext(FormContext);

  let value = store.getTimeoutItem(status, timeOutType);

  if (typeof value === 'undefined') {
    value = defaultValue;
  }

  const onChange = useCallback(
    (value) => {
      store.setTimeoutItem(status, value, timeOutType);
    },
    [status, timeOutType, store],
  );

  return (
    <Ant.Select
      placeholder="Уведомить через"
      value={value}
      style={{ width: '100%' }}
      disabled={store.isDisabled}
      onChange={onChange}
    >
      {fieldList.map(({ title, value }) => (
        <Ant.Select.Option key={value} value={value}>
          {title}
        </Ant.Select.Option>
      ))}
    </Ant.Select>
  );
}

Select.propTypes = {
  fieldList: PropTypes.array.isRequired,
  defaultValue: PropTypes.string,
  status: PropTypes.number.isRequired,
  timeOutType: PropTypes.string.isRequired,
};

export default observer(Select);
