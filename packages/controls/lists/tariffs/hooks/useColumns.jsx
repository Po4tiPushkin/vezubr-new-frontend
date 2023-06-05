import React, { useMemo } from 'react';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import { TARIFF_TYPES } from "@vezubr/tariff";
import t from '@vezubr/common/localization';

function useColumns({ territories }) {
  const columns = useMemo(
    () => [
      {
        title: t.common('indexNumber'),
        width: 100,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        renderToExport: false,
        render: (number, record, index) => <LinkWithBack to={{ pathname: `/tariffs/${record.id}` }}>{number}</LinkWithBack>,
      },
      {
        title: 'Название',
        width: 200,
        dataIndex: 'title',
        key: 'title',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <LinkWithBack to={{ pathname: `/tariffs/${record.id}` }}>{text}</LinkWithBack>,
      },
      {
        title: 'Тип',
        width: 100,
        dataIndex: 'type',
        key: 'type',
        className: 'col-text-narrow',
        sorter: true,
        render: (type, record, index) =>
          <VzTable.Cell.TextOverflow>
            {record.orderType === 'loaders_order' ? 'ПРР' : TARIFF_TYPES[type]}
          </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Территория',
        width: 200,
        dataIndex: 'territoryId',
        className: 'col-text-narrow',
        key: 'territoryId',
        sorter: true,
        render: (territoryId, record, index) => (
          <VzTable.Cell.TextOverflow>{territories[territoryId]?.title}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'От, час',
        width: 120,
        dataIndex: 'dayHourFrom',
        key: 'dayHourFrom',
        sorter: true,
      },
      {
        title: 'До, час',
        dataIndex: 'dayHourTill',
        key: 'dayHourTill',
        sorter: true,
      },
    ],
    [territories],
  );

  return columns;
}

export default useColumns;
