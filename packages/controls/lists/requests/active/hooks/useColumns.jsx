import t from '@vezubr/common/localization';
import { TableActions } from '@vezubr/components';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { IconDeprecated, VzTable } from '@vezubr/elements';
import * as Order from '../../../../../../order/form';
import moment from 'moment-timezone';
import React, { useMemo } from 'react';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns({ dictionaries, user, employees, reload }) {
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
          if (['declined', 'canceled'].includes(record.status) && !record.orderNr) {
            return <VzTable.Cell.TextOverflow>{number}</VzTable.Cell.TextOverflow>
          }
          return <LinkWithBack to={{ pathname: `/orders/${record.orderId}` }}>{number}</LinkWithBack>;
        },
      },
      {
        title: 'Тип Автоперевозки',
        width: 130,
        dataIndex: 'orderType',
        key: 'orderType',
        className: 'col-icon',
        fixed: 'left',
        sorter: true,
        export: true,
        render: (orderType, record) =>
          Order.Icons.renderBitmapIconTruck(orderType, dictionaries?.vehicleTypes?.find(item => item.id == record.requiredVehicleTypeId)?.category, record.problem),
      },
      {
        title: 'Тип рейса',
        width: 200,
        dataIndex: 'orderType',
        key: 'orderType2',
        render: (val, record) => <VzTable.Cell.TextOverflow>
          {dictionaries.orderTypes.find(el => el.id === val)?.title}
        </VzTable.Cell.TextOverflow>
      },
      {
        title: 'Номер заявки',
        dataIndex: 'requestNr',
        width: 200,
        key: 'requestNr',
        renderToExport: (requestNr) => requestNr,
        sorter: true,
        export: true,
        render: (value, record) => {
          if (['declined', 'canceled'].includes(record.status) && !record.orderNr) {
            return <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>;
          }
          return <LinkWithBack to={{ pathname: `/orders/${record.orderId}` }}>{value}</LinkWithBack>;
        }
      },
      {
        title: 'Идентификатор заявки клиента',
        width: 200,
        dataIndex: 'clientNumber',
        key: 'clientNumber',
        sorter: true,
        export: true,
        className: 'col-text-narrow',
        render: (client) => (
          <VzTable.Cell.TextOverflow>
            {client}
          </VzTable.Cell.TextOverflow>
        ),
      },
      ...[
        APP !== 'client'
          ?
          {
            title: 'Номер заявки заказчика',
            width: 200,
            dataIndex: 'clientRequestNr',
            key: 'clientRequestNr',
            export: true,
            // sorter: true,
            className: 'col-text-narrow',
            render: (client) => <VzTable.Cell.TextOverflow>{client}</VzTable.Cell.TextOverflow>,
          }
          :
          {}
      ],
      ...[
        APP !== 'client'
          ?
          {
            title: 'Номер рейса заказчика',
            width: 200,
            dataIndex: 'clientOrderNr',
            key: 'clientOrderNr',
            // sorter: true,
            className: 'col-text-narrow',
            render: (client) => <VzTable.Cell.TextOverflow>{client}</VzTable.Cell.TextOverflow>,
          }
          :
          {}
      ],
      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        renderToExport: (orderNr) => orderNr,
        sorter: true,
        export: true,
        render: (id, record) => {
          if (['declined', 'canceled'].includes(record.status) && !record.orderNr) {
            return <VzTable.Cell.TextOverflow>{id}</VzTable.Cell.TextOverflow>
          }
          return <LinkWithBack to={{ pathname: `/orders/${record.orderId}` }}>{id}</LinkWithBack>;
        },
      },
      {
        title: t.order('table.status'),
        dataIndex: 'status',
        width: 200,
        key: 'status',
        // sorter: true,
        export: true,
        render: (state, record) => {
          return <VzTable.Cell.TextOverflow>
            {dictionaries.requestListStatuses.find(el => el.id === state)?.title}
          </VzTable.Cell.TextOverflow>;
        },
      },
      ...[
        APP !== 'client' ? {
          title: 'В работе у',
          dataIndex: 'implementerEmployeeId',
          width: 200,
          key: 'implementerEmployeeName',
          export: true,
          render: (implementerEmployeeId, record) => {
            return (
              <div style={{ color: implementerEmployeeId === user.decoded.userId ? '#f17737' : '#000' }}>
                {employees?.find(({ id }) => id == implementerEmployeeId)?.fullName || '-'}
                {!implementerEmployeeId && moment().diff(moment(record.publishedAt), 'hours') > 2 ? (
                  <IconDeprecated name="danger" title="Заявка не взята в Работу" style={{ width: 34, height: 34 }} />
                ) : (
                  ''
                )}
              </div>
            );
          },
        } : {}
      ],
      {
        title: 'Подача',
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        width: 200,
        sorter: true,
        export: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment.parseZone(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.order('table.transportType'),
        dataIndex: 'requiredVehicleTypeId',
        key: 'requiredVehicleTypeName',
        width: 150,
        sorter: true,
        export: true,
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
        export: true,
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
            title: 'ИНН Заказчика',
            width: 200,
            dataIndex: 'client',
            key: 'clientInn',
            // sorter: true,
            className: 'col-text-narrow',
            export: true,
            render: (client) => (
              <VzTable.Cell.TextOverflow>
                {client.inn}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      ...[
        APP !== 'client'
          ? {
            title: 'Заказчик',
            width: 200,
            dataIndex: 'client',
            key: 'clientTitle',
            // sorter: true,
            className: 'col-text-narrow',
            export: true,
            render: (client) => (
              <VzTable.Cell.TextOverflow>
                {client && (client.title || client.id)}
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
            key: 'producerTitle',
            className: 'col-text-narrow',
            export: true,
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
        title: 'Исполнитель',
        width: 200,
        dataIndex: 'driverName',
        key: 'driverName',
        className: 'col-text-narrow',
        export: true,
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Телефон водителя',
        width: 200,
        dataIndex: 'driverPhone',
        key: 'driverPhone',
        className: 'col-text-narrow',
        export: true,
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Госномер назначенного ТС',
        width: 200,
        dataIndex: 'vehicleNumber',
        key: 'vehicleNumber',
        className: 'col-text-narrow',
        sorter: true,
        export: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.firstAddress'),
        width: 200,
        dataIndex: 'firstPoint',
        key: 'firstAddress',
        sorter: true,
        className: 'col-text-narrow',
        export: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text?.addressString}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.lastAddress'),
        width: 200,
        dataIndex: 'lastPoint',
        key: 'lastAddress',
        className: 'col-text-narrow',
        export: true,
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text?.addressString}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата публикации',
        dataIndex: 'publishedAt',
        key: 'publishedAt',
        width: 200,
        sorter: true,
        export: true,
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
        export: true,
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
            title: 'Тип Перепубликации (последний)',
            dataIndex: 'republishingStrategy',
            key: 'republishingStrategy',
            width: 125,
            sorter: true,
            export: true,
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
      ...[
        APP === 'dispatcher'
          ? {
            title: 'Стоимость для ПВ',
            width: 200,
            dataIndex: 'clientTotalSum',
            key: 'clientTotalSum',
            export: true,
            render: (text, record, index) => {
              const sum = parseInt(text, 10) || 0;
              return currencyFormat.format(sum / 100);
            },
          }
          : {
            title: 'Стоимость рейса (без НДС)',
            width: 200,
            dataIndex: `${APP}TotalSum`,
            key: `${APP}TotalSum`,
            export: true,
            render: (text, record, index) => {
              const sum = parseInt(text, 10) || 0;
              return currencyFormat.format(sum / 100);
            },
          },
      ],
      ...[
        user?.costWithVat
          ? APP === 'dispatcher'
            ? {
              title: 'Стоимость для ПВ с НДС',
              width: 200,
              key: 'costVatRate',
              render: (text, record, index) => {
                const sum = parseInt(record.clientTotalSum, 10) || 0;
                const vatRate = parseInt(record.costVatRate, 10) || 0;
                if (vatRate) {
                  return currencyFormat.format((sum + sum * (vatRate / 100)) / 100);
                }
                return currencyFormat.format(sum / 100);
              },
            }
            : {
              title: 'Стоимость рейса (с НДС)',
              width: 200,
              key: 'costVatRate',
              render: (text, record, index) => {
                const sum = parseInt(record[`${APP}TotalSum`], 10) || 0;
                const vatRate = parseInt(record.costVatRate, 10) || 0;
                if (vatRate) {
                  return currencyFormat.format((sum + sum * (vatRate / 100)) / 100);
                }
                return currencyFormat.format(sum / 100);
              },
            }
          : {},
      ],
      ...[
        APP === 'dispatcher'
          ? {
            title: 'Стоимость для ГВ',
            width: 200,
            dataIndex: 'producerTotalSum',
            key: 'producerTotalSum',
            export: true,
            render: (text, record, index) => {
              const sum = parseInt(text, 10) || 0;
              return currencyFormat.format(sum / 100);
            },
          }
          : {},
      ],
      ...[
        user?.costWithVat && APP === 'dispatcher'
          ? {
            title: 'Стоимость для ГВ c НДС',
            width: 200,
            key: 'costVatRate1',
            render: (text, record, index) => {
              const sum = parseInt(record.producerTotalSum, 10) || 0;
              const vatRate = parseInt(record.costVatRate, 10) || 0;
              if (vatRate) {
                return currencyFormat.format((sum + sum * (vatRate / 100)) / 100);
              }
              return currencyFormat.format(sum / 100);
            },
          }
          : [],
      ],
      ...[
        APP === 'dispatcher'
          ? {
            title: 'Маржинальность',
            width: 200,
            dataIndex: 'profit',
            key: 'profit',
            render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? `${text}%` : ''}</VzTable.Cell.TextOverflow>
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
            export: true,
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
            title: `Дата завершения Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
            width: 200,
            dataIndex: 'clientBargainEndAt',
            key: 'clientBargainEndAt',
            className: 'col-text-narrow',
            export: true,
            render: (text) => (
              <VzTable.Cell.TextOverflow>
                {(text && moment(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
              </VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      {
        title: 'Источник',
        width: 200,
        dataIndex: 'source',
        // sorter: true,
        key: 'source',
        export: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      ...[
        APP !== 'producer' ? {
          title: 'Создан по шаблону',
          width: 200,
          dataIndex: 'regularTitle',
          key: 'regularTitle',
          export: true,
          // sorter: true,
          className: 'col-text-narrow',
          render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? text : '-'}</VzTable.Cell.TextOverflow>,
        } : {}
      ],
      {
        title: 'Доп. требования',
        dataIndex: 'hasAdditionalParams',
        key: 'hasAdditionalParams',
        width: 200,
        export: true,
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Требуется страхование',
        dataIndex: 'isInsuranceRequired',
        key: 'isInsuranceRequired',
        width: 200,
        export: true,
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Комментарий',
        dataIndex: 'hasComment',
        key: 'hasComment',
        width: 200,
        // sorter: true,
        export: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {text ? 'Да' : 'Нет'}
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Внутр. коммент',
        dataIndex: 'hasInnerComment',
        key: 'hasInnerComment',
        width: 200,
        export: true,
        // sorte  r: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {(text) ? 'Да' : 'Нет'}
        </VzTable.Cell.TextOverflow>,
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
      employees,
      reload
    ],
  );

  return columns;
}

export default useColumns;
