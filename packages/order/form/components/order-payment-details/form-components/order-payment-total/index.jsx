import React, { useCallback, useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import compose from '@vezubr/common/hoc/compose';
import cn from 'classnames';
import Utils from '@vezubr/common/common/utils';
import { OrderPaymentContext } from '../../../../context';

function OrderPaymentTotal() {
  const { store } = useContext(OrderPaymentContext);
  const { totalWithoutVat, total, withVatRate } = store;

  const totalVat = total - totalWithoutVat
  return (
    <div className="order-payment-details__total">
      <div className="order-payment-details__total__group">
        <div className={'order-payment-details__total__title'}>ИТОГО (без НДС):</div>
        <div className={'order-payment-details__total__value'}>{Utils.moneyFormat(totalWithoutVat, 100, false)}</div>
      </div>
      {withVatRate ? (
        <>
          <div className="order-payment-details__total__group">
            <div className={'order-payment-details__total__title'}>ИТОГО НДС:</div>
            <div className={'order-payment-details__total__value'}>{Utils.moneyFormat(totalVat, 100, false)}</div>
          </div>
          <div className="order-payment-details__total__group">
            <div className={'order-payment-details__total__title'}>ИТОГО (c НДС):</div>
            <div className={'order-payment-details__total__value'}>{Utils.moneyFormat(total, 100, false)}</div>
          </div>
        </>
      ) : (
        null
      )}
      
    </div>
  );
}

export default compose([observer])(OrderPaymentTotal);
