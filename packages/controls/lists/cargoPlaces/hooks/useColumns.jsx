import React, { useMemo } from 'react';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import t from '@vezubr/common/localization';

function useColumns({dictionaries}) {
  const columns = useMemo(
    () => [
      {
        title: '№',
        width: 75,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        renderToExport: (number, record, index) => number,
        render: (number, record, index) => <LinkWithBack id={`cargoplaces-number-${number}`} to={{ pathname: `/cargoPlaces/${record.id}` }}>{number}</LinkWithBack>,
      },
      {
        title: 'Баркод',
        width: 200,
        dataIndex: 'barCode',
        key: 'barCode',
        sorter: true,
        renderToExport: (barCode, record, index) => barCode,
        render: (barCode, record, index) => <LinkWithBack id={`cargoplaces-barcode-${barCode}`} to={{ pathname: `/cargoPlaces/${record.id}` }}>{barCode}</LinkWithBack>,
      },
      {
        title: 'Тип',
        width: 100,
        dataIndex: 'type',
        key: 'type',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{dictionaries?.cargoPlaceTypes.find(el => el.id === text)?.title}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'ID ГМ партнера',
        width: 120,
        dataIndex: 'externalId',
        key: 'externalId',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Баркод родительского ГМ',
        width: 150,
        dataIndex: 'parentBarCode',
        key: 'parentBarCode',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Статус',
        width: 150,
        dataIndex: 'status',
        key: 'status',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{(text && t.order(`cargoPlaceStatuses.${text}`)) || ''}</VzTable.Cell.TextOverflow>,

      },
      {
        title: 'Адрес к статусу',
        width: 200,
        dataIndex: 'statusAddress',
        key: 'statusAddress',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text?.addressString}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Вес кг',
        width: 120,
        dataIndex: 'weight',
        key: 'weight',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text && (parseInt(text) / 1000).toFixed(3)}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Объем м3',
        width: 120,
        dataIndex: 'volume',
        key: 'volume',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text && (parseInt(text) / 10 ** 6).toFixed(6)}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Стоимость без НДС',
        width: 170,
        dataIndex: 'cost',
        key: 'cost',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Тип обратного ГМ',
        width: 200,
        dataIndex: 'reverseCargoType',
        key: 'reverseCargoType',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{(text && t.order(`reverseCargoTypes.${text}`)) || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Адрес отправления',
        width: 300,
        dataIndex: 'departurePoint.addressString',
        key: 'departurePoint',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Отправитель',
        width: 200,
        dataIndex: 'innShipper',
        key: 'innShipper',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Адрес доставки',
        width: 300,
        dataIndex: 'deliveryPoint.addressString',
        key: 'deliveryPoint',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Получатель',
        width: 200,
        dataIndex: 'innConsignee',
        key: 'innConsignee',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Номер пломбы',
        width: 130,
        dataIndex: 'sealNumber',
        key: 'sealNumber',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Номер накладной',
        width: 150,
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата товарной накладной',
        width: 150,
        dataIndex: 'invoiceDate',
        key: 'invoiceDate',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{text && moment(text).format('DD.MM.YYYY HH:mm') || ''}</VzTable.Cell.TextOverflow>
      },
      {
        title: 'Дата Создания ГМ',
        width: 200,
        dataIndex: 'createdAt',
        key: 'createdAt',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>{text && moment(text).format('DD.MM.YYYY HH:mm') || ''}</VzTable.Cell.TextOverflow>
        ),
      },
    ],
    [],
  );

  return columns;
}

export default useColumns;
