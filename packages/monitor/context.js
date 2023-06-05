import React from 'react';

const MonitorContext = React.createContext({
  store: null,
  fetchOrders: () => {},
  fetchVehicles: () => {},
  deleteOrder: () => {},
  loadData: () => {},
  replaceData: () => {},
});

export { MonitorContext };
