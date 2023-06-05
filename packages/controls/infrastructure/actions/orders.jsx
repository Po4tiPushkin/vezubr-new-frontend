import { Orders as OrdersService } from '@vezubr/services';
const getOrders = (filters) => {
  return async (dispatch) => {
    dispatch({ type: 'ORDERS_LOADING_DATA', payload: true });

    const payload = await OrdersService.orders(filters);

    dispatch({ type: 'GET_FILTERED_ORDERS_SUCCESS', payload });

    dispatch({ type: 'ORDERS_LOADING_DATA', payload: false });
  };
};

const getProducerOrders = (filters) => {
  return async (dispatch) => {
    dispatch({ type: 'ORDERS_LOADING_DATA', payload: true });

    const payload = await OrdersService.ordersList(filters);

    dispatch({ type: 'GET_FILTERED_ORDERS_PRODUCER_SUCCESS', payload });

    dispatch({ type: 'ORDERS_LOADING_DATA', payload: false });
  };
};

const getOperatorOrders = getProducerOrders;

export { getOrders, getProducerOrders, getOperatorOrders };
