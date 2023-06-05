import moment from 'moment';
import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

const ROLES = {
  4: t.reg('dispatcher'),
  1: t.reg('contractor'),
}

function useColumns({ dictionaries }) {
  const columns = useMemo(
    () => [
      {
        title: t.clients('table.id'),
        width: 75,
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        sorter: true,
        renderToExport: (id, record, index) => id,
        render: (id, record, index) => <LinkWithBack to={{ pathname: `/producer/counterparty/${id}/info` }}>{id}</LinkWithBack>,
      },
      {
        title: t.clients('table.type'),
        width: 75,
        dataIndex: 'type',
        key: 'type',
        sorter: true,
      },
      {
        title: t.clients('table.inn'),
        dataIndex: 'inn',
        key: 'inn',
        width: 150,
        sorter: true,
      },
      {
        title: t.clients('table.name'),
        dataIndex: 'name',
        key: 'name',
        className: 'col-text-narrow',
        sorter: true,
        width: 300,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.clients('Роль контрагента'),
        dataIndex: 'role',
        key: 'role',
        className: 'col-text-narrow',
        width: 300,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{ROLES[text]}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата регистрации',
        dataIndex: 'createDate',
        key: 'createDate',
        width: 150,
        render: (createDate) => (
          <VzTable.Cell.TextOverflow>
            {(createDate && moment(createDate).format('DD.MM.YYYY')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.clients('table.vatRate'),
        dataIndex: 'vatRate',
        key: 'vatRate',
        sorter: true,
        width: 100,
      },
      {
        title: t.clients('table.vehiclesCount'),
        dataIndex: 'vehiclesCount',
        key: 'vehiclesCount',
        sorter: true,
        width: 120,
      },

      {
        title: t.clients('table.pastOrdersCount'),
        dataIndex: 'pastOrdersCount',
        key: 'pastOrdersCount',
        sorter: true,
        width: 100,
      },

      {
        title: t.clients('table.cancelledOrdersCount'),
        dataIndex: 'cancelledOrdersCount',
        key: 'cancelledOrdersCount',
        sorter: true,
        width: 100,
      },

      {
        title: t.clients('table.cancelledOrdersRatio'),
        dataIndex: 'cancelledOrdersRatio',
        key: 'cancelledOrdersRatio',
        sorter: true,
        width: 100,
      },
      {
        title: t.clients('table.uiState'),
        dataIndex: 'uiState',
        key: 'uiState',
        sorter: true,
        width: 200,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.contractorStates[text]}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.clients('table.agent'),
        dataIndex: 'agentName',
        className: 'col-text-narrow',
        key: 'agentName',
        sorter: true,
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Контуры',
        dataIndex: 'contourNames',
        className: 'col-text-narrow',
        key: 'contourNames',
        sorter: true,
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Скоринг',
        dataIndex: 'scoringStatus',
        key: 'scoringStatus',
        className: 'col-text-narrow',
        fixed: 'right',
        width: 150,
        render: (statusId, record, index) => {
          if (!statusId) {
            return null;
          }
          return <VzTable.Cell.TextOverflow>{dictionaries?.scoringStatuses[statusId]}</VzTable.Cell.TextOverflow>;
        },
      },
    ],
    [dictionaries?.contractorStates, dictionaries?.scoringStatuses],
  );
  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
