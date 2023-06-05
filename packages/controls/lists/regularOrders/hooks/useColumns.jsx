import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import * as Order from '@vezubr/order/form';
import { ORDERS_STAGES } from '@vezubr/common/constants/constants';

const frequencyDecryptor = (frequency) => {
  if (!frequency) {
    return null;
  }
  switch (frequency.unit) {
    case 'days':
      return `Каждые ${frequency.amount[0]} дня`
    case 'week':
      return `Каждый${frequency.amount.map(el => ' ' + el)} день недели`
    case 'month':
      return `Каждый${frequency.amount.map(el => ' ' + el)} день месяца`
  }
}

function useColumns({ dictionaries }) {
  const columns = useMemo(
    () => [
      {
        title: t.order('table.number'),
        width: 75,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        sorter: true,
        renderToExport: false,
        render: (number, record) => {
          return (
            <LinkWithBack id={`regular-orders-number-${number}`} to={{ pathname: `/regular-order/${record.id}`}}>
              {number}
            </LinkWithBack>
          );
        },
      },
      {
        title: t.order('table.type'),
        width: 75,
        dataIndex: 'orderType',
        key: 'orderType',
        className: 'col-icon',
        fixed: 'left',
        sorter: true,
        renderToExport: (text, record) => record.orderType == 2 ? 'ПРР' : dictionaries?.vehicleTypeCategories?.find(el => el.id == dictionaries?.vehicleTypes?.find((item) => item.id == record.vehicleTypeId)?.category)?.title,
        render: (orderType, record) => Order.Icons.renderBitmapIconTruck(orderType, dictionaries?.vehicleTypes?.find(el => el.id === record.vehicleTypeId)?.category, record.problem),
      },
      
      {
        title: 'Название шаблона',
        width: 150,
        dataIndex: 'title',
        key: 'title',
        sorter: true,
        renderToExport: (title) => title,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {text || ''}
          </VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: 'Подача',
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text, 'HH:mm').format('HH:mm')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: t.order('table.transportType'),
        dataIndex: 'vehicleTypeId',
        key: 'vehicleTypeId',
        width: 150,
        sorter: true,
        render: (typeId) => {
          return <VzTable.Cell.TextOverflow>{dictionaries?.vehicleTypes?.find(el => el.id === typeId)?.name}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'Заказчик',
        width: 200,
        dataIndex: 'clientName',
        key: 'clientName',
        className: 'col-text-narrow',
        render: (clientName) => <VzTable.Cell.TextOverflow>{clientName || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Точек в маршруте',
        width: 200,
        dataIndex: 'countPoints',
        key: 'countPoints',
        className: 'col-text-narrow',
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Частота',
        width: 200,
        dataIndex: 'frequency',
        key: 'frequency',
        className: 'col-text-narrow',
        render: (frequency) => <VzTable.Cell.TextOverflow>{frequencyDecryptor(frequency) || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.firstAddress'),
        width: 200,
        dataIndex: 'firstAddress',
        key: 'firstAddress',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.order('table.lastAddress'),
        width: 200,
        dataIndex: 'lastAddress',
        key: 'lastAddress',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Начало периода',
        dataIndex: 'startOfPeriod',
        key: 'startOfPeriod',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Конец периода',
        dataIndex: 'endOfPeriod',
        key: 'endOfPeriod',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Статус',
        dataIndex: 'isActive',
        key: 'isActive',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{text ? 'Активный' : 'Не активный'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Работа шаблона',
        dataIndex: 'paused',
        key: 'paused',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{text ? 'Приостановлено' : 'Запущено'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Следующий рейс',
        dataIndex: 'nextPublicationAt',
        key: 'nextPublicationAt',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
    ],
    [dictionaries?.transportOrderStatuses, dictionaries?.vehicleTypes],
  );

  return columns;
}

export default useColumns;
