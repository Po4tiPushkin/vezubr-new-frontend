import React, { useContext, useMemo, useState } from 'react';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { StatusNotificationNew, LinkGoBackRenderProps } from '@vezubr/components';
import { useHistory } from 'react-router';
import { OrderViewProblem, OrderViewMenu, OrderViewActions } from '../../components';
import OrderViewContext from '../../context';
import { IconDeprecated } from '@vezubr/elements';
import moment from 'moment';
const OrderViewHead = (props) => {
  const { order } = useContext(OrderViewContext);
  const history = useHistory();
  const { location } = history;
  const backUrl = useMemo(() => (location.state ? location?.state?.back?.pathname : '/orders'), [order?.id]);
  const goBackRender = useMemo(() => {
    return (
      <LinkGoBackRenderProps location={location} defaultUrl={'/orders'}>
        {() => <IconDeprecated name={'backArrowOrange'} className={'pointer'} onClick={() => history.push(backUrl)} />}
      </LinkGoBackRenderProps>
    );
  }, [location, history]);
  return (
    <div className="order-view-head">
      <div className="order-view-head-top">
        {goBackRender}
        <div className="order-view-title">
          <span className={'view-id'}>
            {`${order?.orderUiState?.state < 200 ? 'Заявка' : 'Рейс'} № ${`${
              order?.orderUiState?.state > 200 && order?.orderNr ? order?.orderNr : order?.requestNr
            } `}`}
          </span>
          <span>
            {'от ' +
              (order?.createdAt
                ? moment.unix(order.createdAt).format('DD MMMM, YYYY')
                : Utils.formatDate(order?.startAtLocal))}
          </span>
        </div>
        <div className="order-view-head-actions">
          <div className="flexbox">
            <OrderViewActions />
          </div>
          <OrderViewMenu />
        </div>
      </div>
      <div className="order-view-head-problem">
        <OrderViewProblem />
      </div>
    </div>
  );
};

export default OrderViewHead;
