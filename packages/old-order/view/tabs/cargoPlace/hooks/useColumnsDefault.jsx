import LinkWithBack from '@vezubr/components/link/linkWithBack';
import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { VzTable } from '@vezubr/elements';

function formattedNumber(number) {
  return new Intl.NumberFormat('ru-RU').format(number);
}

export default function useColumns(dataCargoPlace) {
  const columns = useMemo(() => [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      renderToExport: (id, record, index) => id,
      render: (id, record, index) => {
        if (APP !== 'producer') {
          return <LinkWithBack to={{ pathname: `/cargoPlaces/${id}` }}>{id}</LinkWithBack>
        } else {
          return <VzTable.Cell.TextOverflow>{id}</VzTable.Cell.TextOverflow>
        }
      }
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      width: 220,
      render: (text, record, index) =>
        <VzTable.Cell.TextOverflow>{(text && t.order(`cargoPlaceStatuses.${text}`)) || ''}</VzTable.Cell.TextOverflow>,
    },
    {
      title: 'Адрес к статусу',
      width: 370,
      dataIndex: 'statusAddress',
      key: 'statusAddress',
      className: 'col-text-narrow',
      render: (text, record, index) => <VzTable.Cell.TextOverflow>{text?.addressString}</VzTable.Cell.TextOverflow>,
    },
    {
      title: 'Bar code',
      dataIndex: 'barCode',
      key: 'barCode',
      width: 200,
    },
    {
      title: 'Номер пломбы',
      dataIndex: 'sealNumber',
      key: 'sealNumber',
      width: 150,
    },
    {
      title: 'Адрес отправления',
      dataIndex: 'departureAddress',
      key: 'departureAddress',
      width: 350,
    },
    {
      title: 'Адрес доставки',
      dataIndex: 'deliveryAddress',
      key: 'deliveryAddress',
      width: 350,
    },
    {
      title: 'Вес, кг',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      render: (weight, record, index) => {
        if (typeof weight === 'number') {
          return formattedNumber((weight / 1000).toFixed(2));
        }
        return weight;
      },
    },
    {
      title: 'Объем, м3',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      render: (volume, record, index) => {
        if (typeof volume === 'number') {
          return formattedNumber((volume / 1000000).toFixed(2));
        }
        return volume;
      },
    },
  ], [dataCargoPlace]);

  return VzTable.useColumnsCalcWidth(columns);
}