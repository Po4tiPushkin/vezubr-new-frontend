import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import * as Order from '@vezubr/order/form';

import ModalItemDocument from '../actions/modalItemDocument';

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
        render: (text, item) => {
          return <ModalItemDocument id={`documents-number-${text}`} text={text} item={item} dictionaries={dictionaries} />;
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
        renderToExport: (orderType, record) => orderType == 2 ? 'ПРР' : dictionaries?.vehicleTypeCategories?.find(el => el.id == record.category)?.title,
        render: (orderType, record) => Order.Icons.renderBitmapIconTruck(orderType, record.category, record.problem),
      },

      {
        title: t.order('table.status'),
        dataIndex: 'orderUiState',
        width: 200,
        key: 'orderUiState',
        sorter: true,
        render: (uiState) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.transportOrderStatuses?.[uiState]}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        renderToExport: (orderNr) => orderNr,
        sorter: true,
        render: (id, item) => (
          <ModalItemDocument text={id} item={item} dictionaries={dictionaries} />
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
        title: t.order('table.customer'),
        width: 200,
        dataIndex: 'clientName',
        key: 'clientName',
        className: 'col-text-narrow',
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: t.documents('table.toStartAtDate'),
        dataIndex: 'toStartAtDate',
        key: 'toStartAtDate',
        width: 150,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Тип автоперевозки',
        dataIndex: 'category',
        key: 'category',
        width: 150,
        sorter: true,
        renderToExport: (text, record) => record.orderType == 2 ? 'ПРР' : dictionaries?.vehicleTypeCategories?.find(el => el.id === text)?.title || '-',
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {dictionaries?.vehicleTypeCategories?.find(el => el.id === text)?.title || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.order('table.transportType'),
        dataIndex: 'requiredVehicleTypeId',
        key: 'requiredVehicleTypeId',
        width: 150,
        sorter: true,
        render: (requiredVehicleTypeId) => (
          <VzTable.Cell.TextOverflow>
            {dictionaries?.vehicleTypes?.find(el => el.id === requiredVehicleTypeId)?.name || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.documents('table.requiredLoadersCount'),
        dataIndex: 'requiredLoadersCount',
        key: 'requiredLoadersCount',
        width: 150,
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text.toString()}</VzTable.Cell.TextOverflow>,
      },

      {
        title: t.order('table.finishedAtDate'),
        dataIndex: 'finishedAtDate',
        key: 'finishedAtDate',
        width: 150,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: t.order('table.calculationAcceptedAtDate'),
        dataIndex: 'calculationAcceptedAtDate',
        key: 'calculationAcceptedAtDate',
        width: 150,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: t.documents('table.producerName'),
        dataIndex: 'producerName',
        key: 'producerName',
        width: 150,
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text || '-'}</VzTable.Cell.TextOverflow>,
      },

      {
        title: t.order('table.plateNumber'),
        dataIndex: 'vehiclePlateNumber',
        key: 'vehiclePlateNumber',
        width: 150,
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: t.documents('table.firstAddress'),
        dataIndex: 'firstAddress',
        key: 'firstAddress',
        width: 150,
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: t.documents('table.lastAddress'),
        dataIndex: 'lastAddress',
        key: 'lastAddress',
        width: 150,
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: t.order('table.orderProducerCustomIdentifier'),
        dataIndex: 'orderProducerCustomIdentifier',
        key: 'orderProducerCustomIdentifier',
        width: 150,
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: 'Фамилия исполнителя',
        dataIndex: 'surname',
        key: 'surname',
        width: 150,
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: 'Имя исполнителя',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: 'Отчество исполнителя',
        dataIndex: 'patronymic',
        key: 'patronymic',
        width: 150,
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: t.documents('table.renterName'),
        dataIndex: 'renterName',
        key: 'renterName',
        width: 150,
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
    ],
    [dictionaries],
  );

  return columns;
}

export default useColumns;
