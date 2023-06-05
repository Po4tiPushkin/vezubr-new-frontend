import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';

function useColumns({ dictionaries, renderBitmapIconTruck }) {
  const columns = useMemo(
    () => [
      {
        title: t.order('table.number'),
        width: 75,
        dataIndex: 'orderId',
        key: 'orderId',
        render: (text) => {
          return <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: t.order('table.type'),
        width: 75,
        dataIndex: 'orderType',
        key: 'orderType',
        className: 'col-icon',
        render: (orderType, record) => renderBitmapIconTruck(orderType, record.problem),
      },
      {
        title: t.order('table.data_time'),
        dataIndex: 'toStartAtDate',
        key: 'toStartAtDate',
        width: 150,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.order('table.transportType'),
        dataIndex: 'vehicleType',
        key: 'vehicleType',
        width: 150,
        render: (typeId) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.vehicleTypes?.[typeId]}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.order('predCost'),
        width: 150,
        dataIndex: 'preliminaryTotalSumInCents',
        key: 'preliminaryTotalSumInCents',
        render: (text) => {
          return <VzTable.Cell.TextOverflow>{text || '0'}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: t.order('table.lastAddress'),
        width: 150,
        dataIndex: 'lastAddress',
        key: 'lastAddress',
        render: (text) => {
          return <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>;
        },
      },

      // {
      // 	title: 'Нотификация',
      // 	width: 75,
      // 	render: (text) => {
      // 		return <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
      // 	}
      // },
    ],
    [dictionaries?.vehicleTypes, renderBitmapIconTruck],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
