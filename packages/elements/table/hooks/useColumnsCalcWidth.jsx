import React from 'react';
import { columnsDeleteLastWidth, columnsReduceWidth } from '../utils';

export default function (columnsInput) {
  return React.useMemo(() => {
    const width = columnsReduceWidth(columnsInput);
    return [columnsInput, width];
  }, [columnsInput]);
}
