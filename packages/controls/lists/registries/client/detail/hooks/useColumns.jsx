import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';

import * as Order from '@vezubr/order/form';
import { LinkWithBack } from '@vezubr/components';
import AcceptOrderAction from '../actions/acceptOrderAction';
import moment from 'moment';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns({ reload, dictionaries, user, hasRejectedOrders }) {
  const columns = useMemo(
    () => [
      {
        title: '№',
        width: 50,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        renderToExport: (id, record, index) => id,
        render: (id, record, index) => (
          <LinkWithBack to={{ pathname: `/orders/${record.orderId}/documents` }}>{id}</LinkWithBack>
        ),
      },

      {
        title: 'Тип',
        width: 75,
        dataIndex: 'orderType',
        key: 'orderType',
        className: 'col-icon',
        fixed: 'left',
        render: (orderType, record, index) => Order.Icons.renderBitmapIconTruck(orderType, record.category, record.problem),
      },

      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        renderToExport: (orderNr) => orderNr,
        render: (id, record) => (
          <LinkWithBack to={{ pathname: `/orders/${record.orderId}/documents` }}>
            {id}
          </LinkWithBack>
        ),
      },
      {
        title: 'Статус рейса',
        dataIndex: 'uiStateForClient',
        key: 'uiStateForClient',
        width: 200,
        render: (text) => (
          <VzTable.Cell.Content>
            <VzTable.Cell.TextOverflow>
              {dictionaries?.performerUiStateForClient.find(el => el.id === text)?.title}
            </VzTable.Cell.TextOverflow>
          </VzTable.Cell.Content>
        )
      },
      {
        title: 'Дата подачи',
        width: 180,
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        render: (toStartAt) =>
          <VzTable.Cell.Content>{toStartAt && moment(toStartAt).format('DD.MM.YYYY HH:mm') || ''}</VzTable.Cell.Content>,
      },
      {
        title: 'Тип автоперевозки',
        dataIndex: 'category',
        key: 'category',
        width: 150,
        render: (category) => (
          <VzTable.Cell.TextOverflow>
            {dictionaries?.vehicleTypeCategories.find(item => item.id === category)?.title || ''}
          </VzTable.Cell.TextOverflow>
        )
      },
      {
        title: 'Сумма рейса (без НДС)',
        dataIndex: 'cost',
        width: 180,
        className: 'col-currency col-text-right',
        key: 'cost',
        render: (text, record, index) => {
          const sum = parseInt(text, 10);
          return currencyFormat.format(sum / 100);
        },
      },
      ...[
        user?.costWithVat ?
          {
            title: 'Сумма рейса (с НДС)',
            width: 200,
            dataIndex: 'costVatRate',
            key: 'costVatRate',
            className: 'col-currency col-text-left',
            render: (text, record, index) => {
              const sum = parseInt(record.cost, 10) || 0;
              const vatRate = parseInt(record.costVatRate, 10) || 0;
              if (vatRate) {
                return <VzTable.Cell.Content>{currencyFormat.format((sum + sum * (vatRate / 100)) / 100)}</VzTable.Cell.Content>
              }
              return <VzTable.Cell.Content>{currencyFormat.format(sum / 100)}</VzTable.Cell.Content>
            },
          }
          :
          []
      ],
      {
        title: 'Подтверждено',
        width: 180,
        dataIndex: 'calculationAcceptedByClientAt',
        key: 'calculationAcceptedByClientAt',
        render: (calculationAcceptedByClientAt) =>
          <VzTable.Cell.Content>{calculationAcceptedByClientAt && moment(calculationAcceptedByClientAt).format('DD.MM.YYYY HH:mm') || ''}</VzTable.Cell.Content>,
      },

      {
        title: 'Исполнитель',
        width: 250,
        dataIndex: 'producerName',
        className: 'col-text-narrow',
        key: 'producerName',
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>
            {`${record.executorSurname} ${record.executorName} ${record.executorPatronymic ? record.executorPatronymic : ''}`}
          </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Адрес подачи',
        dataIndex: 'firstAddress',
        className: 'col-text-narrow',
        key: 'firstAddress',
        width: 250,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Адрес доставки',
        dataIndex: 'lastAddress',
        className: 'col-text-narrow',
        key: 'lastAddress',
        width: 250,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: '',
        width: 160,
        dataIndex: 'accepted',
        key: 'accepted',
        fixed: 'right',
        className: 'col-text-right',
        renderToExport: '',
        render: (accepted, record) => (
          <AcceptOrderAction
            uiState={record.uiStateForClient}
            calculationId={record.calculationId}
            orderId={record.orderId}
            reload={reload}
            hasRejectedOrders={hasRejectedOrders}
          />
        ),
      },
    ],
    [user, hasRejectedOrders],
  );

  return columns;
}

export default useColumns;
