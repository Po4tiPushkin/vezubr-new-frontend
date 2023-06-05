import t from '@vezubr/common/localization';
import { useMemo } from 'react';
import { observer, OBSERVER_ACTIONS } from '../../../../infrastructure';

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
  setUseExport,
  pushParams,
  setCanRefreshFilters,
  employees,
  groups
}) {
  const bargainStatusesOptions = dictionaries.bargainStatuses?.map(item => {
    return {
      id: item.id,
      key: item.id,
      label: item.title,
      value: item.id
    }
  })
  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['toStartAtDateFrom', 'toStartAtDateTill'],
        type: 'dateRange',
        position: 'topLeft',
        label: 'Дата подачи',
      },

      {
        key: 'requestNr',
        type: 'input',
        label: 'Номер заявки',
        config: {
          fieldProps: {
            placeholder: 'Номер заявки',
            style: {
              width: 300,
            },
            id: 'requests-requestnr',
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
          data: dictionaries?.requestListStatuses
            ?.filter((item) => ['active', 'accepted'].includes(item.id))
            ?.map(({ id, title }) => ({
              label: title,
              value: id,
            })),
        },
      },

      {
        key: 'publishedAt',
        name: ['publishedAtDateFrom', 'publishedAtDateTill'],
        type: 'dateRange',
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
              width: 300,
            },
            id: 'orders-ordernr',
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
          ? {
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
          : {},
      ],
      ...[
        APP !== 'client'
          ? {
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
          : {},
      ],
      ...[
        APP !== 'client'
          ? {
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
          : {},
      ],

      ...[
        APP !== 'producer'
          ? {
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
            }
          : {},
      ],
      ...[
        APP !== 'client'
          ? {
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
            }
          : {},
      ],
      ...[
        APP == 'dispatcher'
          ? {
              key: 'requestGroupId',
              type: 'select',
              label: 'Группа',
              config: {
                label: 'Группа',
                fieldProps: {
                  showSearch: true,
                  placeholder: 'Группа',
                  optionFilterProp: 'title',
                },
                data: _.sortBy(groups, 'title').map(({ id, title }) => ({
                  label: title,
                  title,
                  value: id.toString(),
                })),
              },
            }
          : {},
      ],
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
            maxTagCount: 1,
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
            placeholder: t.order('filters.filterFirstAddress.title'),
            style: {
              width: 500,
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
            placeholder: t.order('filters.filterLastAddress.label'),
            style: {
              width: 500,
            },
          },
        },
      },
      {
        key: 'driverName',
        type: 'input',
        extra: true,
        label: 'ФИО водителя',
        config: {
          minLength: 3,
          label: 'ФИО водителя',
          fieldProps: {
            style: {
              width: 300,
            },
          },
        },
      },
      {
        key: 'vehicleNumber',
        type: 'input',
        extra: true,
        label: 'Госномер ТС',
        config: {
          minLength: 3,
          label: 'Госномер ТС',
          fieldProps: {
            style: {
              width: 300,
            },
          },
        },
      },
      ...[
        APP !== 'producer'
          ? {
              key: 'clientBargainStatus',
              type: 'select',
              extra: true,
              label: `Статус Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
              config: {
                label: `Статус Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
                fieldProps: {
                  placeholder: `Статус Торгов ${APP === 'dispatcher' ? '(Заказчик)' : ''}`,
                  style: {
                    width: 150,
                  },
                },
                data: bargainStatusesOptions,
              },
            }
          : {},
      ],

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
          data: STRATEGY_TYPES,
        },
      },
      ...[
        APP == 'dispatcher'
          ? {
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
                data: STRATEGY_TYPES,
              },
            }
          : {},
      ],

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
              minWidth: 100,
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
              minWidth: 100,
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
              minWidth: 100,
            },
          },
          data: BOOL_OPTIONS,
        },
      },

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
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_EXPORTING_CONFIG_TABLE);
                },
                title: 'Настроить экспорт',
              },
              // {
              //   icon: 'printOrange',
              //   onAction: () => void 0,
              //   title: 'Распечатать',
              // },
              {
                icon: 'excelOrange',
                onAction: () => {
                  setUseExport(true);
                },
                title: t.buttons('toExcel'),
              },
            ],
          },
        },
      },
    ],
    [employees, groups],
  );
}

export default useFiltersActions;
