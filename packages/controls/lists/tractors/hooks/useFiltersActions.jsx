import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

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
        key: 'plateNumber',
        type: 'input',
        label: 'Госномер Тягача',
        config: {
          minLength: 2,
          label: 'Госномер Тягача',
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
        key: 'uiState',
        type: 'select',
        label: 'Статус в рейсе',
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
          data: dictionaries?.vehicleUiState?.map(({ id, title }) => ({
            label: title,
            value: id,
          })),
        },
      },

      //Actions
      {
        key: 'addTractor',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'plusWhite',
          className: 'rounded box-shadow primary',
          content: <p className="no-margin">Создать Тягач</p>,
          withMenu: false,
          onClick: () => {
            history.push('/tractors/create');
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
                icon: 'arbeitenOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_IMPORT_TRACTORS);
                },
                title: 'Импорт Тягачей',
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
