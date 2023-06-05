import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';

function useColumns({ dictionaries }) {
  return useMemo(
    () => [
      {
        title: t.driver('table.id'),
        width: 75,
        dataIndex: 'id',
        key: 'driverId',
        fixed: 'left',
        sorter: true,
        renderToExport: (id, record, index) => id,
        render: (id, record, index) => <LinkWithBack to={{ pathname: `/drivers/${id}` }}>{id}</LinkWithBack>,
      },
      {
        title: t.driver('table.producer'),
        width: 200,
        dataIndex: 'producer.companyShortName',
        key: 'producer',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.lastName'),
        width: 120,
        dataIndex: 'surname',
        className: 'col-text-narrow',
        key: 'surname',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.name'),
        width: 120,
        dataIndex: 'name',
        key: 'name',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.patronymic'),
        width: 120,
        dataIndex: 'patronymic',
        key: 'patronymic',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.applicationPhone'),
        dataIndex: 'applicationPhone',
        key: 'applicationPhone',
        width: 180,
        sorter: true,
      },

      {
        title: t.driver('table.contactPhone'),
        dataIndex: 'contactPhone',
        key: 'contactPhone',
        sorter: true,
        width: 180,
      },
      {
        title: t.driver('table.driverLicenseNumber'),
        dataIndex: 'driverLicenseId',
        key: 'driverLicenseId',
        sorter: true,
        width: 160,
      },
      {
        title: t.driver('table.ratingByClients'),
        dataIndex: 'ratingByClients',
        key: 'ratingByClients',
        sorter: true,
        width: 120,
      },
      {
        title: t.driver('table.vehicleCount'),
        dataIndex: 'vehiclesCount',
        key: 'vehiclesCount',
        sorter: true,
        width: 120,
      },
      {
        title: t.driver('table.lastOrderDate'),
        dataIndex: 'lastOrderDate',
        key: 'lastOrderDate',
        sorter: true,
        width: 200,
        render: (lastOrderDate) => 
        <VzTable.Cell.Content>{lastOrderDate && moment(lastOrderDate).format('DD.MM.YYYY') || ''}</VzTable.Cell.Content>,
      },
      {
        title: t.driver('table.closedOrdersCount'),
        dataIndex: 'closedOrdersCount',
        key: 'closedOrdersCount',
        sorter: true,
        width: 130,
      },
      {
        title: t.driver('table.neverDelegate'),
        dataIndex: 'neverDelegate',
        key: 'avoidDelegation',
        sorter: true,
        width: 140,
      },
      {
        title: t.clients('table.uiState'),
        dataIndex: 'uiState',
        key: 'systemState',
        sorter: true,
        render: (uiState, record, index) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.unitUiStates.find(el => el.id === uiState)?.title}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Скоринг',
        dataIndex: 'scoringStatus',
        key: 'scoringStatus',
        className: 'col-text-narrow',
        fixed: 'right',
        width: 150,
        render: (statusId, record, index) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.scoringStatuses[statusId]}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'ID самсаб',
        dataIndex: 'externalId',
        key: 'externalId',
        className: 'col-text-narrow',
        fixed: 'right',
        width: 100,
        render: (statusId, record, index) => <VzTable.Cell.TextOverflow>{statusId}</VzTable.Cell.TextOverflow>,
      },
    ],
    [dictionaries?.unitUiStates, dictionaries?.scoringStatuses],
  );
}

export default useColumns;
