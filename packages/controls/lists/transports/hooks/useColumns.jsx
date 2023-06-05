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
          return <LinkWithBack to={{ pathname: `/transports/${record.id}` }}>{number}</LinkWithBack>;
        },
      },
      {
        title: t.transports('table.plateNumber'),
        dataIndex: 'plateNumber',
        key: 'plateNumber',
        width: 150,
        sorter: true,
        render: (plateNumber, record) => <LinkWithBack to={{ pathname: `/transports/${record.id}` }}>{plateNumber}</LinkWithBack>,
      },
      {
        title: t.transports('table.categoryType'),
        width: 150,
        dataIndex: 'category',
        key: 'category',
        sorter: true,
        renderToExport: (category) => Array.isArray(category) ?
          category.map(el => dictionaries.vehicleTypeCategories.find(item => item.id === el)?.title).join(', ')
          :
          category,
        render: (category) => {
          if (!Array.isArray(category)) {
            return ''
          }
          let categories = ' ';
          category.forEach(el => {
            categories += ` ${dictionaries.vehicleTypeCategories.find(item => item.id === el)?.title},`
          })
          categories = categories.slice(0, -1);
          return <>{categories}</>;
        },
      },
      {
        title: t.transports('table.bodyType'),
        width: 150,
        dataIndex: 'bodyTypeTitle',
        key: 'bodyTypeTitle',
        sorter: true,
        renderToExport: (bodyTypeTitle) => bodyTypeTitle,
        render: (bodyTypeTitle) => {
          return <VzTable.Cell.TextOverflow>{bodyTypeTitle}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: t.transports('table.markAndModel'),
        dataIndex: 'markAndModel',
        key: 'markAndModel',
        width: 150,
        sorter: true,
        render: (markAndModel) => <VzTable.Cell.TextOverflow>{markAndModel}</VzTable.Cell.TextOverflow>,
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
        title: t.transports('table.driversCount'),
        dataIndex: 'linkedDriversCount',
        key: 'linkedDriversCount',
        width: 150,
        sorter: true,
        render: (linkedDriversCount) => <VzTable.Cell.TextOverflow>{linkedDriversCount}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.executed'),
        dataIndex: 'finishedOrdersCount',
        key: 'finishedOrdersCount',
        width: 150,
        sorter: true,
        render: (finishedOrdersCount) => (
          <VzTable.Cell.TextOverflow>{finishedOrdersCount.toString()}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.transports('table.crashCount'),
        dataIndex: 'crashCount',
        key: 'crashCount',
        width: 150,
        sorter: true,
        render: (crashCount) => <VzTable.Cell.TextOverflow>{crashCount.toString()}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.onLine'),
        dataIndex: 'isOnline',
        key: 'isOnline',
        width: 150,
        sorter: true,
        render: (isOnline) => <VzTable.Cell.TextOverflow>{isOnline ? t.common('yes') : t.common('no')}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.jobStarted'),
        dataIndex: 'exploitationStartDate',
        key: 'exploitationStartDate',
        width: 150,
        sorter: true,
        render: (exploitationStartDate) => (
          <VzTable.Cell.Content>{exploitationStartDate && moment(exploitationStartDate).format('DD.MM.YYYY') || ''}</VzTable.Cell.Content>
        ),
      },
      {
        title: t.transports('table.jobEnded'),
        dataIndex: 'exploitationFinishDate',
        key: 'exploitationFinishDate',
        width: 150,
        sorter: true,
        render: (exploitationEndDate) => (
          <VzTable.Cell.TextOverflow>{exploitationEndDate || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.transports('table.liftingCapacityInKg'),
        dataIndex: 'liftingCapacityInKg',
        key: 'liftingCapacityInKg',
        width: 150,
        sorter: true,
        render: (liftingCapacityInKg) => <VzTable.Cell.TextOverflow>
          {liftingCapacityInKg ? liftingCapacityInKg / 1000 : ''}
        </VzTable.Cell.TextOverflow>,
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
        dataIndex: 'palletsCapacity',
        key: 'palletsCapacity',
        width: 150,
        sorter: true,
        render: (palletsCapacity) => <VzTable.Cell.TextOverflow>{palletsCapacity}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.craneCapacity'),
        dataIndex: 'craneCapacity',
        key: 'craneCapacity',
        width: 150,
        sorter: true,
        render: (craneCapacity) => <VzTable.Cell.TextOverflow>{craneCapacity ? craneCapacity / 1000 : ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.craneLength'),
        dataIndex: 'craneLength',
        key: 'craneLength',
        width: 150,
        sorter: true,
        render: (craneLength) => <VzTable.Cell.TextOverflow>{craneLength ? craneLength / 100 : ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.passengersCapacity'),
        dataIndex: 'passengersCapacity',
        key: 'passengersCapacity',
        width: 150,
        sorter: true,
        render: (passengersCapacity) => <VzTable.Cell.TextOverflow>{passengersCapacity}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.volume'),
        dataIndex: 'volume',
        key: 'volume',
        width: 150,
        sorter: true,
        render: (volume) => <VzTable.Cell.TextOverflow>{volume}</VzTable.Cell.TextOverflow>,
      },
      ...[
        APP === 'dispatcher' ?
          {
            title: t.transports('table.producer'),
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

  return columns
}

export default useColumns;
