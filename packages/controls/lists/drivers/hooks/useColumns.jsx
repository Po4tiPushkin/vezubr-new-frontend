import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { VzTable, IconDeprecated } from '@vezubr/elements';
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
          return <LinkWithBack to={{ pathname: `/drivers/${record.id}` }}>{number}</LinkWithBack>;
        },
      },
      {
        title: t.driver('table.lastName'),
        width: 150,
        dataIndex: 'surname',
        key: 'surname',
        sorter: true,
        render: (surname, record) => <LinkWithBack to={{ pathname: `/drivers/${record.id}` }}>{surname}</LinkWithBack>,
      },
      {
        title: t.driver('table.name'),
        width: 150,
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        render: (name) => <VzTable.Cell.TextOverflow>{name}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.patronymic'),
        width: 150,
        dataIndex: 'patronymic',
        key: 'patronymic',
        sorter: true,
        render: (patronymic) => <VzTable.Cell.TextOverflow>{patronymic}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.applicationPhone'),
        width: 150,
        dataIndex: 'applicationPhone',
        key: 'applicationPhone',
        sorter: true,
        render: (applicationPhone) => <VzTable.Cell.TextOverflow>{applicationPhone}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.contactPhone'),
        width: 150,
        dataIndex: 'contactPhone',
        key: 'contactPhone',
        sorter: true,
        render: (contactPhone) => <VzTable.Cell.TextOverflow>{contactPhone}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.driverLicenseNumber'),
        width: 150,
        dataIndex: 'driverLicenseNumber',
        key: 'driverLicenseNumber',
        sorter: true,
        render: (driverLicenseNumber) => <VzTable.Cell.TextOverflow>{driverLicenseNumber}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.vehicleCount'),
        width: 100,
        dataIndex: 'vehiclesCount',
        key: 'vehiclesCount',
        sorter: true,
        render: (vehiclesCount) =>
          <>
            {vehiclesCount}
            {vehiclesCount === 0 ? <IconDeprecated name="danger" title="У данного водителя отсутствуют привязанные ТС, он не сможет учавствовать в рейсах" /> : ''}
          </>,
      },
      {
        title: t.driver('table.lastOrderDate'),
        width: 150,
        dataIndex: 'lastOrderDate',
        key: 'lastOrderDate',
        sorter: true,
        render: (lastOrderDate) => <VzTable.Cell.TextOverflow>{lastOrderDate && moment(lastOrderDate).format('DD.MM.YYYY HH:mm') || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.closedOrdersCount'),
        width: 150,
        dataIndex: 'closedOrdersCount',
        key: 'closedOrdersCount',
        sorter: true,
        render: (closedOrdersCount) => (
          <VzTable.Cell.TextOverflow>{closedOrdersCount.toString()}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.driver('table.problemOrdersCount'),
        width: 150,
        dataIndex: 'problemsCount',
        key: 'problemsCount',
        sorter: true,
        render: (problemsCount) => (
          <VzTable.Cell.TextOverflow>{problemsCount || '0'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.driver('table.neverDelegate'),
        width: 150,
        dataIndex: 'neverDelegate',
        key: 'neverDelegate',
        sorter: true,
        render: (neverDelegate) => (
          <VzTable.Cell.TextOverflow>{neverDelegate ? t.common('on') : t.common('off')}</VzTable.Cell.TextOverflow>
        ),
      },
      ...[
        APP === 'dispatcher' ?
          {
            title: t.driver('table.producer'),
            width: 150,
            dataIndex: 'producerTitle',
            key: 'producerTitle',
            sorter: true,
            render: (producerTitle) => (
              <VzTable.Cell.TextOverflow>{producerTitle || ''}</VzTable.Cell.TextOverflow>
            ),
          }
          :
          {}
      ],
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
        width: 150,
        dataIndex: 'uiState',
        key: 'uiState',
        sorter: true,
        render: (uiState) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.driverUiState.find(el => el.id === uiState)?.title}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Начало работы',
        width: 150,
        dataIndex: 'startWorkDate',
        key: 'startWorkDate',
        sorter: true,
        render: (startWorkDate) => (
          <VzTable.Cell.TextOverflow>{startWorkDate && moment(startWorkDate).format('DD.MM.YYYY HH:mm') || ''}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Конец работы',
        width: 150,
        dataIndex: 'endWorkDate',
        key: 'endWorkDate',
        sorter: true,
        render: (endWorkDate) => (
          <VzTable.Cell.TextOverflow>{endWorkDate && moment(endWorkDate).format('DD.MM.YYYY HH:mm') || ''}</VzTable.Cell.TextOverflow>
        ),
      },
    ],
    [dictionaries],
  );

  return columns;
}

export default useColumns;
