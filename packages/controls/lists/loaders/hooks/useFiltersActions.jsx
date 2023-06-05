import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

function useFiltersActions({ dictionaries, setUseExport, history }) {
  return useMemo(
    () => [
      {
        key: 'specialities',
        type: 'selectTree',
        label: 'Тип специалиста',
        getValue: (v) => v && v.split(','),
        config: {
          label: 'Тип специалиста',
          fieldProps: {
            allowClear: true,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            maxTagCount: 1,
            placeholder: 'Тип специалиста',
            style: {
              width: 271,
            },
          },
          data: dictionaries.loaderSpecialities.map(el => ({ value: el.id, title: el.title })),
        },
      },
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
        key: 'addLoaderr',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'plusWhite',
          className: 'rounded box-shadow primary',
          content: <p className="no-margin">Добавить специалиста</p>,
          withMenu: false,
          onClick: () => {
            history.push('/loaders/create');
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
              // {
              //   icon: 'arbeitenOrange',
              //   onAction: () => {
              //     observer.emit(OBSERVER_ACTIONS.ACTION_IMPORT_DRIVERS);
              //   },
              //   title: 'Импорт водителей',
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
