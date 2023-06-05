import React, { useCallback } from 'react';

function useRowClassName() {
  return useCallback((record) => {

    const isAvailableCoordinates = record?.latitude && record?.longitude;

    const isAvailableVerified = record?.verifiedBy?.fullName;

    const isAvailableContacts = record?.contacts[0] && isAvailableVerified,
          isAvailablePhone = record?.phone && isAvailableVerified;

    if (!isAvailableCoordinates) {
      return 'red';
    }

    if(!isAvailableVerified) {
      return 'grey';
    }

    if (!isAvailableContacts || !isAvailablePhone) {
      return 'yellow';
    }

    return 'blue'
  }, []);
}

export default useRowClassName;
