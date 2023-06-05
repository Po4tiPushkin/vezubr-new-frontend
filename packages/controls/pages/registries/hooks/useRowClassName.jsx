import moment from 'moment';
import React, { useCallback } from 'react';
import Utils from '@vezubr/common/common/utils';
import cn from 'classnames';

function useRowClassName() {
  return useCallback((record, index) => {
    const gluedType = record._gluedType ? `glued-type-${record._gluedType}` : '';
    const { status, isAllOrdersAccepted, isHasRejectedOrders, acceptingAvailable, uiState } = record;
    let colorRow = 'none';
    if (uiState === 530 || (uiState === 510 && isHasRejectedOrders)) {
      colorRow = 'red';
    }

    if (uiState === 520) {
      colorRow = 'blue';
    }

    if (uiState === 540) {
      colorRow = 'yellow';
    }

    if (uiState === 560) {
      colorRow = 'grey';
    }

    return cn(colorRow, gluedType);
  }, []);
}

export default useRowClassName;
