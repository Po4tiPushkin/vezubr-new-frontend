import moment from 'moment';
import React, { useCallback } from 'react';
import Utils from '@vezubr/common/common/utils';
import cn from 'classnames';

function useRowClassName({ hasRejectedOrders }) {
  return useCallback((record, index) => {
    const gluedType = record._gluedType ? `glued-type-${record._gluedType}` : '';
    const { uiStateForClient } = record;

    let colorRow = 'none';
    if (([412, 414, 416].includes(uiStateForClient) && hasRejectedOrders) || uiStateForClient === 620) {
      colorRow = 'red';
    }

    if (uiStateForClient === 500) {
      colorRow = 'blue';
    }

    if (uiStateForClient === 630) {
      colorRow = 'grey';
    }

    return cn(colorRow, gluedType);
  }, [hasRejectedOrders]);
}

export default useRowClassName;
