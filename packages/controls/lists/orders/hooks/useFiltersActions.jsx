import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { TreeSelect } from '@vezubr/elements/antd';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';
import { sortBy } from 'lodash'
import { ORDER_CATEGORIES_GROUPPED } from '@vezubr/common/constants/constants';
function useFiltersActions({
  dictionaries,
  setUseExport,
  pushParams,
  setCanRefreshFilters,
  employees = [],
  cities = [],
  tableKey
}) {
  const treeStageData = useMemo(() => {
    const treeData = [];
    dictionaries.orderUiStage.filter(val => ![80, 99, 0].includes(val.id)).forEach(el => {
      const currentStage = dictionaries.orderStageToStateMap[el.id];
      const children = currentStage.filter(val => ![102].includes(val)).map(item => ({
        title: dictionaries.orderUiState.find(val => val.id === item)?.title ||
          (APP === 'client'
            ?
            dictionaries.performerUiStateForClient.find(val => val.id === item)?.title
            :
            APP === 'producer'
              ?
              dictionaries.performerUiStateForProducer.find(val => val.id === item)?.title
              :
              dictionaries.performerUiStateForProducer.find(val => val.id === item)?.title ||
              dictionaries.performerUiStateForClient.find(val => val.id === item)?.title)
        ,
        value: item,
        key: item,
        id: `orders-orderuistate-child-${item}`
      }))
      treeData.push({
        title: el.title,
        value: el.id,
        key: el.id,
        id: `orders-orderuistate-parent-${el.id}`,
        children: children.filter(child => child.title),
      })
    });
    if (APP === 'dispatcher') {
      const newData = [
        {
          title: 'Статус в паре (Заказчик)',
          value: 31,
          key: 31,
          children: dictionaries.performerUiStateForClient.map(el => ({
            title: el.title,
            value: `31-${el.id}`,
            key: `31-${el.id}`,
            id: `orders-orderuistate-client-${el.id}`
          }))
        },
        {
          title: 'Статус в паре (Подрядчик)',
          value: 32,
          key: 32,
          children: dictionaries.performerUiStateForProducer.map(el => ({
            title: el.title,
            value: `32-${el.id}`,
            key: `32-${el.id}`,
            id: `orders-orderuistate-producer-${el.id}`,
          }))
        },
      ]
      return treeData.map(el => {
        if (el.value === 30) {
          el.children = newData;
        };
        return el;
      })
    }
    return treeData;
  }, [dictionaries])

  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['toStartAtDateFrom', 'toStartAtDateTill'],
        type: 'dateRange',
        position: 'topLeft',
        label: 'Дата подачи',
        config: {
          id: 'orders-maindate',
          pickerProps: {
            style: {
              width: 275
            }
          },
        },
      },

      {
        key: 'orderNr',
        type: 'input',
        label: t.order('filters.orderId.placeholder'),
        config: {
          fieldProps: {
            placeholder: t.order('filters.orderId.placeholder'),
            style: {
              width: 140,
            },
            id: 'orders-ordernr'
          },
        },
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
            id: 'orders-requestnr'
          },
        },
      },

      {
        key: 'orderUiStates',
        type: 'selectTree',
        label: 'Стадии рейса',
        getValue: (val) => val && val.split(','),
        config: {
          label: 'Стадии рейса',
          decoratorProps: {
            id: 'orders-orderuistates'
          },
          fieldProps: {
            placeholder: 'Стадии рейса',
            allowClear: true,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            maxTagCount: 0,
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            searchPlaceholder: 'Выберите статус',
            dropdownStyle: {
              maxHeight: 300,
            },
            style: {
              width: 100,
            },
          },
          data: treeStageData,
        },
      },

      {
        key: 'responsibleEmployee',
        type: 'select',
        label: 'Ответственный пользователь',
        config: {
          label: 'Ответственный пользователь',
          fieldProps: {
            showSearch: true,
            placeholder: 'Ответственный пользователь',
            optionFilterProp: 'title',
          },
          decoratorProps: {
            id: 'orders-responsibleemployee'
          },
          data: _.sortBy(employees, 'fullName').map(({ id, fullName }) => ({
            label: fullName,
            title: fullName,
            value: id.toString(),
          })),
        },
      },

      //Extra filters
      {
        key: 'filterFinishDate',
        name: ['finishDateFrom', 'finishDateTill'],
        type: 'dateRange',
        label: 'Дата завершения',
        extra: true,
        config: {
          label: t.order('filters.finishedAtDate.label'),
          useSetter: false,
          pickerProps: {
            style: {
              width: 275
            }
          },
        }
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
        key: 'plateNumber',
        type: 'input',
        extra: true,
        label: t.order('filters.plateNumber.title'),
        config: {
          label: t.order('filters.plateNumber.label'),
          fieldProps: {
            placeholder: t.order('filters.plateNumber.placeholder'),
            style: {
              width: 140,
            },
          },
        },
      },
      // {
      //   key: 'firstAddress',
      //   type: 'select',
      //   extra: true,
      //   label: t.order('filters.filterFirstAddress.title'),
      //   getValue: (val) => val && val.split(',').map((v) => +v),
      //   config: {
      //     label: t.order('filters.filterFirstAddress.label'),
      //     fieldProps: {
      //       placeholder: 'Стадии рейса',
      //       allowClear: true,
      //       treeCheckable: true,
      //       optionFilterProp: 'title',
      //       mode: 'multiple',
      //       maxTagCount: 0,
      //       searchPlaceholder: 'Выберите статус',
      //       dropdownStyle: {
      //         maxHeight: 600,
      //       },
      //       style: {
      //         width: 600,
      //       },
      //     },
      //     data: cities.map(({id, title, type, regionTitle}) => ({
      //       label: `${title} ${type ? `/ ${type} ` : ''}${regionTitle ? `/ ${regionTitle}` : ''}`,
      //       title: `${title} ${type ? `/ ${type} ` : ''}${regionTitle ? `/ ${regionTitle}` : ''}`,
      //       value: +id,
      //     }))
      //   },
      // },
      // {
      //   key: 'lastAddress',
      //   type: 'input',
      //   extra: true,
      //   label: t.order('filters.filterLastAddress.title'),
      //   config: {
      //     label: t.order('filters.filterLastAddress.label'),
      //     fieldProps: {
      //       style: {
      //         width: 300,
      //       },
      //     },
      //   },
      // },
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
              fieldProps: {
                placeholder: 'Все подрядчики',
                style: {
                  width: 300,
                },
              },
            },
          }
          :
          {}
      ],

      {
        key: 'executorSurname',
        type: 'input',
        extra: true,
        label: 'Исполнитель',
        config: {
          label: 'Исполнитель',
          fieldProps: {
            placeholder: 'Все исполнители',
            style: {
              width: 300,
            },
          },
        },
      },
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
              fieldProps: {
                placeholder: 'Все Заказчики',
                style: {
                  width: 300,
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
        key: 'firstCities',
        type: 'select',
        extra: true,
        label: 'Город подачи',
        getValue: (val) => val && val.split(',').map((v) => +v),
        config: {
          label: 'Город подачи',
          fieldProps: {
            placeholder: 'Город подачи',
            allowClear: true,
            treeCheckable: true,
            optionFilterProp: 'title',
            mode: 'multiple',
            searchPlaceholder: 'Выберите город',
            dropdownMatchSelectWidth: false,
            dropdownStyle: {
              maxHeight: 600,
            },
            style: {
              width: 450,
            },
          },
          data: cities.map(({ id, title, type, regionTitle }) => ({
            label: `${title} ${type ? `/ ${type} ` : ''}${regionTitle ? `/ ${regionTitle}` : ''}`,
            title: `${title} ${type ? `/ ${type} ` : ''}${regionTitle ? `/ ${regionTitle}` : ''}`,
            value: +id,
          }))
        },
      },
      {
        key: 'lastCities',
        type: 'select',
        extra: true,
        label: 'Город доставки',
        getValue: (val) => val && val.split(',').map((v) => +v),
        config: {
          label: 'Город доставки',
          fieldProps: {
            placeholder: 'Город доставки',
            allowClear: true,
            treeCheckable: true,
            optionFilterProp: 'title',
            mode: 'multiple',
            searchPlaceholder: 'Выберите город',
            dropdownMatchSelectWidth: false,
            dropdownStyle: {
              maxHeight: 600,
            },
            style: {
              width: 450,
            },
          },
          data: cities.map(({ id, title, type, regionTitle }) => ({
            label: `${title} ${type ? `/ ${type} ` : ''}${regionTitle ? `/ ${regionTitle}` : ''}`,
            title: `${title} ${type ? `/ ${type} ` : ''}${regionTitle ? `/ ${regionTitle}` : ''}`,
            value: +id,
          }))
        },
      },
      {
        key: 'publishedAt',
        name: 'publishedAt',
        type: 'date',
        label: 'Дата публикации',
        extra: true,
        config: {
          label: 'Дата публикации',
          useSetter: false,
        },
      },

      {
        key: 'createdAt',
        name: ['createdAtDateFrom', 'createdAtDateTill'],
        type: 'dateRange',
        label: 'Дата создания',
        extra: true,
        config: {
          label: 'Дата создания',
          useSetter: false,
          pickerProps: {
            style: {
              width: 275
            }
          },
        },
      },

      {
        key: 'clientNumber',
        type: 'input',
        extra: true,
        label: 'Идентификатор рейса',
        config: {
          label: 'Идентификатор рейса',
          fieldProps: {
            placeholder: 'Идентификатор рейса',
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'vehicleTypeCategory',
        type: 'selectTree',
        extra: true,
        label: 'Тип автоперевозки',
        config: {
          label: 'Тип автоперевозки',
          placeholder: 'Тип автоперевозки',
          fieldProps: {
            placeholder: 'Тип автоперевозки',
            style: {
              width: 271,
            },
          },
          data: ORDER_CATEGORIES_GROUPPED
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
        key: 'appointedBodyTypes',
        type: 'select',
        extra: true,
        label: 'Тип кузова назначенного ТС',
        getValue: (v) => v && v.split(',').map((item) => ~~item),
        config: {
          label: 'Тип кузова назначенного ТС',
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

      ...[
        APP !== 'producer'
          ?
          {
            key: 'clientRegistryNumber',
            type: 'input',
            extra: true,
            label: APP === 'dispatcher' ? 'Номер реестра от подрядчика' : 'Номер реестра',
            config: {
              label: APP === 'dispatcher' ? 'Номер реестра от подрядчика' : 'Номер реестра',
              fieldProps: {
                placeholder: 'Номер реестра',
                style: {
                  width: 140,
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
            key: 'producerRegistryNumber',
            type: 'input',
            extra: true,
            label: APP === 'dispatcher' ? 'Номер реестра от заказчика' : 'Номер реестра',
            config: {
              label: APP === 'dispatcher' ? 'Номер реестра от заказчика' : 'Номер реестра',
              fieldProps: {
                placeholder: 'Номер реестра',
                style: {
                  width: 140,
                },
              },
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
        tableKey: tableKey,
      },
      {
        key: 'filterButtonContext',
        type: 'buttonContext',
        position: 'topRight',
        config: {
          id: 'orders-menu',
          menuOptions: {
            list: [
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
                },
                title: 'Изменить отображение колонок',
                id: 'orders-settings',
              },
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_EXPORTING_CONFIG_TABLE);
                },
                title: 'Настроить экспорт',
                id: 'orders-settings',
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
                id: 'orders-exel',
              },
            ],
          },
        },
      },
    ],
    [treeStageData, dictionaries?.vehicleBodies, dictionaries?.orderTypes, employees, cities, tableKey],
  );
}

export default useFiltersActions;
