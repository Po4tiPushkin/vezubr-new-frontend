import React, { useCallback } from 'react';

function useRowClassName() {
  return useCallback((record) => {

    if (!record?.deliveryPoint?.addressString || !record?.departurePoint?.addressString) {
      return 'red';
    }

    return null
  }, []);
}

export default useRowClassName;
