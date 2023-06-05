import React, { useCallback } from 'react';
import cn from 'classnames';

function useRowClassName() {
  return useCallback((record, index) => {
    let colorRow = '';

    return cn(colorRow);
  }, []);
}

export default useRowClassName;
