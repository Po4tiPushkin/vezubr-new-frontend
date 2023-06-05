import React, { useCallback } from 'react';
import cn from 'classnames';

function useRowClassName() {
  return useCallback((record, index) => {
    let colorRow = '';
    const { agreementId, contractId } = record;

    if (!contractId && !agreementId) {
      colorRow = 'yellow';
    }

    return cn(colorRow);
  }, []);
}

export default useRowClassName;
