import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { OrderContext } from "../../context";
import { getOrderDataSave, getProducersForOrder } from '../../utils'
import OrderCalculateSteps from "../order-calculate-steps";
import { showConfirm } from '@vezubr/elements';

function OrderCalculate(props) {
  const { calculationFields, fetch } = props;

  const { store } = React.useContext(OrderContext);

  const fetchCalc = React.useCallback(async (list, store) => {
    const {
      addresses,
      address,
      orderType,
      isLiftingValidationRequired,
      vehicleType,
    } = getOrderDataSave(store.getDirtyData())

    store.setDataItem('calculation', { status: 'fetching' });
    const reqData = {
      ...list
    }
    if (orderType !== 2) {
      reqData.isLiftingValidationRequired = { value: isLiftingValidationRequired }
    }
    const calcResult = await fetch(reqData);
    const producers = await getProducersForOrder(orderType, addresses || address, vehicleType)

    store.setDataItem('calculation', {
      ...calcResult,
      status: 'calculated',
    });
    store.setDataItem('producers', producers);
  }, [fetch])

  const onChangeForCalculation = React.useCallback(
    async (list, valid, store) => {
      if (!valid) {
        store.setDataItem('calculation', { status: 'noValidData' });
        return;
      }
      store.setDataItem('isLiftingValidationRequired', true)
      try {
        await fetchCalc(list, store)
      } catch (e) {
        if (e.data?.errors?.[0]?.message?.includes('Грузоподъемность')) {
          showConfirm({
            title: e.data?.errors?.[0]?.message + '. Продолжить?',
            onOk: () => {
              store.setDataItem('isLiftingValidationRequired', false)
              fetchCalc(list, store)
            },
            width: 500
          })
        }
        console.error(e);
        store.setDataItem('calculation', {
          status: 'error',
          error: e,
        });
      }
    },
    [fetch, fetchCalc],
  );

  const resultCalculation = store.getDataItem('calculation');

  return (
    <div className={'order-calculate'}>
      <OrderCalculateSteps
        timer={1000}
        onChange={onChangeForCalculation}
        resultCalculation={resultCalculation}
        fields={calculationFields}
      />
    </div>
  );
}

OrderCalculate.propTypes = {
  calculationFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetch: PropTypes.func.isRequired,
};

export default observer(OrderCalculate);
