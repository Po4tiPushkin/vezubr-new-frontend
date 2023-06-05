import React, { useCallback } from 'react';
import cn from 'classnames';
import moment from 'moment';

function useRowClassName() {
  return useCallback((record, index) => {
    let colorRow = '';
    const { publishedAt, implementerEmployeeId } = record;

    if (APP !== 'client' && moment().diff(moment(publishedAt), 'hours') > 2 && !implementerEmployeeId) {
      colorRow = 'red';
    }

    return cn(colorRow);
  }, []);
}

export default useRowClassName;
