import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import t from "@vezubr/common/localization";
import LinkWithBack from '@vezubr/components/link/linkWithBack';

function useColumns() {
  return useMemo(
    () => [
      {
        title: 'ID',
        width: 75,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        render: (number, record) => {
          return <VzTable.Cell.TextOverflow>
            <LinkWithBack to={{ pathname: `/insurers/${record.id}` }}>{number}</LinkWithBack>
          </VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'ИНН',
        width: 125,
        dataIndex: 'inn',
        key: 'inn',
        render: (inn, record) => {
          return <VzTable.Cell.TextOverflow>
          <LinkWithBack to={{ pathname: `/insurers/${record.id}` }}>{inn}</LinkWithBack>
        </VzTable.Cell.TextOverflow>;;
        },
      },
      {
        title: 'Название',
        width: 300,
        dataIndex: 'title',
        key: 'title',
        render: (title) => {
          return <VzTable.Cell.TextOverflow>{title}</VzTable.Cell.TextOverflow>;
        },
      },
    ],
    [],
  );
}

export default useColumns;
