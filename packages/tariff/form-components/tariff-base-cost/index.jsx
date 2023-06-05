import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant, VzForm } from '@vezubr/elements';
import { TariffContext } from '../../context';
import { costFieldOperation } from '../../utils';

function TariffBaseCost(props) {
  const { store } = React.useContext(TariffContext);

  const onChange = React.useCallback((value) => {
    store.setCost(costFieldOperation(value, (value) => value * 100));
  }, []);

  const costFieldValue = costFieldOperation(store.cost, (value) => value / 100);

  return (
    <VzForm.Item label={'Базовая стоимость'} error={store.getError('cost')}>
      <Ant.InputNumber value={costFieldValue} disabled={!store.editable} min={0} step={500} onChange={onChange} />
    </VzForm.Item>
  );
}

export default observer(TariffBaseCost);
