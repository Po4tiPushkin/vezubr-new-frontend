import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import t from '@vezubr/common/localization';
import { LinkWithBack } from '@vezubr/components';
import Accept from '../actions/accept';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns({ dictionaries, reload, user }) {
  const columns = useMemo(
    () => [
      {
        title: '№ реестра',
        width: 130,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        fixed: 'left',
        renderToExport: (number) => number || '-',
        render: (number, record) => {
          const { status } = record;
          return (
            <VzTable.Cell.Content>
              {status === 1 ? (
                <LinkWithBack
                  to={{
                    pathname: APP === 'dispatcher' ? `/registries/client/${record.id}` : `/registries/${record.id}`,
                  }}
                  id={`registries-number-${number}`}
                >
                  {number || 'unknown'}
                </LinkWithBack>
              ) : (
                number || 'unknown'
              )}
            </VzTable.Cell.Content>
          );
        },
      },
      {
        title: 'Дата реестра',
        width: 150,
        dataIndex: 'registryDate',
        key: 'registryDate',
        sorter: true,
        render: (registryDate) => (
          <VzTable.Cell.TextOverflow>
            {(registryDate && moment(registryDate).tz(moment.tz.guess()).format('DD.MM.YYYY HH:mm')) || ''}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Статус реестра',
        dataIndex: 'uiState',
        key: 'uiState',
        width: 200,
        render: (text) => (
          <VzTable.Cell.Content>
            <VzTable.Cell.TextOverflow>{dictionaries?.registryUiStage.find(el => el.id === text)?.title}</VzTable.Cell.TextOverflow>
          </VzTable.Cell.Content>
        )
      },
      {
        title: t.bills('table.status'),
        dataIndex: 'paymentState',
        key: 'payment_state',
        className: 'col-text-narrow',
        width: 200,
        sorter: true,
        render: (paymentState) => (
          <VzTable.Cell.Content>
            <VzTable.Cell.TextOverflow>{dictionaries?.invoices?.find(el => paymentState === el.id)?.title}</VzTable.Cell.TextOverflow>
          </VzTable.Cell.Content>
        ),
      },

      {
        title: t.bills('table.sumWithoutTax'),
        dataIndex: 'sumInCoins',
        key: 'sum_in_coins',
        className: 'col-currency col-text-right',
        sorter: true,
        width: 150,
        render: (text) => {
          const sum = parseInt(text, 10);
          return <VzTable.Cell.Content>{currencyFormat.format(sum / 100)}</VzTable.Cell.Content>;
        },
      },
      ...[
        user.costWithVat ?
          {
            title: 'Сумма с НДС',
            width: 200,
            dataIndex: 'costVatRate',
            key: 'costVatRate',
            className: 'col-currency col-text-left',
            render: (text, record, index) => {
              const sum = parseInt(record.sumInCoins, 10) || 0;
              const vatRate = parseInt(record.costVatRate, 10) || 0;
              if (vatRate) {
                return <VzTable.Cell.Content>{currencyFormat.format((sum + sum * (vatRate / 100)) / 100)}</VzTable.Cell.Content>
              }
              return <VzTable.Cell.Content>{currencyFormat.format(sum / 100)}</VzTable.Cell.Content>
            },
          }
          :
          {}
      ],
      {
        title: t.bills('table.ordersCount'),
        dataIndex: 'ordersCount',
        key: 'orders_count',
        width: 150,
        sorter: true,
        render: (text) => {
          return <VzTable.Cell.Content>{text}</VzTable.Cell.Content>;
        },
      },
      {
        title: t.bills('table.originalsReceived'),
        dataIndex: 'originalReceivedDate',
        key: 'original_received_date',
        sorter: true,
        width: 180,
        render: (dateString) => (
          <VzTable.Cell.TextOverflow>
            {(dateString && moment(dateString).format('DD.MM.YYYY')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.bills('table.originalsSent'),
        dataIndex: 'originalsSentDate',
        key: 'originals_sent_date',
        sorter: true,
        width: 180,
        render: (dateString) => (
          <VzTable.Cell.TextOverflow>
            {(dateString && moment(dateString).format('DD.MM.YYYY')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.bills('table.paymentFor'),
        dataIndex: 'paymentDeadlineDate',
        key: 'payment_deadline_date',
        sorter: true,
        width: 180,
        render: (dateString) => (
          <VzTable.Cell.TextOverflow>
            {(dateString && moment(dateString).format('DD.MM.YYYY')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: t.bills('table.payed'),
        dataIndex: 'payed_at',
        key: 'payed_at',
        width: 180,
      },

      {
        title: t.bills('table.contractor'),
        dataIndex: 'producerTitle',
        className: 'col-text-narrow',
        key: 'producer_title',
        width: 200,
        render: (text) => (
          <VzTable.Cell.Content>
            <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
          </VzTable.Cell.Content>
        ),
      },
      {
        title: 'Дата откл/прин',
        dataIndex: 'reformedAt',
        key: 'reformedAt',
        width: 150,
        render: (reformedAt, record) => {
          const isReject = record.status === 0;

          if (isReject) {
            return (
              <VzTable.Cell.Content className={'date-reject'}>
                {(reformedAt && moment(reformedAt).format("DD.MM.YYYY HH:mm")) || '-'}
              </VzTable.Cell.Content>
            )
          }

          return (
            <VzTable.Cell.Content className={'date-accept'}>
              {(record.acceptedAt && moment(record.acceptedAt).format("DD.MM.YYYY HH:mm")) || '-'}
            </VzTable.Cell.Content>
          )
        },
      },
      {
        title: '',
        width: 200,
        dataIndex: 'allOrdersAccepted',
        key: 'isAllOrdersAccepted',
        className: 'col-text-right',
        fixed: 'right',
        renderToExport: '',
        render: (allOrdersAccepted, record) => (
          <VzTable.Cell.Content>
            <Accept
              canReject={record.hasRejectedOrders}
              registryNumber={record.number}
              registryId={record.id}
              reload={reload}
              uiState={record.uiState}
              id={`registries-accept-${record?.number}`}
            />
          </VzTable.Cell.Content>
        ),
      },
    ],
    [dictionaries?.paymentStatus, reload, user],
  );

  return columns;
}

export default useColumns;
