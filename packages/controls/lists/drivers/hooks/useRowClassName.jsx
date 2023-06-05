import React, { useCallback } from 'react';
import cn from 'classnames';

function useRowClassName() {
  return useCallback((record, index) => {
    let colorRow = '';
    const { orderUiState, problem, vehiclesCount } = record;
    switch (orderUiState) {
      case 1:
        colorRow = 'yellow';
        break;
      case 6:
      case 8:
        colorRow = 'red';
        break;
    }

    if (problem || vehiclesCount === 0) {
      colorRow = 'red';
    }

    return cn(colorRow);
  }, []);
}

export default useRowClassName;
