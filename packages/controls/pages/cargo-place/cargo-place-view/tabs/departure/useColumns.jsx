import React, { useContext, useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import { CargoContextView } from '../../context';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import t from '@vezubr/common/localization';

function useColumns() {
  const { store } = useContext(CargoContextView);
  const { data } = store;

  const columns = useMemo(() => [
    {
      title: 'ID ГМ',
      width: 150,
      dataIndex: 'cargoPlaceId',
      key: 'cargoPlaceId',
      render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
    },
    {
      title: 'Адрес отправления',
      dataIndex: 'departurePoint.addressString',
      key: 'departurePoint',
      width: 350,
      render: (departurePoint) => <VzTable.Cell.TextOverflow>{departurePoint}</VzTable.Cell.TextOverflow>,
    },

    {
      title: 'Адрес доставки',
      dataIndex: 'arrivalPoint.addressString',
      key: 'arrivalPoint',
      width: 350,
      render: (arrivalPoint) => <VzTable.Cell.TextOverflow>{arrivalPoint}</VzTable.Cell.TextOverflow>,
    },

    {
      title: 'ID Рейса',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 150,
      render: (orderId) => {
        return <LinkWithBack to={{ pathname: `/orders/${orderId}` }}>{orderId}</LinkWithBack>;
      },
    },

    {
      title: 'Статус отправления',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => <VzTable.Cell.TextOverflow>{(status && t.order(`cargoPlaceStatuses.${status}`)) || ''}</VzTable.Cell.TextOverflow>,
    },

    {
      title: 'Адрес к статусу',
      dataIndex: 'statusAddress.addressString',
      key: 'statusAddress',
      width: 350,
      render: (statusAddress) => <VzTable.Cell.TextOverflow>{statusAddress}</VzTable.Cell.TextOverflow>,
    },
  ]);

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
