import React, { useMemo } from 'react';
import { Utils } from '@vezubr/common/common';
import { VzTable } from '@vezubr/elements';

function useColumns({ territories, tariffTypes }) {
  return useMemo(
    () => [
      {
        title: 'ID',
        width: 75,
        dataIndex: 'id',
        key: 'id',
        defaultSortOrder: 'descend',
      },
      {
        title: 'Название',
        width: 200,
        dataIndex: 'title',
        key: 'title',
        className: 'col-text-narrow',
        sorter: (a, b) => Utils.stdCompare(a.title, b.title),
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Тип',
        width: 100,
        dataIndex: 'type',
        key: 'type',
        className: 'col-text-narrow',
        sorter: (a, b) => a.type - b.type,
        render: (type) => (
          <VzTable.Cell.TextOverflow>{tariffTypes.find(({ id }) => id == type)?.title}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Тип публикации',
        width: 200,
        dataIndex: 'publishingType',
        key: 'publishingType',
        className: 'col-text-narrow',
        sorter: (a, b) => a.publishingType - b.publishingType,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {text == 'rate' ? 'Ставка' : text == 'tariff' ? 'Тариф' : text == 'bargain' ? 'Торги' : '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Территория',
        width: 200,
        dataIndex: 'territoryId',
        className: 'col-text-narrow',
        key: 'territoryId',
        sorter: (a, b) => Utils.stdCompare(territories[a.territoryId], territories[b.territoryId]),
        render: (territoryId, record, index) => (
          <VzTable.Cell.TextOverflow>{territories[territoryId]?.title}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'От, час',
        width: 120,
        dataIndex: 'dayHourFrom',
        key: 'dayHourFrom',
        sorter: (a, b) => a.dayHourFrom - b.dayHourFrom,
      },
      {
        title: 'До, час',
        dataIndex: 'dayHourTill',
        key: 'dayHourTill',
        sorter: (a, b) => a.dayHourTill - b.dayHourTill,
      },
    ],
    [territories, tariffTypes],
  );
}

export default useColumns;
