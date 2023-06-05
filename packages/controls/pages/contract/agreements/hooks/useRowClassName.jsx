import moment from 'moment';
import { useCallback } from 'react';

function useRowClassName() {
  return useCallback((record) => {

    const { tariffAppoint, deleted } = record;
    let colorRow = 'none';

    if (tariffAppoint && !tariffAppoint.isTariffActive) {
      colorRow = 'red';
    }
    if (deleted) {
      colorRow = 'disabled';
    }
    return colorRow;
  }, []);
}

export default useRowClassName;
