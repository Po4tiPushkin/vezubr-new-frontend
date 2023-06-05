import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import * as Order from '@vezubr/order/form';

export const BARGAIN_STRATEGY_TYPES = {
  2: 'Открытый',
  3: 'Закрытый',
};

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });
const percentFormat = new Intl.NumberFormat('ru-RU', { style: 'percent' });

function useColumnsCalc({ dictionaries, user }) {
  const columns = useMemo(
    () => [
      {
        title: t.order('table.number'),
        width: 75,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        renderToExport: false,
        render: (number, record, index) => (
          <LinkWithBack id={`auctions-number-${number}`} to={{ pathname: `/orders/${record.id}/auctions` }}>{number}</LinkWithBack>
        ),
      },
      {
        title: t.order('table.type'),
        width: 75,
        dataIndex: 'orderType',
        key: 'orderType',
        className: 'col-icon',
        fixed: 'left',
        renderToExport: (text, record) => record.orderType == 2 ? 'ПРР' : dictionaries?.vehicleTypeCategories?.find(el => el.id == dictionaries?.vehicleTypesList?.find((item) => item.id == record.vehicleTypeId)?.category)?.title,
        render: (text, record, index) =>
          Order.Icons.renderBitmapIconTruck(
            record.orderType,
            dictionaries?.vehicleTypesList?.find((item) => item.id == record.vehicleTypeId)?.category,
            record.problem,
          ),
      },

      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        renderToExport: (orderNr) => orderNr,
        render: (id, record) => <LinkWithBack id={'auctions-number-ordernr'} to={{ pathname: `/orders/${record.id}/auctions` }}>{id}</LinkWithBack>,
      },
      {
        title: 'Номер заявки',
        dataIndex: 'requestNr',
        width: 200,
        key: 'requestNr',
        renderToExport: (requestNr) => requestNr,
        render: (value) => <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>,
      },

      {
        title: t.order('table.transportType'),
        dataIndex: 'vehicleTypeId',
        key: 'vehicleTypeId',
        width: 150,
        render: (vehicleTypeId, record, index) => {
          return <VzTable.Cell.TextOverflow>{dictionaries?.vehicleTypes?.[vehicleTypeId]}</VzTable.Cell.TextOverflow>;
        },
      },

      {
        title: t.order('table.status'),
        dataIndex: 'bargainStatus',
        width: 200,
        key: 'bargainStatus',
        render: (bargainStatus, record, index) => (
          <VzTable.Cell.TextOverflow>
            {dictionaries?.bargainStatuses?.find((el) => bargainStatus === el.id)?.title || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: 'Тип торгов',
        width: 200,
        dataIndex: 'selectingStrategy',
        key: 'selectingStrategy',
        className: 'col-text-narrow',
        render: (selectingStrategy, record, index) => (
          <VzTable.Cell.TextOverflow>{BARGAIN_STRATEGY_TYPES[selectingStrategy]}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: 'Дата нач. торгов',
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        width: 150,
        render: (toStartAt, record, index) => (
          <VzTable.Cell.TextOverflow>
            {(toStartAt && moment(toStartAt).format('DD.MM.YYYY')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: t.order('Мин. предлож.'),
        dataIndex: 'offersMinSum',
        width: 250,
        className: 'col-currency col-text-right',
        key: 'offersMinSum',
        render: (offersMinSum, record, index) => {
          return (offersMinSum && currencyFormat.format(~~offersMinSum / 100)) || '-';
        },
      },
      ...[
        user.costWithVat
          ? {
              title: 'Мин. предлож. (с НДС)',
              width: 200,
              key: 'costVatRate',
              render: (text, record, index) => {
                const sum = parseInt(record.offersMinSum, 10) || 0;
                const vatRate = parseInt(record.costVatRate, 10) || 0;
                if (vatRate) {
                  return currencyFormat.format((sum + sum * (vatRate / 100)) / 100);
                }
                return currencyFormat.format(sum / 100);
              },
            }
          : {},
      ],
      {
        title: t.order('Дата мин. предлож.'),
        dataIndex: 'offersMinCreatedAt',
        key: 'offersMinCreatedAt',
        width: 180,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },

      [
        APP !== 'producer'
          ? {
              title: t.order('Кол-во предлож.'),
              dataIndex: 'offersCount',
              key: 'offersCount',
              width: 150,
            }
          : {},
      ],

      {
        title: t.order('table.firstAddress'),
        width: 200,
        dataIndex: 'firstAddress',
        key: 'firstAddress',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.lastAddress'),
        width: 200,
        dataIndex: 'lastAddress',
        key: 'lastAddress',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Подача',
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        width: 200,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment.utc(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
    ],
    [dictionaries?.transportOrderStatuses, dictionaries.vehicleTypeCategories, dictionaries?.bargainStatuses, dictionaries?.vehicleTypes, user],
  );

  return columns;
}

export default useColumnsCalc;
