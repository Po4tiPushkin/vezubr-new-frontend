import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';

function useColumns() {
  return useMemo(
    () => [
      {
        title: 'ID',
        width: 75,
        dataIndex: 'id',
        key: 'id',
        sorter: true,
        render: (id) => {
          return <VzTable.Cell.TextOverflow>{id}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'Название',
        width: 100,
        dataIndex: 'title',
        key: 'title',
        sorter: true,
        render: (title) => {
          return <VzTable.Cell.TextOverflow>{title}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'Код',
        width: 100,
        dataIndex: 'code',
        key: 'code',
        sorter: true,
        render: (code) => {
          return <VzTable.Cell.TextOverflow>{code}</VzTable.Cell.TextOverflow>;
        },
      },

    ],
    [],
  );
}

export default useColumns;
