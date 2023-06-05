import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';
import { ORDER_CATEGORIES_GROUPPED_VEHICLE } from '@vezubr/common/constants/constants';

const statuses = [
  {
    value: 'active',
    label: 'Активный'
  },
  {
    value: 'not_active',
    label: 'Неактивный'
  }
]

function useFiltersActions({ dictionaries, setUseExport, history }) {
  return useMemo(
    () => [
      {
        key: 'categories',
        type: 'selectTree',
        label: t.transports('table.categoryType'),
        getValue: (v) => v && v.split(',').map((item) => ~~item),
        config: {
          label: t.transports('table.categoryType'),
          fieldProps: {
            allowClear: true,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            maxTagCount: 1,
            placeholder: 'Тип автоперевозки',
            style: {
              width: 271,
            },
          },
          data: ORDER_CATEGORIES_GROUPPED_VEHICLE,
        },
      },
      {
        key: 'plateNumber',
        type: 'input',
        label: t.order('filters.plateNumber.title'),
        config: {
          minLength: 2,
          label: t.order('filters.plateNumber.title'),
          fieldProps: {
            style: {
              width: 190,
            },
          },
        },
      },
      {
        key: 'status',
        type: 'select',
        label: 'Статус в системе',
        getValue: (v) => v && [v],
        config: {
          label: 'Статус в системе',
          fieldProps: {
            mode: 'single',
            maxTagCount: 1,
            placeholder: t.transports('Все'),
            style: {
              width: 300,
            },
          },
          data: statuses
        },
      },

      {
        key: 'uiStates',
        type: 'select',
        label: 'Статус в рейсе',
        getValue: (v) => v && v.split(','),
        config: {
          label: 'Статус в рейсе',
          fieldProps: {
            mode: 'multiple',
            maxTagCount: 1,
            placeholder: t.transports('Все'),
            style: {
              width: 300,
            },
            optionFilterProp: 'title',
          },
          data: dictionaries?.vehicleUiState?.map(({ id, title }) => ({
            label: title,
            value: id,
            title: title,
          })),
        },
      },
      {
        key: 'surname',
        extra: true,
        type: 'input',
        label: t.driver('filters.filterSurname') + ' водителя',
        config: {
          label: t.driver('filters.filterSurname') + ' водителя',
          fieldProps: {
            placeholder: t.driver('filters.filterSurname') + ' водителя',
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'name',
        extra: true,
        type: 'input',
        label: t.driver('filters.filterName') + ' водителя',
        config: {
          label: t.driver('filters.filterName') + ' водителя',
          fieldProps: {
            placeholder: t.driver('filters.filterName') + ' водителя',
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'patronymic',
        extra: true,
        type: 'input',
        label: t.driver('filters.filterPatronymic') + ' водителя',
        config: {
          label: t.driver('filters.filterPatronymic') + ' водителя',
          fieldProps: {
            placeholder: t.driver('filters.filterPatronymic') + ' водителя',
            style: {
              width: 140,
            },
          },
        },
      },

      ...[
        APP === 'dispatcher'
          ?
          {
            key: 'producerTitle',
            type: 'input',
            extra: true,
            label: t.loader('filter.producer'),
            config: {
              label: t.loader('filter.producer'),
              fieldProps: {
                style: {
                  width: 200,
                },
              },
            },
          }
          :
          {}
      ],

      //Actions
      {
        key: 'addDriver',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'plusWhite',
          className: 'rounded box-shadow primary',
          content: <p className="no-margin">Добавить ТС</p>,
          withMenu: false,
          onClick: () => {
            history.push('/transports/create');
          },
        },
      },
      {
        key: 'filterButtonExtra',
        type: 'filterButtonExtra',
        position: 'topRight',
      },
      {
        key: 'filterButtonContext',
        type: 'buttonContext',
        position: 'topRight',
        config: {
          menuOptions: {
            list: [
              {
                icon: 'calendarNewOrange',
                title: 'Расписание',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_SCHEDULE);
                },
              },
              {
                icon: 'arbeitenOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_IMPORT_TRANSPORTS);
                },
                title: 'Импорт ТС',
              },
              // {
              //   icon: 'printOrange',
              //   onAction: () => void 0,
              //   title: 'Распечатать',
              // },
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
                },
                title: 'Изменить отображение колонок',
              },
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
    [dictionaries?.vehicleTypes, dictionaries?.orderTypes],
  );
}

export default useFiltersActions;
