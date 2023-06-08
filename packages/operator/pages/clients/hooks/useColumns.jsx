import moment from 'moment';
import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

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
        render: (id, record, index) => <LinkWithBack to={{ pathname: `/client/counterparty/${id}/info` }}>{id}</LinkWithBack>,
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
        className: 'col-text-narrow',
        key: 'name',
        sorter: true,
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
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
        title: t.clients('table.balance'),
        dataIndex: 'balance',
        key: 'balance',
        className: 'col-currency col-text-right',
        sorter: true,
        width: 150,
        render: (text, record, index) => {
          const sum = parseInt(text, 10);
          return currencyFormat.format(sum / 100);
        },
      },
      {
        title: t.clients('table.creditLimit'),
        dataIndex: 'creditLimit',
        key: 'creditLimit',
        className: 'col-currency col-text-right',
        sorter: true,
        width: 150,
        render: (text, record, index) => {
          const sum = parseInt(text, 10);
          return currencyFormat.format(sum / 100);
        },
      },
      {
        title: t.clients('table.paymentDelayInDays'),
        dataIndex: 'paymentDelayInDays',
        key: 'paymentDelayInDays',
        width: 100,
        sorter: true,
      },
      {
        title: t.clients('table.activeOrdersCount'),
        dataIndex: 'activeOrdersCount',
        key: 'activeOrdersCount',
        width: 100,
        sorter: true,
      },
      {
        title: t.clients('table.cancelledOrdersCount'),
        dataIndex: 'cancelledOrdersCount',
        key: 'cancelledOrdersCount',
        width: 110,
        sorter: true,
      },
      {
        title: t.clients('table.cancelledOrdersRatio'),
        dataIndex: 'cancelledOrdersRatio',
        key: 'cancelledOrdersRatio',
        width: 100,
        sorter: true,
      },
      {
        title: t.clients('table.uiState'),
        dataIndex: 'uiState',
        key: 'uiState',
        sorter: true,
        width: 200,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.contractorStates?.[text]}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.clients('table.agent'),
        dataIndex: 'agentName',
        className: 'col-text-narrow',
        key: 'agentName',
        width: 200,
        sorter: true,
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
          return <VzTable.Cell.TextOverflow>{dictionaries?.scoringStatuses?.[statusId]}</VzTable.Cell.TextOverflow>;
        },
      },
    ],
    [dictionaries?.contractorStates, dictionaries?.scoringStatuses],
  );
  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
