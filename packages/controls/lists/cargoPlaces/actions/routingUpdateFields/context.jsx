import React from 'react';

const CargoPlaceChangeContext = React.createContext(null);
const CargoPlaceSelectContext = React.createContext(null);
const RouteContext = React.createContext({
  store: null,
});

export {CargoPlaceChangeContext, CargoPlaceSelectContext, RouteContext};