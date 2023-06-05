import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Utils from '@vezubr/common/common/utils';
import './styles.scss';
import { Ant } from '@vezubr/elements';
import { useSelector } from 'react-redux';

const CLS = 'monitor-item-cost'
function ListItemCost(props) {
  const { order } = props;
  const user = useSelector((state) => state?.user);
  const { id, costWithVat } = user || {};

  const preCostProducer = useMemo(() => {
    const calc = order?.data?.performers && order?.data?.performers?.find((item) => {
      return id == item?.producerId
    });

    const { preliminaryCalculationCost, costVatRate } = calc || {};

    if (costWithVat && preliminaryCalculationCost && costVatRate) {
      return preliminaryCalculationCost + (preliminaryCalculationCost * (costVatRate / 100))
    }
    return preliminaryCalculationCost

  }, [id, costWithVat, order]);

  const costClient = useMemo(() => {
    const calc = order?.data?.performers && order?.data?.performers?.find((item) => {
      return id == item?.clientId
    });

    const { effectiveCalculationCost, costVatRate } = calc || {};

    if (costWithVat && effectiveCalculationCost && costVatRate) {
      return effectiveCalculationCost + (effectiveCalculationCost * (costVatRate / 100))
    }
    return effectiveCalculationCost

  }, [id, costWithVat, order]);

  if ((APP !== 'client' && preCostProducer) || (APP === 'client' && costClient)) {
    return (
      <div className={CLS}>
        <div
          className={`${CLS}__item`}
          title={"Предварительная стоимость"}
        >
          <Ant.Icon type="wallet" />
          <span>{Utils.moneyFormat(APP === 'client' ? costClient : preCostProducer)}</span>
        </div>
      </div>
    );
  } else {
    return null
  }
}

ListItemCost.propTypes = {
  order: PropTypes.object,
};

export default ListItemCost;
