import t from '@vezubr/common/localization';
import { TableActions } from '@vezubr/components';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import * as Order from '../../../../../../order/form';
import moment from 'moment';
import React, { useMemo } from 'react';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns({ dictionaries, user, onAction, addCommentAction, employeesList, reload }) {
  const columns = useMemo(
    () => [
      {
        title: t.order('table.number'),
        width: 75,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        renderToExport: (number) => number,
        render: (number, record) => {
          if (record.status === 'declined') {
            return <VzTable.Cell.TextOverflow>{number}</VzTable.Cell.TextOverflow>
          }
          return <LinkWithBack to={{ pathname: `/orders/${record.orderId}` }}>{number}</LinkWithBack>;
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
        render: (orderType, record) =>
          Order.Icons.renderBitmapIconTruck(orderType, dictionaries?.vehicleTypes?.find(item => item.id == record.requiredVehicleTypeId)?.category, record.problem),
      },

      {
        title: t.order('table.status'),
        dataIndex: 'status',
        width: 200,
        key: 'status',
        // sorter: true,
        render: (state, record) => {
          return <VzTable.Cell.TextOverflow>
            {dictionaries.requestListStatuses.find(el => el.id === state)?.title}
          </VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'В работе у',
        dataIndex: 'implementerEmployeeId',
        width: 200,
        key: 'implementerEmployeeId',
        render: (implementerEmployeeId, record) => {
          return <VzTable.Cell.TextOverflow>
            {employeesList?.find(({ id }) => id == implementerEmployeeId)?.fullName || '-'}
          </VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'Номер заявки',
        dataIndex: 'requestNr',
        width: 200,
        key: 'requestNr',
        renderToExport: (requestNr) => requestNr,
        sorter: true,
        render: (value) => <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Номер заявки клиента',
        width: 200,
        dataIndex: 'clientNumber',
        key: 'clientNumber',
        sorter: true,
        className: 'col-text-narrow',
        render: (client) => (
          <VzTable.Cell.TextOverflow>
            {client}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        renderToExport: (orderNr) => orderNr,
        sorter: true,
        render: (id, record) => {
          if (record.status === 'declined') {
            return <VzTable.Cell.TextOverflow>{id}</VzTable.Cell.TextOverflow>
          }
          return <LinkWithBack to={{ pathname: `/orders/${record.orderId}` }}>{id}</LinkWithBack>;
        },
      },
      {
        title: 'Подача',
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.order('table.transportType'),
        dataIndex: 'requiredVehicleTypeId',
        key: 'requiredVehicleTypeId',
        width: 150,
        // sorter: true,
        render: (text) => {
          return (
            <VzTable.Cell.TextOverflow>
              {dictionaries?.vehicleTypes?.find((item) => item?.id == text)?.name || '-'}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Требуемые Кузова',
        width: 250,
        dataIndex: 'requiredBodyTypes',
        key: 'requiredBodyTypes',
        render: (body) => {
          if (!Array.isArray(body)) {
            return ''
          }
          let bodies = ' ';
          body.forEach(el => {
            bodies += ` ${dictionaries.vehicleBodies.find(item => item.id === el)?.title},`
          })
          bodies = bodies.slice(0, -1);
          return <VzTable.Cell.TextOverflow>{bodies}</VzTable.Cell.TextOverflow>;
        },
      },
      ...[
        APP !== 'client'
          ? {
            title: 'Заказчик',
            width: 200,
            dataIndex: 'client',
            key: 'clientName',
            // sorter: true,
            className: 'col-text-narrow',
            render: (client) => (
              <VzTable.Cell.TextOverflow>
                {client && (client.title || client.id)}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      ...[
        APP !== 'client'
          ? {
            title: 'ИНН Заказчика',
            width: 200,
            dataIndex: 'client',
            key: 'clientInn',
            // sorter: true,
            className: 'col-text-narrow',
            render: (client) => (
              <VzTable.Cell.TextOverflow>
                {client.inn}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      ...[
        APP !== 'producer'
          ? {
            title: t.order('table.producerCompany'),
            width: 200,
            dataIndex: 'producer',
            key: 'producerName',
            className: 'col-text-narrow',
            // sorter: true,
            render: (producer) => (
              <VzTable.Cell.TextOverflow>
                {producer && (producer.title || producer.inn || producer.id)}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      {
        title: t.order('table.firstAddress'),
        width: 200,
        dataIndex: 'firstPoint',
        key: 'firstAddress',
        sorter: true,
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text?.addressString}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.lastAddress'),
        width: 200,
        dataIndex: 'lastPoint',
        key: 'lastAddress',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text?.addressString}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Источник',
        width: 200,
        dataIndex: 'source',
        // sorter: true,
        key: 'source',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      ...[
        APP !== 'producer'
          ? {
            title: `Дата завершения Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
            width: 200,
            dataIndex: 'clientBargainEndAt',
            key: 'clientBargainEndAt',
            className: 'col-text-narrow',
            render: (text) => (
              <VzTable.Cell.TextOverflow>
                {(text && moment(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      ...[
        APP !== 'producer'
          ? {
            title: `Статус Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
            width: 200,
            dataIndex: 'clientBargainStatus',
            key: 'clientBargainStatus',
            className: 'col-text-narrow',
            render: (text) => (
              <VzTable.Cell.TextOverflow>
                {text && dictionaries.bargainStatuses.find(el => el.id === text)?.title || '-'}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      ...[
        APP !== 'producer'
          ? {
            title: `Тип Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
            width: 200,
            dataIndex: 'clientBargainType',
            key: 'clientBargainType',
            className: 'col-text-narrow',
            render: (text) => (
              <VzTable.Cell.TextOverflow>
                {text && dictionaries.bargainTypes.find(el => el.id === text)?.title || '-'}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      ...[
        APP !== 'client'
          ? {
            title: `Дата завершения Торгов ${APP === 'dispatcher' ? '(Подрядчик)' : ''}`,
            width: 200,
            dataIndex: 'producerBargainEndAt',
            key: 'producerBargainEndAt',
            className: 'col-text-narrow',
            render: (text) => (
              <VzTable.Cell.TextOverflow>
                {(text && moment(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      ...[
        APP !== 'client'
          ? {
            title: `Статус Торгов ${APP === 'dispatcher' ? '(Подрядчик)' : ''}`,
            width: 200,
            dataIndex: 'producerBargainStatus',
            key: 'producerBargainStatus',
            className: 'col-text-narrow',
            render: (text) => (
              <VzTable.Cell.TextOverflow>
                {text && dictionaries.bargainStatuses.find(el => el.id === text)?.title || '-'}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      ...[
        APP !== 'client'
          ? {
            title: `Тип Торгов ${APP === 'dispatcher' ? '(Подрядчик)' : ''}`,
            width: 200,
            dataIndex: 'producerBargainType',
            key: 'producerBargainType',
            className: 'col-text-narrow',
            render: (text) => (
              <VzTable.Cell.TextOverflow>
                {text && dictionaries.bargainTypes.find(el => el.id === text)?.title || '-'}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      {
        title: 'Дата публикации',
        dataIndex: 'publishedAt',
        key: 'publishedAt',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Тип публикации',
        dataIndex: 'strategyType',
        key: 'strategyType',
        width: 125,
        sorter: true,
        render: (type) => {
          switch (type) {
            case 'rate':
              return 'Ставка';
            case 'bargain':
              return 'Торги';
            case 'tariff':
              return 'Тариф';
            default:
              return '-';
          }
        }
      },
      ...[
        APP === 'dispatcher'
          ?
          {
            title: 'Дата перепубликации (первой)',
            dataIndex: 'republishedAt',
            key: 'republishedAt',
            width: 200,
            // sorter: true,
            render: (text) => (
              <VzTable.Cell.TextOverflow>
                {(text && moment(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
              </VzTable.Cell.TextOverflow>
            ),
          }
          :
          {}
      ],
      ...[
        APP === 'dispatcher'
          ?
          {
            title: 'Тип Перепубликации (последний)',
            dataIndex: 'republishingStrategy',
            key: 'republishingStrategy',
            width: 160,
            sorter: true,
            render: (type) => {
              switch (type) {
                case 'rate':
                  return 'Ставка';
                case 'bargain':
                  return 'Торги';
                case 'tariff':
                  return 'Тариф';
                default:
                  return '-';
              }
            }
          }
          :
          {}
      ],
      {
        title: 'Доп. требования',
        dataIndex: 'hasAdditionalParams',
        key: 'hasAdditionalParams',
        width: 200,
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Комментарий',
        dataIndex: 'comment',
        key: 'comment',
        width: 200,
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {(text) ? 'Да' : 'Нет'}
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Внутр. коммент',
        dataIndex: 'innerComment',
        key: 'innerComment',
        width: 200,
        // sorte  r: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {(text) ? 'Да' : 'Нет'}
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Требуется страхование',
        dataIndex: 'isInsuranceRequired',
        key: 'isInsuranceRequired',
        width: 200,
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        fixed: 'right',
        width: 200,
        render: (agreement = {}, record, index) => <TableActions
          type={'Requests'}
          record={record}
          reload={reload}
        />
        ,
      },
    ],
    [
      dictionaries?.transportOrderStatuses,
      dictionaries?.vehicleTypes,
      user.isVatPayer,
      user.vatRate,
      employeesList,
      reload
    ],
  );

  return columns;
}

export default useColumns;
