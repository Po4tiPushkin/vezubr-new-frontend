import React, { useCallback } from 'react';
import cn from 'classnames';

function useRowClassName() {
    return useCallback((record, index) => {
  
      return cn(record?.disabled ? 'disabled' : '');
    }, []);
  }
  
export default useRowClassName;
  