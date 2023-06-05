import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { VzTable } from '@vezubr/elements';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import moment from 'moment';

function useColumns({ dictionaries }) {
  const columns = useMemo(
    () => [
      {
        title: t.common('indexNumber'),
        width: 100,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        renderToExport: false,
        render: (number, record) => {
          return <LinkWithBack to={{ pathname: `/trailers/${record.id}` }}>{number}</LinkWithBack>;
        },
      },
      {
        title: 'Госномер',
        width: 150,
        dataIndex: 'plateNumber',
        key: 'plateNumber',
        sorter: true,
        renderToExport: (plateNumber) => plateNumber,
        render: (plateNumber, record) => {
          return <LinkWithBack to={{ pathname: `/trailers/${record.id}` }}>{plateNumber}</LinkWithBack>;
        },
      },
      {
        title: 'Марка',
        dataIndex: 'markAndModel',
        key: 'markAndModel',
        width: 150,
        sorter: true,
        renderToExport: (markAndModel) => markAndModel,
        render: (markAndModel) => {
          return <VzTable.Cell.TextOverflow>{markAndModel}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: t.transports('table.categoryType'),
        width: 150,
        dataIndex: 'category',
        key: 'category',
        sorter: true,
        renderToExport: (category) => category ? dictionaries?.vehicleTypeCategories.find(item => item.id === category)?.title : '',
        render: (category) => {
          return <VzTable.Cell.TextOverflow>
            {category ? dictionaries?.vehicleTypeCategories.find(item => item.id === category)?.title : ''}
          </VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'Тип Кузова',
        width: 150,
        dataIndex: 'bodyType',
        key: 'bodyType',
        sorter: true,
        renderToExport: (bodyType) => bodyType,
        render: (bodyType) => {
          return <VzTable.Cell.TextOverflow>{dictionaries?.vehicleBodies?.find(el => bodyType === el?.id)?.title}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'Статус в системе',
        width: 150,
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        render: (status) => (
          <VzTable.Cell.TextOverflow>{status === 'active' ? 'Активный' : 'Неактивный'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Статус в рейсе',
        dataIndex: 'uiState',
        key: 'uiState',
        width: 150,
        sorter: true,
        render: (uiStatus) => <VzTable.Cell.TextOverflow>{dictionaries?.vehicleUiState?.find(el => el.id === uiStatus)?.title}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.liftingCapacityInKg'),
        width: 200,
        dataIndex: 'liftingCapacityInKg',
        key: 'liftingCapacityInKg',
        sorter: true,
        renderToExport: (liftingCapacityInKg) => liftingCapacityInKg && (liftingCapacityInKg / 1000),
        render: (liftingCapacityInKg) => (
          <VzTable.Cell.TextOverflow>{liftingCapacityInKg && (liftingCapacityInKg / 1000)}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Грузоподъемность min-max',
        dataIndex: 'liftingCapacityMin',
        key: 'liftingCapacityMin',
        width: 150,
        render: (liftingCapacityMin, record) => <VzTable.Cell.TextOverflow>
          {
            `${liftingCapacityMin ? liftingCapacityMin / 1000 : '0'}-${record.liftingCapacityMax ? record.liftingCapacityMax / 1000 : '0'}`
          }
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.palletsCapacity'),
        width: 150,
        dataIndex: 'palletsCapacity',
        key: 'palletsCapacity',
        sorter: true,
        renderToExport: (palletsCapacity) => palletsCapacity,
        render: (palletsCapacity) => <VzTable.Cell.TextOverflow>{palletsCapacity}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.platformLength'),
        dataIndex: 'platformLength',
        key: 'platformLength',
        width: 160,
        sorter: true,
        render: (platformLength) => <VzTable.Cell.TextOverflow>{platformLength ? platformLength / 100 : ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.platformHeight'),
        dataIndex: 'platformHeight',
        key: 'platformHeight',
        width: 160,
        sorter: true,
        render: (platformHeight) => <VzTable.Cell.TextOverflow>{platformHeight ? platformHeight : ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.arCount'),
        dataIndex: 'carCount',
        key: 'carCount',
        width: 180,
        sorter: true,
        render: (carCount) => <VzTable.Cell.TextOverflow>{carCount}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.isCarTransporterCovered'),
        dataIndex: 'carTransporterCovered',
        key: 'isCarTransporterCovered',
        width: 150,
        sorter: true,
        render: (carTransporterCovered) => <VzTable.Cell.TextOverflow>{carTransporterCovered ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.compartmentCount'),
        dataIndex: 'compartmentCount',
        key: 'compartmentCount',
        width: 190,
        sorter: true,
        render: (compartmentCount) => <VzTable.Cell.TextOverflow>{compartmentCount}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.volume'),
        width: 110,
        dataIndex: 'volume',
        key: 'volume',
        sorter: true,
        renderToExport: (volume) => volume,
        render: (volume) => <VzTable.Cell.TextOverflow>{volume}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Поломок',
        width: 150,
        dataIndex: 'crashCount',
        key: 'crashCount',
        sorter: true,
        renderToExport: (crashCount) => crashCount,
        render: (crashCount) => <VzTable.Cell.TextOverflow>{crashCount}</VzTable.Cell.TextOverflow>,
      },
      ...[
        APP === 'dispatcher' ?
          {
            title: t.transports('table.producer'),
            width: 150,
            dataIndex: 'producer',
            key: 'producerTitle',
            width: 150,
            sorter: true,
            render: (producer) => <VzTable.Cell.TextOverflow>{producer?.title}</VzTable.Cell.TextOverflow>,
          }
          :
          {}
      ],
    ],
    [dictionaries?.transportOrderStatuses, dictionaries?.vehicleTypes],
  );

  return columns;
}

export default useColumns;
