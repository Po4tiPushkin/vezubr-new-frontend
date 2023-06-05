const ordersReducer = (
  state = {
    data: [],
    loading: false,
  },
  action,
) => {
  switch (action.type) {
    case 'GET_FILTERED_ORDERS_SUCCESS':
      return {
        ...state,
        data: action.payload,
      };
    case 'GET_FILTERED_ORDERS_PRODUCER_SUCCESS':
      return {
        ...state,
        data: action.payload.data,
      };
    case 'ORDERS_LOADING_DATA':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default ordersReducer;
