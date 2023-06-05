import React from 'react';
import { useObserver } from 'mobx-react';
import * as Monitor from '../..';

export default function useVehicleList() {
  const { store } = React.useContext(Monitor.Context);

  return useObserver(() => {
    const vehicleListPositions = store.getItemsFiltered('vehicle', null, null);
    return {
      vehicleListPositions,
    };
  });
}
