import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import t from '@vezubr/common/localization';
import * as Order from "@vezubr/order/form";
import LinkWithBack from "@vezubr/components/link/linkWithBack";

function useColumns({ dictionaries }) {
  return useMemo(
    () => [
      {
        title: t.order('table.number'),
        width: 75,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        renderToExport: false,
        render: (number, record) => {
          return (
            <LinkWithBack id={`deffered-number-${number}`} to={{ pathname: `/edit-order/${record.orderId}/${record.orderType === 3 ? 'intercity' : record.orderType === 2 ? 'loader' : 'city'}` }}>
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
        renderToExport: (text, record) => {
          return record.orderType == 2 ? 'ПРР' : dictionaries?.vehicleTypeCategories?.find(el => el.id == dictionaries?.vehicleTypes?.find((item) => item.id == record.vehicleTypeId)?.category)?.title
        },
        render: (orderType, record) => Order.Icons.renderBitmapIconTruck(orderType, dictionaries?.vehicleTypes?.find(el => el.id === record.vehicleTypeId)?.category, record.problem),
      },
      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        renderToExport: (orderNr) => orderNr,
        sorter: true,
        render: (id, record) => (
          <LinkWithBack id={`deffered-ordernr-${id}`} to={{ pathname: `/edit-order/${record.orderId}/${record.orderType === 3 ? 'intercity' : record.orderType === 2 ? 'loader' : 'city'}` }}>
            {id}
          </LinkWithBack>
        ),
      },
      {
        title: 'Номер заявки',
        dataIndex: 'requestNr',
        width: 200,
        key: 'requestNr',
        renderToExport: (requestNr) => requestNr,
        sorter: true,
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Подача',
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        width: 150,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.order('table.transportType'),
        dataIndex: 'vehicleTypeId',
        key: 'vehicleTypeId',
        width: 150,
        sorter: true,
        render: (typeId) => {
          return <VzTable.Cell.TextOverflow>
            {dictionaries?.vehicleTypes?.find(el => el.id === typeId)?.name}
          </VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: t.order('table.firstAddress'),
        width: 450,
        dataIndex: 'firstAddress',
        key: 'firstAddress',
        className: 'col-text-narrow',
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.lastAddress'),
        width: 450,
        dataIndex: 'lastAddress',
        key: 'lastAddress',
        className: 'col-text-narrow',
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
    ],
    [dictionaries],
  );
}

export default useColumns;
