import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { TreeSelect } from '@vezubr/elements/antd';
import { observer, OBSERVER_ACTIONS } from '../../../../infrastructure';
import { sortBy } from 'lodash'
import { ORDER_CATEGORIES_GROUPPED } from '@vezubr/common/constants/constants';

const STRATEGY_TYPES = [
  {
    value: 'tariff',
    label: 'Тариф'
  },
  {
    value: 'bargain',
    label: 'Торги'
  },
  {
    value: 'rate',
    label: 'Ставка'
  }
]

const BOOL_OPTIONS = [
  {
    label: 'Да',
    value: '1'
  },
  {
    label: 'Нет',
    value: '0'
  },
]

function useFiltersActions({
  dictionaries,
  // setUseExport,
  pushParams,
  setCanRefreshFilters,
  employees
}) {

  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['toStartAtDateFrom', 'toStartAtDateTill'],
        type: 'dateRange',
        position: 'topLeft',
      },

      {
        key: 'requestNr',
        type: 'input',
        label: 'Номер заявки',
        config: {
          fieldProps: {
            placeholder: 'Номер заявки',
            style: {
              width: 140,
            },
            id: 'requests-requestnr'
          },
        },
      },

      {
        key: 'status',
        type: 'select',
        label: 'Статус заявки',
        config: {
          label: 'Статус заявки',
          fieldProps: {
            mode: 'single',
            maxTagCount: 1,
            placeholder: t.transports('Все'),
            style: {
              width: 300,
            },
          },
          data: dictionaries?.requestListStatuses?.map(({ id, title }) => ({
            label: title,
            value: id,
          })),
        },
      },

      {
        key: 'publishedAt',
        name: 'publishedAt',
        type: 'date',
        label: 'Дата публикации',
        config: {
          label: 'Дата публикации',
          useSetter: false,
        },
      },

      {
        key: 'orderNr',
        type: 'input',
        label: 'Номер рейса',
        config: {
          fieldProps: {
            placeholder: 'Номер рейса',
            style: {
              width: 140,
            },
            id: 'orders-ordernr'
          },
        },
      },

      {
        key: 'orderType',
        type: 'select',
        extra: true,
        label: t.order('filters.orderType.title'),
        config: {
          label: t.order('filters.orderType.label'),
          fieldProps: {
            placeholder: t.order('filters.orderType.placeholder'),
            style: {
              width: 100,
            },
          },
          data: dictionaries?.orderTypes?.map(({ id, title }) => ({
            label: title,
            key: id,
            value: id.toString(),
          })),
        },
      },

      ...[
        APP !== 'producer'
          ?
          {
            key: 'producerTitle',
            type: 'input',
            extra: true,
            label: 'Подрядчик',
            config: {
              label: 'Подрядчик',
              minLength: 3,
              fieldProps: {
                placeholder: 'Все подрядчики',
                style: {
                  width: 180,
                },
              },
            },
          }
          :
          {}
      ],
      ...[
        APP !== 'producer'
          ?
          {
            key: 'producerInn',
            type: 'input',
            extra: true,
            label: 'ИНН подрядчика',
            config: {
              label: 'ИНН подрядчика',
              fieldProps: {
                placeholder: 'ИНН подрядчика',
                style: {
                  width: 180,
                },
              },
            },
          }
          :
          {}
      ],
      ...[
        APP !== 'client'
          ?
          {
            key: 'clientTitle',
            type: 'input',
            extra: true,
            label: 'Заказчик',
            config: {
              label: 'Заказчик',
              minLength: 3,
              fieldProps: {
                placeholder: 'Все Заказчики',
                style: {
                  width: 180,
                },
              },
            },
          }
          :
          {}
      ],
      ...[
        APP !== 'client'
          ?
          {
            key: 'clientInn',
            type: 'input',
            extra: true,
            label: 'ИНН заказчика',
            config: {
              label: 'ИНН заказчика',
              fieldProps: {
                placeholder: 'ИНН заказчика',
                style: {
                  width: 180,
                },
              },
            },
          }
          :
          {}
      ],

      {
        key: 'regularTitle',
        type: 'input',
        extra: true,
        label: 'Рейс по шаблону',
        config: {
          label: 'Рейс по шаблону',
          fieldProps: {
            placeholder: 'Рейс по шаблону',
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'implementerEmployeeId',
        type: 'select',
        label: 'В работе у',
        extra: true,
        config: {
          label: 'В работе у',
          fieldProps: {
            showSearch: true,
            placeholder: 'В работе у',
            optionFilterProp: 'title',
          },
          data: _.sortBy(employees, 'fullName').map(({ id, fullName }) => ({
            label: fullName,
            title: fullName,
            value: id.toString(),
          })),
        },
      },
      {
        key: 'requiredVehicleTypeId',
        type: 'select',
        extra: true,
        label: t.order('filters.transportType.title'),
        config: {
          label: t.order('filters.transportType.label'),
          fieldProps: {
            placeholder: t.order('filters.transportType.placeholder'),
            style: {
              width: 100,
            },
          },
          data: dictionaries?.vehicleTypes?.map(({ id, name }) => ({
            label: name,
            value: id.toString(),
            key: id,
          })),
        },
      },
      {
        key: 'requiredBodyTypes',
        type: 'select',
        extra: true,
        label: 'Тип кузова в заявке',
        getValue: (v) => v && v.split(',').map((item) => ~~item),
        config: {
          label: 'Тип кузова в заявке',
          fieldProps: {
            mode: 'multiple',
            placeholder: t.transports('Все'),
            style: {
              width: 300,
            },
          },
          data: dictionaries?.vehicleBodies?.map(({ id, title }) => ({
            label: title,
            value: id,
          })),
        },
      },
      {
        key: 'firstAddress',
        type: 'input',
        extra: true,
        label: t.order('filters.filterFirstAddress.title'),
        config: {
          minLength: 3,
          label: t.order('filters.filterFirstAddress.label'),
          fieldProps: {
            style: {
              width: 300,
            },
          },
        },
      },
      {
        key: 'lastAddress',
        type: 'input',
        extra: true,
        label: t.order('filters.filterLastAddress.title'),
        config: {
          minLength: 3,
          label: t.order('filters.filterLastAddress.label'),
          fieldProps: {
            style: {
              width: 300,
            },
          },
        },
      },
      {
        key: 'strategyType',
        type: 'select',
        extra: true,
        label: 'Тип публикации',
        config: {
          label: 'Тип публикации',
          fieldProps: {
            placeholder: 'Тип публикации',
            style: {
              width: 150,
            },
          },
          data: STRATEGY_TYPES
        },
      },
      {
        key: 'republishingStrategy',
        type: 'select',
        extra: true,
        label: 'Тип Перепубликации',
        config: {
          label: 'Тип Перепубликации',
          fieldProps: {
            placeholder: 'Тип Перепубликации',
            style: {
              width: 150,
            },
          },
          data: STRATEGY_TYPES
        },
      },
      {
        key: 'hasAdditionalParams',
        type: 'select',
        extra: true,
        label: 'Доп. требования',
        config: {
          label: 'Доп. требования',
          fieldProps: {
            placeholder: 'Доп. требования',
            style: {
              width: 100,
            },
          },
          data: BOOL_OPTIONS,
        },
      },
      {
        key: 'hasComment',
        type: 'select',
        extra: true,
        label: 'Комментарий',
        config: {
          label: 'Комментарий',
          fieldProps: {
            placeholder: 'Комментарий',
            style: {
              width: 100,
            },
          },
          data: BOOL_OPTIONS,
        },
      },
      {
        key: 'isInsuranceRequired',
        type: 'select',
        extra: true,
        label: 'Требуется страхование',
        config: {
          label: 'Требуется страхование',
          fieldProps: {
            placeholder: 'Требуется страхование',
            style: {
              width: 100,
            },
          },
          data: BOOL_OPTIONS,
        },
      },

      ...[
        APP !== 'producer'
          ?
          {
            key: 'clientBargainEndAt',
            name: 'clientBargainEndAt',
            type: 'date',
            extra: true,
            label: `Дата завершения Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
            config: {
              label: `Дата завершения Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
              useSetter: false,
            },
          }
          :
          {}
      ],
      ...[
        APP !== 'producer'
          ?
          {
            key: 'clientBargainStatus',
            type: 'select',
            extra: true,
            label: `Статус Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
            config: {
              label: `Статус Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
              fieldProps: {
                placeholder: `Статус Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
                style: {
                  width: 100,
                },
              },
              data: dictionaries.bargainStatuses.map(({ id, title }) => ({
                value: id,
                label: title,
                key: id,
              })),
            },
          }
          :
          {}
      ],
      ...[
        APP !== 'producer'
          ?
          {
            key: 'clientBargainType',
            type: 'select',
            extra: true,
            label: `Тип Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
            config: {
              label: `Тип Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
              fieldProps: {
                placeholder: `Тип Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
                style: {
                  width: 100,
                },
              },
              data: dictionaries.bargainTypes.map(({ id, title }) => ({
                value: id,
                label: title,
                key: id,
              })),
            },
          }
          :
          {}
      ],
      ...[
        APP !== 'client'
          ?
          {
            key: 'producerBargainEndAt',
            name: 'producerBargainEndAt',
            type: 'date',
            extra: true,
            label: `Дата завершения Торгов ${APP === 'dispatcher' ? '(Подрядчик)' : ''}`,
            config: {
              label: `Дата завершения Торгов ${APP === 'dispatcher' ? '(Подрядчик)' : ''}`,
              useSetter: false,
            },
          }
          :
          {}
      ],
      ...[
        APP !== 'client'
          ?
          {
            key: 'producerBargainType',
            type: 'select',
            extra: true,
            label: `Тип Торгов ${APP === 'dispatcher' ? '(Подрядчик)' : ''}`,
            config: {
              label: `Тип Торгов ${APP === 'dispatcher' ? '(Подрядчик)' : ''}`,
              fieldProps: {
                placeholder: `Тип Торгов ${APP === 'dispatcher' ? '(Подрядчик)' : ''}`,
                style: {
                  width: 100,
                },
              },
              data: dictionaries.bargainTypes.map(({ id, title }) => ({
                value: id,
                label: title,
                key: id,
              })),
            },
          }
          :
          {}
      ],


      //Actions
      {
        key: 'filterButtonExtra',
        type: 'filterButtonExtra',
        position: 'topRight',
      },
      {
        key: 'filtersApply',
        type: 'filtersApply',
        position: 'topRight',
        filterSetName: 'orders',
        pushParams,
        setCanRefreshFilters,
      },
      {
        key: 'filterButtonContext',
        type: 'buttonContext',
        position: 'topRight',
        config: {
          menuOptions: {
            list: [
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
                },
                title: 'Изменить отображение колонок',
              },
              // {
              //   icon: 'settingsOrange',
              //   onAction: () => {
              //     observer.emit(OBSERVER_ACTIONS.ACTION_EXPORTING_CONFIG_TABLE);
              //   },
              //   title: 'Настроить экспорт',
              // },
              // {
              //   icon: 'printOrange',
              //   onAction: () => void 0,
              //   title: 'Распечатать',
              // },
              // {
              //   icon: 'excelOrange',
              //   onAction: () => {
              //     setUseExport(true);
              //   },
              //   title: t.buttons('toExcel'),
              // },
            ],
          },
        },
      },
    ],
    [employees],
  );
}

export default useFiltersActions;
