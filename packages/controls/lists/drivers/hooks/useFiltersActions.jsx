import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

const rating = [1, 2, 3, 4, 5].map((key) => ({ label: key, value: key }));

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
        key: 'surname',
        type: 'input',
        label: t.driver('filters.filterSurname'),
        config: {
          label: t.driver('filters.filterSurname'),
          fieldProps: {
            placeholder: t.driver('filters.filterSurname'),
            style: {
              width: 140,
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
        key: 'uiState',
        type: 'select',
        label: 'Статус в рейсе',
        getValue: (v) => v && [v],
        config: {
          label: 'Статус в рейсе',
          fieldProps: {
            mode: 'single',
            maxTagCount: 1,
            placeholder: t.transports('Все'),
            style: {
              width: 300,
            },
          },
          data: dictionaries?.driverUiState?.map(({ id, title }) => ({
            label: title,
            value: id,
          })),
        },
      },
      {
        key: 'name',
        type: 'input',
        label: t.driver('filters.filterName'),
        config: {
          label: t.driver('filters.filterName'),
          fieldProps: {
            placeholder: t.driver('filters.filterName'),
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'patronymic',
        type: 'input',
        label: t.driver('filters.filterPatronymic'),
        config: {
          label: t.driver('filters.filterPatronymic'),
          fieldProps: {
            placeholder: t.driver('filters.filterPatronymic'),
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'mobilePhone',
        type: 'input',
        label: t.driver('filters.filterMobilePhone'),
        config: {
          label: t.driver('filters.filterMobilePhone'),
          fieldProps: {
            style: {
              width: 200,
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
          content: <p className="no-margin">Добавить водителя</p>,
          withMenu: false,
          onClick: () => {
            history.push('/drivers/create');
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
                  observer.emit(OBSERVER_ACTIONS.ACTION_IMPORT_DRIVERS);
                },
                title: 'Импорт водителей',
              },
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
