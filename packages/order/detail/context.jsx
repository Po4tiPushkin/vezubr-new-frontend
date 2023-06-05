import React from 'react';

const OrderViewContext = React.createContext({
  order: {
    cargoPlaceData: []
  },
  reload: () => { },
  actions: {},
  employees: [],
  responsibleEmployees: [],
  modal: { showModal: '', setShowModal: () => { } }
});

export default OrderViewContext;
