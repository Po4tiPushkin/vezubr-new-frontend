import React from "react";
import { OrderViewTopInfo, OrderViewPriceInfo, OrderViewResponsibleEmployees } from '../../components';
import { OrderSidebarInfos } from '@vezubr/components';
import OrderViewImplementer from "../../components/implementer";
const OrderViewLeft = () => {
  return (
    <div style={{ minWidth: '34%' }} className="flexbox size-0_35 margin-right-15 column">
      <div className="order-view__left order-view__container-shadow">
        <OrderViewTopInfo />
        <div className={'info-title'}>{'Расчет'}</div>
        <OrderViewPriceInfo />
        <OrderViewImplementer />
        <OrderViewResponsibleEmployees />
      </div>
    </div>
  )
}

export default OrderViewLeft;