import t from '@vezubr/common/localization';
import { TableActions } from '@vezubr/components';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { IconDeprecated, VzTable } from '@vezubr/elements';
import * as Order from '../../../../../../order/form';
import moment from 'moment-timezone';
import React, { useMemo } from 'react';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns({ dictionaries, user, employees, reload, reasonsList }) {
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
            return <VzTable.Cell.TextOverflow>{number}</VzTable.Cell.TextOverflow>;
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
        export: true,
        // sorter: true,
        render: (orderType, record) =>
          Order.Icons.renderBitmapIconTruck(
            orderType,
            dictionaries?.vehicleTypes?.find((item) => item.id == record.requiredVehicleTypeId)?.category,
            record.problem,
          ),
      },
      {
        title: 'Номер заявки',
        dataIndex: 'requestNr',
        width: 200,
        key: 'requestNr',
        export: true,
        renderToExport: (requestNr) => requestNr,
        // sorter: true,
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
        export: true,
        // sorter: true,
        className: 'col-text-narrow',
        render: (client) => <VzTable.Cell.TextOverflow>{client}</VzTable.Cell.TextOverflow>,
      },
      ...[
        APP !== 'client' ? {
          title: 'Номер заявки заказчика',
          width: 200,
          dataIndex: 'clientRequestNr',
          key: 'clientRequestNr',
          export: true,
          // sorter: true,
          className: 'col-text-narrow',
          render: (client) => <VzTable.Cell.TextOverflow>{client}</VzTable.Cell.TextOverflow>,
        } : {}
      ],
      ...[
        APP !== 'client' ? {
          title: 'Номер рейса заказчика',
          width: 200,
          dataIndex: 'clientOrderNr',
          key: 'clientOrderNr',
          // sorter: true,
          className: 'col-text-narrow',
          render: (client) => <VzTable.Cell.TextOverflow>{client}</VzTable.Cell.TextOverflow>,
        } : {}
      ],
      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        export: true,
        renderToExport: (orderNr) => orderNr,
        // sorter: true,
        render: (id, record) => {
          if (['declined', 'canceled'].includes(record.status) && !record.orderNr) {
            return <VzTable.Cell.TextOverflow>{id}</VzTable.Cell.TextOverflow>;
          }
          return <LinkWithBack to={{ pathname: `/orders/${record.orderId}` }}>{id}</LinkWithBack>;
        },
      },
      {
        title: t.order('table.status'),
        dataIndex: 'status',
        width: 200,
        key: 'status',
        export: true,
        // sorter: true,
        render: (state, record) => {
          return (
            <VzTable.Cell.TextOverflow>
              {dictionaries.requestListStatuses.find((el) => el.id === state)?.title}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      ...[
        APP !== 'client'
          ? {
              title: 'В работе у',
              dataIndex: 'implementerEmployeeId',
              width: 200,
              key: 'implementerEmployeeName',
              export: true,
              render: (implementerEmployeeId, record) => {
                return (
                  <div
                    style={{ color: implementerEmployeeId === user.decoded.userId ? '#f17737' : '#000' }}
                  >
                    {employees?.find(({ id }) => id == implementerEmployeeId)?.fullName || '-'}
                    {!implementerEmployeeId && moment().diff(moment(record.publishedAt), 'hours') > 2 ? (
                      <IconDeprecated name="danger" title="Заявка не взята в Работу" style={{width: 34, height: 34}} />
                    ) : (
                      ''
                    )}
                  </div>
                );
              },
            }
          : {},
      ],
      {
        title: 'Подача',
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        width: 200,
        export: true,
        // sorter: true,
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
        // sorter: true,
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
            return '';
          }
          let bodies = ' ';
          body.forEach((el) => {
            bodies += ` ${dictionaries.vehicleBodies.find((item) => item.id === el)?.title},`;
          });
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
            export: true,
            // sorter: true,
            className: 'col-text-narrow',
            render: (client) => <VzTable.Cell.TextOverflow>{client.inn}</VzTable.Cell.TextOverflow>,
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
            export: true,
            // sorter: true,
            className: 'col-text-narrow',
            render: (client) => (
              <VzTable.Cell.TextOverflow>{client && (client.title || client.id)}</VzTable.Cell.TextOverflow>
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
        export: true,
        className: 'col-text-narrow',
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Телефон водителя',
        width: 200,
        dataIndex: 'driverPhone',
        key: 'driverPhone',
        export: true,
        className: 'col-text-narrow',
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Госномер назначенного ТС',
        width: 200,
        dataIndex: 'vehicleNumber',
        export: true,
        key: 'vehicleNumber',
        className: 'col-text-narrow',
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.firstAddress'),
        width: 200,
        dataIndex: 'firstPoint',
        export: true,
        key: 'firstAddress',
        // sorter: true,
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text?.addressString}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.lastAddress'),
        width: 200,
        dataIndex: 'lastPoint',
        key: 'lastAddress',
        export: true,
        className: 'col-text-narrow',
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text?.addressString}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата публикации',
        dataIndex: 'publishedAt',
        key: 'publishedAt',
        export: true,
        width: 200,
        // sorter: true,
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
        export: true,
        width: 125,
        // sorter: true,
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
        },
      },
      ...[
        APP === 'dispatcher'
          ? {
            title: 'Тип Перепубликации (последний)',
            dataIndex: 'republishingStrategy',
            key: 'republishingStrategy',
            width: 125,
            export: true,
            // sorter: true,
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
            },
          }
          : {},
      ],
      ...[
        APP === 'dispatcher'
          ? {
            title: 'Стоимость для ПВ',
            width: 200,
            dataIndex: 'clientTotalSum',
            export: true,
            key: 'clientTotalSum',
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
            export: true,
            key: 'producerTotalSum',
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
            key: 'profit',
            dataIndex: 'profit',
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
                {(text && dictionaries.bargainStatuses.find((el) => el.id === text)?.title) || '-'}
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
        export: true,
        // sorter: true,
        key: 'source',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      ...[
        APP !== 'producer'
          ? {
            title: 'Создан по шаблону',
            width: 200,
            dataIndex: 'regularTitle',
            key: 'regularTitle',
            export: true,
            // sorter: true,
            className: 'col-text-narrow',
            render: (text, record, index) => (
              <VzTable.Cell.TextOverflow>{text ? text : '-'}</VzTable.Cell.TextOverflow>
            ),
          }
          : {},
      ],
      {
        title: 'Доп. требования',
        dataIndex: 'hasAdditionalParams',
        key: 'hasAdditionalParams',
        export: true,
        width: 200,
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Требуется страхование',
        dataIndex: 'isInsuranceRequired',
        key: 'isInsuranceRequired',
        export: true,
        width: 200,
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Комментарий',
        dataIndex: 'hasComment',
        key: 'hasComment',
        export: true,
        width: 200,
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Внутр. коммент',
        dataIndex: 'hasInnerComment',
        key: 'hasInnerComment',
        export: true,
        width: 200,
        // sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата завершения рейся',
        dataIndex: 'finishedAt',
        key: 'finishedAt',
        export: true,
        width: 200,
        // sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Внутр. причина отмены',
        dataIndex: 'innerCancellationReason',
        key: 'innerCancellationReason',
        width: 200,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text || '-'}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        fixed: 'right',
        width: 200,
        render: (agreement = {}, record, index) => (
          <TableActions
            type={'Requests'}
            record={record}
            reload={reload}
            extra={{
              listType: 'all',
              reasonsList,
            }}
          />
        ),
      },
    ],
    [
      dictionaries?.transportOrderStatuses,
      dictionaries?.vehicleTypes,
      user.isVatPayer,
      user.vatRate,
      employees,
      reload,
      reasonsList,
    ],
  );

  return columns;
}

export default useColumns;
