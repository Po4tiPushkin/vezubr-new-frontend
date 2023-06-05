import moment from 'moment';
import { useCallback } from 'react';

function useRowClassName() {
  return useCallback((record) => {

    const { uiState, hasRejectedOrders } = record;
    let colorRow = 'none';

    if (uiState === 530 || (uiState === 510 && hasRejectedOrders)) {
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

    return colorRow;
  }, []);
}

export default useRowClassName;
