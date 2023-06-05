import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import { ROLES } from '@vezubr/common/constants/constants';

function useColumns() {
  const columns = useMemo(
    () => [
      {
        title: '№',
        width: 75,
        dataIndex: 'number',
        key: 'number',
        render: (number, record, index) => (
          <VzTable.Cell.TextOverflow>{number}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'ИНН',
        width: 150,
        dataIndex: 'inn',
        key: 'inn',
        render: (number, record, index) => (
          <VzTable.Cell.TextOverflow>{number}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Роль',
        dataIndex: 'role',
        key: 'role',
        width: 200,
        render: (value) => <VzTable.Cell.TextOverflow>{value && ROLES[value]}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Наименование',
        width: 150,
        dataIndex: 'title',
        key: 'title',
        render: (number, record, index) => (
          <VzTable.Cell.TextOverflow>{number}</VzTable.Cell.TextOverflow>
        ),
      },
    ],
    [],
  );

  return columns;
}

export default useColumns;
