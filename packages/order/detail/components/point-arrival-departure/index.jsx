import React from 'react';

import cn from 'classnames';
import { dateCreateMoment } from "@vezubr/common/utils";

const CLS = 'order-view-point-arrival-departure';

const OrderViewPointArrivalDeparture = (props) => {
  const { arrivedAt, requiredArriveAt, completedAt } = props;

  const renderInfoItem = (dateValue, title, isBad) => {
    const date = dateCreateMoment(dateValue);
    return (
      <div className={cn(`${CLS}__item`, { [`${CLS}__item--bad`]: isBad, [`${CLS}__item--empty`]: !date })}>
        <div className={`${CLS}__item__title`}>{title}:</div>
        <div className={`${CLS}__item__value`}>{(date && date.format('DD.MM.YYYY HH:mm:ss')) || '—'}</div>
      </div>
    );
  };

  const address = props.addressString || props.address;

  const arrivedAtMoment = dateCreateMoment(arrivedAt);
  const requiredArriveAtMoment = dateCreateMoment(requiredArriveAt);

  const isBadArrived = arrivedAtMoment && requiredArriveAtMoment && arrivedAtMoment.isAfter(requiredArriveAtMoment);

  return (
    <div className={`${CLS}`}>
      {address && <h3 className={`${CLS}__address`}>{address}</h3>}
      <div className={`${CLS}__items`}>
        {renderInfoItem(requiredArriveAtMoment, 'Требуемое время прибытия')}
        {renderInfoItem(arrivedAtMoment, 'Фактическое прибытие', isBadArrived)}
        {renderInfoItem(completedAt, 'Завершение работы')}
      </div>
    </div>
  );
};
export default OrderViewPointArrivalDeparture;
