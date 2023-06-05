import React, { useMemo, useContext } from 'react';
import OrderViewHead from './head';
import OrderViewLeft from './left';
import OrderViewRight from './right';
import { LoaderFullScreen } from '@vezubr/elements';
const OrderView = (props) => {
  const { loading } = props;
  return (
    <>
      {loading ? (
        <LoaderFullScreen />
      ) : null}
      <div className="order-view-main">
        <OrderViewHead />
        <div className="order-view-content flexbox">
          <OrderViewLeft />
          <OrderViewRight />
        </div>
      </div>
    </>

  )
}

export default OrderView;