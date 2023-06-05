const states = {
  selection: [102, 103, 201, 800, 801, 802],
  selectionEnding: [106, 107],
  execution: [301, 302, 303, 304, 305, 306, 307, 803, 804, 403],
  paperCheck: [401, 402, 404, 501, 502, 503, 504, 505],
};
const monitoringReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_MONITORING_SUCCESS':
      return action.payload;
    case 'GET_PRODUCER_MONITORING_SUCCESS':
      const orders = action.payload.data[action.userType];
      const monitoredOrders = {
        selection: [],
        selectionEnding: [],
        execution: [],
        paperCheck: [],
      };
      const keys = Object.keys(states);
      orders.map((order) => {
        keys.map((key) => {
          if (states[key].some((state) => state === order.uiState)) {
            monitoredOrders[key].push(order);
          }
        });
      });

      if (action.userType === 'loadersOrders') {
        monitoredOrders.selection = [].concat(monitoredOrders.selection, monitoredOrders.selectionEnding);
      }

      return monitoredOrders;

    case 'GET_OPERATOR_MONITORING_SUCCESS':
      return action.payload;
    default:
      return state;
  }
};

export default monitoringReducer;
