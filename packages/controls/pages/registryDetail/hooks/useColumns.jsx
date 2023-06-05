import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import cn from 'classnames';
import * as Order from '@vezubr/order/form';
import moment from 'moment';
import { LinkWithBack } from '@vezubr/components';
import RegistryStatusAction from '../actions/registryStatusAction';
const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns(dictionaries, user, costVatRate, hasRejectedOrders) {
  return useMemo(
    () => [
      {
        title: '№ рейса',
        width: 100,
        dataIndex: 'orderId',
        key: 'orderId',
        fixed: 'left',
        renderToExport: (id, record, index) => id,
        render: (id, record, index) => (
          <LinkWithBack to={{ pathname: `/orders/${id}/documents` }}>
            {id}
          </LinkWithBack>
        ),
      },

      {
        title: 'Тип',
        width: 75,
        dataIndex: 'orderType',
        key: 'orderType',
        className: 'col-icon',
        fixed: 'left',
        render: (text, record, index) => Order.Icons.renderBitmapIconTruck(record.orderType, record.category, record.problem),
      },

      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        renderToExport: (orderNr) => orderNr,
        render: (id, record) => (
          <LinkWithBack to={{ pathname: `/orders/${record.orderId}/documents-producer` }}>
            {id}
          </LinkWithBack>
        ),
      },
      {
        title: 'Статус рейса',
        dataIndex: 'uiStateForProducer',
        key: 'uiStateForProducer',
        width: 200,
        render: (text) => (
          <VzTable.Cell.Content>
            <VzTable.Cell.TextOverflow>
              {dictionaries?.performerUiStateForProducer.find(el => el.id === text)?.title}
            </VzTable.Cell.TextOverflow>
          </VzTable.Cell.Content>
        )
      },
      {
        title: 'Номер заявки',
        dataIndex: 'requestNr',
        width: 200,
        key: 'requestNr',
        renderToExport: (requestNr) => requestNr,
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: 'Дата подачи',
        width: 130,
        dataIndex: 'toStartAtDate',
        key: 'toStartAtDate',
        render: (toStartDate) => (
          <VzTable.Cell.Content>{(toStartDate && moment(toStartDate).format('DD.MM.YYYY')) || ''}</VzTable.Cell.Content>
        ),
      },
      {
        title: 'Тип ТС',
        dataIndex: 'vehicleTypeId',
        key: 'vehicleTypeId',
        width: 150,
        render: (id, record, index) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.vehicleTypes?.[id]?.name}</VzTable.Cell.TextOverflow>
        ),
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
        user?.costWithVat
          ? {
            title: 'Сумма рейса (с НДС)',
            width: 200,
            key: 'costVatRate',
            className: 'col-currency col-text-left',
            render: (text, record, index) => {
              const sum = parseInt(record.cost, 10) || 0;
              const vatRate = parseInt(costVatRate, 10) || 0;
              if (vatRate) {
                return (
                  <VzTable.Cell.Content>
                    {currencyFormat.format((sum + sum * (vatRate / 100)) / 100)}
                  </VzTable.Cell.Content>
                );
              }
              return <VzTable.Cell.Content>{currencyFormat.format(sum / 100)}</VzTable.Cell.Content>;
            },
          }
          : [],
      ],
      {
        title: 'За ПО (без НДС)',
        dataIndex: 'feeInCoins',
        width: 150,
        className: 'col-currency col-text-right',
        key: 'feeInCoins',
        render: (text, record, index) => {
          const sum = parseInt(text, 10) || 0;
          return currencyFormat.format(sum / 100);
        },
      },
      ...[
        user?.costWithVat
          ? {
            title: 'За ПО (с НДС)',
            width: 200,
            key: 'costVatRate1',
            className: 'col-currency col-text-left',
            render: (text, record, index) => {
              const sum = parseInt(record.feeInCoins, 10) || 0;
              const vatRate = parseInt(costVatRate, 10) || 0;
              if (vatRate) {
                return (
                  <VzTable.Cell.Content>
                    {currencyFormat.format((sum + sum * (vatRate / 100)) / 100)}
                  </VzTable.Cell.Content>
                );
              }
              return <VzTable.Cell.Content>{currencyFormat.format(sum / 100)}</VzTable.Cell.Content>;
            },
          }
          : [],
      ],
      {
        title: 'Сумма исполнителю',
        key: 'producerSum',
        className: 'col-currency col-text-right',
        width: 160,
        render: (text, record, index) => {
          const orderSoftwareSum = parseInt(record.feeInCoins, 10) || 0;
          const orderSum = parseInt(record.cost, 10) || 0;
          return currencyFormat.format((orderSum - orderSoftwareSum) / 100);
        },
      },
      ...[
        user.costWithVat
          ? {
            title: 'Сумма исполнителю (с НДС)',
            width: 200,
            key: 'costVatRate2',
            className: 'col-currency col-text-left',
            render: (text, record, index) => {
              const orderSoftwareSum = parseInt(record.feeInCoins, 10) || 0;
              const orderSum = parseInt(record.cost, 10) || 0;
              const sum = orderSum - orderSoftwareSum;
              const vatRate = parseInt(costVatRate, 10) || 0;
              if (vatRate) {
                return (
                  <VzTable.Cell.Content>
                    {currencyFormat.format((sum + sum * (vatRate / 100)) / 100)}
                  </VzTable.Cell.Content>
                );
              }
              return <VzTable.Cell.Content>{currencyFormat.format(sum / 100)}</VzTable.Cell.Content>;
            },
          }
          : [],
      ],
      {
        title: 'Оплачено исполнителем',
        key: 'sumPayedInCoins',
        className: 'col-currency col-text-right',
        width: 180,
        render: (text, record, index) => {
          const sum = parseInt(text, 10) || 0;
          return currencyFormat.format(sum / 100);
        },
      },
      ...[
        user.costWithVat
          ? {
            title: 'Оплачено испонителем (с НДС)',
            width: 200,
            key: 'costVatRate3',
            className: 'col-currency col-text-left',
            render: (text, record, index) => {
              const sum = parseInt(record.sumPayedInCoins, 10) || 0;
              const vatRate = parseInt(costVatRate, 10);
              if (vatRate) {
                return (
                  <VzTable.Cell.Content>
                    {currencyFormat.format((sum + sum * (vatRate / 100)) / 100)}
                  </VzTable.Cell.Content>
                );
              }
              return <VzTable.Cell.Content>{currencyFormat.format(sum / 100)}</VzTable.Cell.Content>;
            },
          }
          : [],
      ],
      {
        title: 'Исполнитель',
        width: 250,
        dataIndex: 'producerName',
        className: 'col-text-narrow',
        key: 'producer',
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>
            {`${record.executorSurname} ${record.executorName} ${record.executorPatronymic ? record.executorPatronymic : ''}`}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Госномер',
        dataIndex: 'plateNumber',
        key: 'plateNumber',
        width: 130,
      },
      {
        title: 'Адрес подачи',
        dataIndex: 'firstAddress',
        className: 'col-text-narrow',
        key: 'firstAddress',
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
          <RegistryStatusAction
            uiState={record?.uiStateForProducer}
            hasRejectedOrders={hasRejectedOrders}
          />
        ),
      },
    ],

    [user, costVatRate, hasRejectedOrders],
  );
}

export default useColumns;
