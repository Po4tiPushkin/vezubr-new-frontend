import { createContext } from 'react';

const OrderContext = createContext({
  store: null,
});

const OrderPaymentContext = createContext({
  store: null,
});

const OrderCargoPlacesContext = createContext({
  store: null,
});

export { OrderContext, OrderPaymentContext, OrderCargoPlacesContext };
