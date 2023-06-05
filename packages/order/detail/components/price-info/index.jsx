import React, { useMemo, useContext } from "react";
import { getPriceInfo } from "../../utils";
import { useSelector } from 'react-redux';
import { OrderSidebarInfos } from '@vezubr/components';
import OrderViewContext from "../../context";
const OrderPriceInfo = (props) => {
  const { order } = useContext(OrderViewContext);
  const user = useSelector(state => state.user);
  const priceInfo = useMemo(() => {
    return getPriceInfo(order, user)
  }, [order, user]);
  return (
    <OrderSidebarInfos data={priceInfo} />
  )
}

export default OrderPriceInfo;