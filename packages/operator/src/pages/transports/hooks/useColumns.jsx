import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import moment from 'moment';
import { VzTable } from '@vezubr/elements';

function useColumns({ dictionaries }) {
  return useMemo(
    () => [
      {
        title: 'ID',
        width: 75,
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        sorter: true,
        renderToExport: (id, record, index) => id,
        render: (id, record, index) => <LinkWithBack to={{ pathname: `/transports/${id}` }}>{id}</LinkWithBack>,
      },
      {
        title: t.driver('table.producer'),
        width: 250,
        dataIndex: 'companyName',
        key: 'companyName',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.type'),
        width: 150,
        dataIndex: 'vehicleTypeTitle',
        key: 'vehicleTypeTitle',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.bodyType'),
        width: 130,
        dataIndex: 'bodyTypeTitle',
        key: 'bodyTypeTitle',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: t.transports('table.classification'),
        dataIndex: 'vehicleConstructionType',
        key: 'vehicleConstructionType',
        width: 150,
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.vehicleConstructionTypes.find(el => el.id === text)?.title}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: t.transports('table.markAndModel'),
        dataIndex: 'markAndModel',
        key: 'markAndModel',
        width: 100,
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.plateNumber'),
        dataIndex: 'plateNumber',
        key: 'plateNumber',
        width: 150,
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.transports('table.driversCount'),
        dataIndex: 'linkedDriversCount',
        key: 'linkedDriversCount',
        width: 110,
        sorter: true,
      },
      {
        title: t.transports('table.executed'),
        dataIndex: 'orderCount',
        key: 'orderCount',
        width: 110,
        sorter: true,
      },
      {
        title: t.transports('table.crashCount'),
        dataIndex: 'crashCount',
        key: 'crashCount',
        width: 110,
        sorter: true,
      },
      {
        title: t.transports('table.uiStatus'),
        dataIndex: 'uiStatus',
        key: 'uiStatus',
        sorter: true,
        width: 200,
        render: (uiState, record, index) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.unitUiStates.find(el => el.id === uiState)?.title}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.transports('table.jobStarted'),
        dataIndex: 'exploitationStartDate',
        key: 'exploitationStartDate',
        sorter: true,
        render: (exploitationStartDate) => (
          exploitationStartDate && moment(exploitationStartDate).format('DD.MM.YYYY') || ''
        )
      },

      {
        title: 'Скоринг',
        dataIndex: 'scoring_status',
        key: 'scoring_status',
        className: 'col-text-narrow',
        fixed: 'right',
        width: 150,
        render: (statusId, record, index) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.scoringStatuses[statusId]}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'ID самсаб',
        dataIndex: 'external_id',
        key: 'external_id',
        className: 'col-text-narrow',
        fixed: 'right',
        width: 100,
        render: (statusId, record, index) => <VzTable.Cell.TextOverflow>{statusId}</VzTable.Cell.TextOverflow>,
      },
    ],
    [dictionaries?.unitUiStates, dictionaries?.scoringStatuses, dictionaries?.vehicleConstructionTypes],
  );
}

export default useColumns;
