import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../../infrastructure';

function useFiltersActions({ dictionaries, setUseExport }) {
  return useMemo(
    () => [
      {
        key: 'producerId',
        type: 'input',
        label: 'ID подрядчика',
        config: {
          fieldProps: {
            placeholder: 'ID подрядчика',
            style: {
              width: 180,
            },
          },
        },
      },

      {
        key: 'inn',
        type: 'input',
        label: 'ИНН',
        config: {
          label: 'ИНН',
          minLength: 2,
          fieldProps: {
            placeholder: 'ИНН',
            style: {
              width: 180,
            },
          },
        },
      },

      {
        key: 'name',
        type: 'input',
        label: 'Наименование подрядчика',
        config: {
          label: 'Наименование подрядчика',
          minLength: 3,
          fieldProps: {
            style: {
              width: 180,
            },
          },
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
    [],
  );
}

export default useFiltersActions;
