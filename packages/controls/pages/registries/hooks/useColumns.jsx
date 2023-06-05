import React, { useMemo } from 'react';
import { IconDeprecated, VzTable } from '@vezubr/elements';
import moment from 'moment';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import RegistryStatusAction from '../actions/registryStatusAction';
const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });
const numberFormat = new Intl.NumberFormat('ru-RU', { style: 'decimal' });

function useColumns(dictionaries, user) {
  return useMemo(
    () => [
      {
        title: '№ реестра',
        width: 130,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        sorter: true,
        renderToExport: (number, record, index) => number || '-',
        render: (number, record, index) => {
          const { status } = record;
          return (
            <VzTable.Cell.TextOverflow>
              {status === 1 ? (
                <LinkWithBack
                  to={{
                    pathname: `/registries/${record.id}`,
                  }}
                >
                  {number || 'unknown'}
                </LinkWithBack>
              ) : (
                number || 'unknown'
              )}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Дата реестра',
        width: 150,
        dataIndex: 'registryDate',
        key: 'registryDate',
        render: (registryDate) => (
          <VzTable.Cell.Content>
            {(registryDate && moment(registryDate).format('DD.MM.YYYY HH:mm')) || ''}
          </VzTable.Cell.Content>
        ),
      },
      {
        title: 'Тип акта',
        width: 100,
        dataIndex: 'parentId',
        key: 'parentId',
        sorter: true,
        className: 'col-icon',
        render: (text, record, index) => {
          let iconName = 'paymentIn';
          if (record._type) {
            iconName = record._type === 1 ? 'paymentIn' : 'paymentOut';
          }
          return (
            <VzTable.Cell.TextOverflow>
              <IconDeprecated name={iconName} />
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Заказчик',
        dataIndex: 'clientTitle',
        key: 'clientTitle',
        className: 'col-text-narrow',
        sorter: true,
        width: 200,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>
            {text}
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
        title: 'Подрядчик',
        dataIndex: 'renterName',
        className: 'col-text-narrow',
        key: 'renterName',
        width: 200,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>
            {text}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Оплата',
        dataIndex: 'paymentState',
        key: 'paymentState',
        width: 150,
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.Content>
            <VzTable.Cell.TextOverflow>
              {dictionaries?.paymentStatus?.find((el) => text === el.id)?.title || ''}
            </VzTable.Cell.TextOverflow>
          </VzTable.Cell.Content>
        ),
      },
      {
        title: 'Сумма без НДС',
        dataIndex: 'sumInCoins',
        key: 'sumInCoins',
        className: 'col-currency col-text-right',
        sorter: true,
        width: 150,
        render: (text, record, index) => {
          const sum = parseInt(text, 10);
          return <VzTable.Cell.TextOverflow>{currencyFormat.format(sum / 100)}</VzTable.Cell.TextOverflow>;
        },
      },
      ...[
        user.costWithVat
          ? {
            title: 'Сумма с НДС',
            width: 200,
            dataIndex: 'costVatRate',
            key: 'costVatRate',
            className: 'col-currency col-text-left',
            render: (text, record, index) => {
              const sum = parseInt(record.sumInCoins, 10) || 0;
              const vatRate = parseInt(record.costVatRate, 10) || 0;
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
        title: 'Рейсов',
        dataIndex: 'ordersCount',
        key: 'ordersCount',
        width: 100,
        sorter: true,
        render: (text, record, index) => {
          const sum = parseInt(text, 10);
          return <VzTable.Cell.TextOverflow>{numberFormat.format(sum)}</VzTable.Cell.TextOverflow>;
        },
      },

      {
        title: 'Оригиналы сданы',
        dataIndex: 'originalSubmitDate',
        key: 'originalSubmitDate',
        width: 150,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Оригиналы отправлены',
        dataIndex: 'originalsSentDate',
        key: 'originalsSentDate',
        sorter: true,
        width: 180,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Оригиналы получены',
        dataIndex: 'originalReceivedDate',
        key: 'originalReceivedDate',
        sorter: true,
        width: 170,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: 'Срок оплаты',
        dataIndex: 'paymentDeadlineDate',
        key: 'paymentDeadlineDate',
        sorter: true,
        width: 150,
        render: (paymentDeadlineDate) => (
          <VzTable.Cell.Content>
            {(paymentDeadlineDate && moment(paymentDeadlineDate).format('DD.MM.YYYY')) || ''}
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
              <VzTable.Cell.TextOverflow className={'date-reject'}>
                {(reformedAt && moment(reformedAt).format('DD.MM.YYYY HH:mm')) || '-'}
              </VzTable.Cell.TextOverflow>
            );
          }

          return (
            <VzTable.Cell.TextOverflow className={'date-accept'}>
              {(record.acceptedAt && moment(record.acceptedAt).format('DD.MM.YYYY HH:mm')) || '-'}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: ' ',
        width: 175,
        dataIndex: 'isAllOrdersAccepted',
        key: 'isAllOrdersAccepted',
        fixed: 'right',
        className: 'col-text-right',
        renderToExport: '',
        render: (isAllOrdersAccepted, record) => (
          <VzTable.Cell.Content>
            <RegistryStatusAction
              isAccepted={isAllOrdersAccepted}
              canReject={record.isHasRejectedOrders}
              paymentState={record.paymentState}
              reformedAt={record.reformedAt}
              paymentDeadlineDate={record.paymentDeadlineDate}
              acceptingAvailable={record.acceptingAvailable}
              uiState={record.uiState}
            />
          </VzTable.Cell.Content>
        ),
      },
    ],
    [dictionaries, user],
  );
}

export default useColumns;
