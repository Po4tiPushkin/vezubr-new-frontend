import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import * as Order from '../../../../../../form';
import { ORDERS_STAGES } from '@vezubr/common/constants/constants';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns({ dictionaries, user }) {
  const columns = useMemo(
    () => [
      {
        title: t.order('table.number'),
        width: 75,
        dataIndex: 'orderId',
        key: 'orderId',
        fixed: 'left',
        sorter: true,
        renderToExport: (id) => id,
        render: (id, record) => {
          return (
            <VzTable.Cell.TextOverflow>
              {id}
            </VzTable.Cell.TextOverflow>
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
        render: (orderType, record) => Order.Icons.renderBitmapIconTruck(orderType, record.vehicleTypeCategory, record.problem),
      },

      {
        title: t.order('table.status'),
        dataIndex: 'orderUiState',
        width: 200,
        key: 'orderUiState',
        sorter: true,
        render: (uiState, record) => {
          let state = null;

          switch (APP) {
            case 'dispatcher':
              state = dictionaries?.orderUiState?.find(el => el.id === uiState)?.title
              break;
            case 'client':
              state = uiState === 400
                ?
                dictionaries?.performerUiStateForClient.find(el => el.id === record?.uiStateForClient?.state)?.title
                :
                dictionaries?.orderUiState?.find(el => el.id === uiState)?.title
              break;
            case 'producer':
              state = uiState === 400
                ?
                dictionaries?.performerUiStateForProducer.find(el => el.id === record?.uiStateForProducer?.state)?.title
                :

                dictionaries?.orderUiState?.find(el => el.id === uiState)?.title
              break;
          }
          return <VzTable.Cell.TextOverflow>{state}</VzTable.Cell.TextOverflow>
        },
      },
      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        renderToExport: (orderNr) => orderNr,
        sorter: true,
        render: (id, record) => {
          const { orderUiState } = record;
          let pathName = 'general';
          if (ORDERS_STAGES.paperCheck.values.includes(orderUiState)) {
            pathName = 'documents';
          } else if (ORDERS_STAGES.execution.values.includes(orderUiState) || orderUiState == 201) {
            pathName = 'perpetrators';
          }
          return (
            <VzTable.Cell.TextOverflow>
              {id}
            </VzTable.Cell.TextOverflow>
          );
        },
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
        title: 'Идентификатор рейса',
        dataIndex: 'clientNumber',
        key: 'clientNumber',
        width: 200,
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: '№ точки',
        dataIndex: 'currentPosition',
        width: 100,
        key: 'currentPosition',
      },

      {
        title: 'Подача',
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment.utc(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: 'Завершен',
        dataIndex: 'finishedAt',
        key: 'finished_at',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment.utc(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: t.order('table.transportType'),
        dataIndex: 'requiredVehicleTypeId',
        key: 'requiredVehicleTypeId',
        width: 150,
        sorter: true,
        render: (text) => {
          return <VzTable.Cell.TextOverflow>{dictionaries?.vehicleTypes?.find((item) => item?.id == text)?.name || '-'}</VzTable.Cell.TextOverflow>;
        },
      },
      ...[
        APP == 'producer' ?
          {
            title: t.order('table.calculationAcceptedAtDate'),
            dataIndex: 'calculationAcceptedAtDate',
            key: 'calculationAcceptedAtDate',
            width: 150,
            render: (text) => (
              <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
            ),
          }
          :
          {}
      ],
      {
        title: t.order('table.plateNumber'),
        dataIndex: 'plateNumber',
        key: 'plateNumber',
        width: 150,
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      ...[
        APP !== 'client' ?
          {
            title: 'Заказчик',
            width: 200,
            dataIndex: 'client',
            key: 'clientName',
            sorter: true,
            className: 'col-text-narrow',
            render: (client) => <VzTable.Cell.TextOverflow>{client && (client.title || client.inn || client.id)}</VzTable.Cell.TextOverflow>,
          }
          :

          {}
      ],
      [
        APP !== 'producer'
          ?
          {
            title: t.order('table.producerCompany'),
            width: 200,
            dataIndex: 'producer',
            key: 'producerName',
            className: 'col-text-narrow',
            sorter: true,
            render: (producer) => <VzTable.Cell.TextOverflow>{producer && (producer.title || producer.inn || producer.id)}</VzTable.Cell.TextOverflow>,
          }
          :
          {}
      ],

      {
        title: 'Исполнитель',
        width: 200,
        dataIndex: 'executorName',
        key: 'executorSurname',
        sorter: true,
        className: 'col-text-narrow',
        render: (text, record, index) => (
          <VzTable.Cell.TextOverflow>
            {record?.executorSurname} {text} {record?.executorPatronymic}
          </VzTable.Cell.TextOverflow>
        ),
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
        title: 'Город подачи',
        width: 200,
        dataIndex: 'firstCityName',
        key: 'first_city_name',
        sorter: true,
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? text : ""}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Город доставки',
        width: 200,
        dataIndex: 'lastCityName',
        key: 'last_city_name',
        sorter: true,
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? text : ""}</VzTable.Cell.TextOverflow>,
      },
      ...[
        APP === 'dispatcher' ?
          {
            title: 'Номер Реестра Подрядчика',
            width: 200,
            dataIndex: 'clientRegistryNumber',
            key: 'clientRegistryNumber',
            sorter: true,
            className: 'col-text-narrow',
            render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
          }
          :
          {}
      ],
      ...[
        APP === 'dispatcher' ?

          {
            title: 'Номер Реестра Клиента',
            width: 200,
            dataIndex: 'producerRegistryNumber',
            key: 'producerRegistryNumber',
            sorter: true,
            className: 'col-text-narrow',
            render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
          }
          :
          {
            title: 'Номер Реестра',
            width: 200,
            dataIndex: `${APP}RegistryNumber`,
            key: `${APP}RegistryNumber`,
            sorter: true,
            render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
          },
      ],

      {
        title: 'Источник',
        width: 200,
        dataIndex: 'source',
        sorter: true,
        key: 'source',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
      },
      {
        title: 'Создан по шаблону',
        width: 200,
        dataIndex: 'regularTitle',
        key: 'regularTitle',
        sorter: true,
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? text : ""}</VzTable.Cell.TextOverflow>,
      },
      ...[
        APP === 'dispatcher' ?
          {
            title: 'Стоимость для ПВ',
            width: 200,
            dataIndex: 'clientTotalSum',
            key: 'clientTotalSum',
            render: (text, record, index) => {
              const sum = parseInt(text, 10) || 0;
              return currencyFormat.format(sum / 100);
            },
          }
          :
          {
            title: 'Стоимость рейса (без НДС)',
            width: 200,
            dataIndex: `${APP}TotalSum`,
            key: `${APP}TotalSum`,
            render: (text, record, index) => {
              const sum = parseInt(text, 10) || 0;
              return currencyFormat.format(sum / 100);
            }
          }
      ],
      ...[
        user?.costWithVat ?
          APP === 'dispatcher'
            ?
            {
              title: 'Стоимость для ПВ с НДС',
              width: 200,
              key: 'costVatRate',
              render: (text, record, index) => {
                const sum = parseInt(record.clientTotalSum, 10) || 0;
                const vatRate = parseInt(record.costVatRate, 10) || 0;
                if (vatRate) {
                  return currencyFormat.format((sum + sum * (vatRate / 100)) / 100)
                }
                return currencyFormat.format(sum / 100);
              },
            }
            :
            {
              title: 'Стоимость рейса (с НДС)',
              width: 200,
              key: 'costVatRate',
              render: (text, record, index) => {
                const sum = parseInt(record[`${APP}TotalSum`], 10) || 0;
                const vatRate = parseInt(record.costVatRate, 10) || 0;
                if (vatRate) {
                  return currencyFormat.format((sum + sum * (vatRate / 100)) / 100)
                }
                return currencyFormat.format(sum / 100);
              },
            }
          :
          {}
      ],
      ...[
        APP === 'dispatcher' ?
          {
            title: 'Стоимость для ГВ',
            width: 200,
            dataIndex: 'producerTotalSum',
            key: 'producerTotalSum',
            render: (text, record, index) => {
              const sum = parseInt(text, 10) || 0;
              return currencyFormat.format(sum / 100);
            },
          }
          :
          {}
      ],
      ...[
        user?.costWithVat && APP === 'dispatcher' ?
          {
            title: 'Стоимость для ГВ c НДС',
            width: 200,
            key: 'costVatRate1',
            render: (text, record, index) => {
              const sum = parseInt(record.producerTotalSum, 10) || 0;
              const vatRate = parseInt(record.costVatRate, 10) || 0;
              if (vatRate) {
                return currencyFormat.format((sum + sum * (vatRate / 100)) / 100)
              }
              return currencyFormat.format(sum / 100);
            },
          }
          :
          []
      ],
      ...[
        APP == 'producer' ?
          {
            title: t.order('table.actNo'),
            dataIndex: 'actNo',
            key: 'actNo',
            width: 150,
          }
          :
          {}
      ],
      {
        title: t.order('table.routePointsCount'),
        width: 100,
        dataIndex: 'routePointsCount',
        key: 'route_points_count',
      },
      ...[
        APP == 'producer' ?
          {
            title: t.order('table.orderProducerCustomIdentifier'),
            width: 200,
            dataIndex: 'orderProducerCustomIdentifier',
            key: 'orderProducerCustomIdentifier',
            render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
          }
          :
          {}
      ],
      {
        title: 'Дата создания',
        dataIndex: 'createdAt',
        key: 'created_at',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment.utc(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Дата публикации',
        dataIndex: 'publishedAt',
        key: 'published_at',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment.utc(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Тип автоперевозки',
        dataIndex: 'vehicleTypeCategory',
        key: 'vehicleTypeCategory',
        width: 200,
        sorter: false,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.vehicleTypeCategories?.find((item) => item?.id == text)?.title || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      ...[
        APP === 'dispatcher' ?
          {
            title: 'Статус в паре (заказчик)',
            dataIndex: 'uiStateForClient',
            width: 200,
            key: 'uiStateForClient',
            sorter: true,
            render: (uiState) => (
              <VzTable.Cell.TextOverflow>{dictionaries?.performerUiStateForClient?.find(el => el.id === uiState?.state)?.title}</VzTable.Cell.TextOverflow>
            ),
          }
          :
          {},
      ],
      ...[
        APP === 'dispatcher' ?
          {
            title: 'Статус в паре (подрядчик)',
            dataIndex: 'uiStateForProducer',
            width: 200,
            key: 'uiStateForProducer',
            sorter: true,
            render: (uiState) => (
              <VzTable.Cell.TextOverflow>{dictionaries?.performerUiStateForProducer?.find(el => el.id === uiState?.state)?.title}</VzTable.Cell.TextOverflow>
            ),
          }
          :
          {},
      ],
    ],
    [dictionaries?.transportOrderStatuses, dictionaries?.vehicleTypes, user.isVatPayer, user.vatRate],
  );

  return columns;
}

export default useColumns;
