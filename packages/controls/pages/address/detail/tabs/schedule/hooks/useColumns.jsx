import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';

function useColumns() {
  const columns = useMemo(
    () => [
      {
        title: 'День',
        width: 200,
        dataIndex: 'day',
        key: 'day',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Окна доставки',
        dataIndex: 'workTime',
        key: 'workTime',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text.map((el) => `${el}; \xa0\xa0\xa0\xa0`)} </VzTable.Cell.TextOverflow>,
      },
    ],
    [],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
