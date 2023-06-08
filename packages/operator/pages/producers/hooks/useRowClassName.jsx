import React, { useCallback } from 'react';
import cn from 'classnames';

function useRowClassName() {
  return useCallback((record, index) => {
    let colorRow = '';
    const { uiState } = record;
    switch (uiState) {
      case 1:
      case 7:
        colorRow = 'yellow';
        break;
      case 6:
      case 8:
      case 4:
        colorRow = 'red';
        break;
    }

    return cn(colorRow);
  }, []);
}

export default useRowClassName;
