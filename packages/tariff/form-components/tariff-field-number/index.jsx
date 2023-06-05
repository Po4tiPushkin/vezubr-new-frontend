import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, VzForm } from '@vezubr/elements';
import { TariffContext } from '../../context';

function TariffFieldNumber(props) {
  const { setterProp, propField, label, ...otherProps } = props;

  const { store } = React.useContext(TariffContext);

  const onChange = React.useCallback(
    (value) => {
      store[setterProp || propField](value);
    },
    [setterProp, propField],
  );

  return (
    <VzForm.Item label={label} error={store.getError(propField)}>
      <Ant.InputNumber {...otherProps} value={store[propField]} disabled={!store.editable} onChange={onChange} />
    </VzForm.Item>
  );
}

TariffFieldNumber.propTypes = {
  label: PropTypes.string,
  setterProp: PropTypes.string,
  propField: PropTypes.string,
  placeholder: PropTypes.string,
  objectList: PropTypes.object,
};

export default observer(TariffFieldNumber);
