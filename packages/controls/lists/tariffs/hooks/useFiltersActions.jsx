import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

const TARIFF_STATUS = [
  {
    value: '1',
    label: 'Активный'
  },
  {
    value: '0',
    label: 'Не активный'
  }
]

function useFiltersActions({ dictionaries, setUseExport, history }) {
  return useMemo(
    () => [
      //Actions
      {
        key: 'addTariff',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'balanceBlue',
          className: 'rounded box-shadow',
          content: <p className="no-margin">Добавить тариф</p>,
          withMenu: false,
          onClick: () => {
            history.push('/tariffs/add');
          },
        },
      },

      {
        key: 'filterTitle',
        type: 'input',
        label: 'Название тарифа',
        config: {
          label: 'Название тарифа',
          fieldProps: {
            style: {
              width: 180,
            },
          },
        },
      },
      {
        key: 'status',
        type: 'select',
        label: 'Статус', 
        config: {
          label: 'Статус',
          fieldProps: {
            mode: 'single',
            maxTagCount: 1,
            allowClear: false,
            placeholder: 'Выберите статус',
            style: {
              width: 100,
            },
          },
          data: TARIFF_STATUS,
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
