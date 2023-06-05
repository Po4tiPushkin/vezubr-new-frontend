import React, { useContext } from "react";
import { OrderSidebarInfos } from '@vezubr/components';
import OrderViewContext from "../../context";
const OrderViewImplementer = (props) => {
  const { order } = useContext(OrderViewContext);
  return (
    <>
      <div className="info-title">Пользователи</div>
      <OrderSidebarInfos data={[{ title: "В работе у", value: order?.implementerEmployee?.fullName || '-' }]} />
    </>
  )
}

export default OrderViewImplementer;