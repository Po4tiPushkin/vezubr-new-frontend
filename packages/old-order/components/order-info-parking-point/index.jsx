import React from 'react';
import PropTypes from 'prop-types';
import { dateCreateMoment } from '@vezubr/common/utils';

const CLS = 'order-info-parking-point'

const OrderInfoParkingPoint = (props) => {
    const {index,startAt,finishAt} = props;

    const renderInfoItem = (dateValue, title) => {
        const date = dateCreateMoment(dateValue);
        return (
          <div className={`${CLS}__item`}>
            <div className={`${CLS}__item__title`}>{title}:</div>
            <div className={`${CLS}__item__value`}>{(date && date.format('DD.MM.YYYY HH:mm:ss')) || '—'}</div>
          </div>
        );
      };
    

    const beginAtMoment = dateCreateMoment(startAt);
    const endAtMoment = dateCreateMoment(finishAt);
    return (
        <div className={`${CLS}`}>
            <h3 className={`${CLS}__index`}>Остановка № {index}</h3>
            <div className={`${CLS}__items`}>
                {renderInfoItem(beginAtMoment, 'Начало остановки')}
                {renderInfoItem(endAtMoment, ' Конец остановки')}
            </div>
        </div>
    )
};

OrderInfoParkingPoint.propTypes = {
    index: PropTypes.number,
    beginAt:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    endAt:PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default OrderInfoParkingPoint;
