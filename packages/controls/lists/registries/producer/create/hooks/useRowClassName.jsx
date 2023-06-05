import moment from 'moment';
import React, { useCallback } from 'react';
import Utils from '@vezubr/common/common/utils';
import cn from 'classnames';

function useRowClassName() {
  return useCallback((record, index) => {
    const gluedType = record._gluedType ? `glued-type-${record._gluedType}` : '';
    const { status, acepted, isDocumentsAcceptedByClient, isCalcDocumentsAcceptedByClient, calculationAcceptedAtDate } = record;

    let colorRow = 'none';

    if (!isCalcDocumentsAcceptedByClient || !isDocumentsAcceptedByClient) {
      colorRow = 'red';
    }

    if (calculationAcceptedAtDate) {
      colorRow = 'blue';
    }

    return cn(colorRow, gluedType);
  }, []);
}

export default useRowClassName;
