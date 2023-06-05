import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../../../../infrastructure';

function useFiltersActions({ dictionaries, setUseExport}) {


  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['toStartAtDateFrom', 'toStartAtDateTill'],
        type: 'dateRange',
        position: 'topLeft',
      },

      {
        key: 'orderNr',
        type: 'input',
        label: t.order('filters.orderId.placeholder'),
        config: {
          minLength: 2,
          fieldProps: {
            placeholder: t.order('filters.orderId.placeholder'),
            style: {
              width: 180,
            },
          },
        },
      },
      {
        key: 'beneficiary',
        type: 'input',
        label: 'Выгодоприобретатель',
        config: {
          minLength: 2,
          fieldProps: {
            placeholder: 'Выгодоприобретатель',
            style: {
              width: 220,
            },
          },
        },
      },
      {
        key: 'contractNumber',
        type: 'input',
        label: 'Номер договора',
        config: {
          minLength: 2,
          fieldProps: {
            placeholder: 'Номер договора',
            style: {
              width: 180,
            },
          },
        },
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
                  observer.emit(OBSERVER_ACTIONS.ACTION_EXPORTING_CONFIG_TABLE);
                },
                title: 'Настроить экспорт',
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
