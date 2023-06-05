import React, { useCallback } from 'react';
import * as Monitor from '../../..';
import { STORE_VAR_ASSIGN_LOADERS_TO_ORDER, STORE_VAR_ASSIGN_VEHICLE_TO_ORDER } from '../../constants';

export default function useAssignAction(orderType) {
  const { store } = React.useContext(Monitor.Context);
  return useCallback(
    (item) =>
      store.setVar(orderType !== 2 ? STORE_VAR_ASSIGN_VEHICLE_TO_ORDER : STORE_VAR_ASSIGN_LOADERS_TO_ORDER, item.id),
    [],
  );
}
