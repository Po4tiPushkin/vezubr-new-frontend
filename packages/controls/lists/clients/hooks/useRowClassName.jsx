import React, { useCallback } from 'react';
import cn from 'classnames';

function useRowClassName() {
  return useCallback((record, index) => {
    let colorRow = '';
    const { hasResponsible } = record;

    if (!hasResponsible) {
      colorRow = 'red';
    }

    return cn(colorRow);
  }, []);
}

export default useRowClassName;
