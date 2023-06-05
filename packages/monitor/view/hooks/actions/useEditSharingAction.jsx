import React, { useCallback } from 'react';
import * as Monitor from '../../..';
import { STORE_VAR_EDIT_SHARING } from '../../constants';

export default function useEditSharingAction() {
  const { store } = React.useContext(Monitor.Context);
  return useCallback((item) => store.setVar(STORE_VAR_EDIT_SHARING, item.id), []);
}
