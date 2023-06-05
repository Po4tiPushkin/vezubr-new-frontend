import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';

const rating = [1, 2, 3, 4, 5].map((key) => ({ label: key, value: key }));

function useFiltersActions({ dictionaries, setUseExport }) {
  return useMemo(
    () => [
      {
        key: 'filterId',
        type: 'input',
        label: t.registries('ID'),
        config: {
          fieldProps: {
            placeholder: t.clients('filter.id'),
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'filterSurname',
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
        key: 'filterMinRatingByClient',
        type: 'select',
        getValue: (v) => v && parseInt(v, 10),
        label: t.driver('filters.filterMinRatingByClient'),
        config: {
          label: t.driver('filters.filterMinRatingByClient'),
          fieldProps: {
            placeholder: 'Любой',
            style: {
              width: 100,
              minWidth: 100,
            },
          },
          data: rating,
        },
      },

      {
        key: 'filterSystemStates',
        type: 'select',
        label: t.driver('filters.filterSystemStates'),
        getValue: (v) => v && v.split(',').map((item) => ~~item),
        config: {
          label: t.driver('filters.filterSystemStates'),
          fieldProps: {
            placeholder: t.clients('filter.all'),
            style: {
              width: 300,
            },
          },
          data: dictionaries?.unitUiStates.map(({ title, id }) => ({
            label: title,
            value: id,
          })),
        },
      },

      {
        key: 'filterMobilePhone',
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

      {
        key: 'scoringStatus',
        type: 'select',
        label: 'Скоринг статус',
        extra: true,
        config: {
          label: 'Скоринг статус',
          fieldProps: {
            placeholder: t.clients('filter.all'),
            style: {
              width: 200,
            },
          },
          data: Object.keys(dictionaries?.scoringStatuses).map((key) => ({
            label: dictionaries?.scoringStatuses[key],
            value: key,
          })),
        },
      },

      //Actions
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
              //   icon: 'printOrange',
              //   onAction: () => void 0,
              //   title: 'Распечатать',
              // },
              {
                icon: 'settingsOrange',
                onAction: () => void 0,
                title: 'Столбцы',
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
    [dictionaries?.unitUiStates, dictionaries?.scoringStatuses],
  );
}

export default useFiltersActions;
