import React, { useCallback } from 'react';
import cn from 'classnames';

function useRowClassName() {
  return useCallback((record) => {
    let colorRow = '';
    let expandable = '';
    const { isDeleted, additionalAgreements } = record;

    if (isDeleted) {
      colorRow = 'red';
    }

    if (!additionalAgreements) {
      colorRow = 'red';
      expandable = 'unexpandable'
    }

    return cn(colorRow, expandable);
  }, []);
}

export default useRowClassName;
