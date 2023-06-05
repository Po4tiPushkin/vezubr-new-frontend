import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

function useFiltersActions({ dictionaries, setUseExport }) {
  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['startDateSince', 'startDateTill'],
        type: 'dateRange',
        label: 'Дата подачи',
        position: 'topLeft',
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
          },
        },
      },
      {
        key: 'name',
        extra: true,
        type: 'input',
        label: t.driver('filters.filterName') + ' исполнителя',
        config: {
          label: t.driver('filters.filterName') + ' исполнителя',
          fieldProps: {
            placeholder: t.driver('filters.filterName') + ' исполнителя',
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
        label: t.driver('filters.filterPatronymic') + ' исполнителя',
        config: {
          label: t.driver('filters.filterPatronymic') + ' исполнителя',
          fieldProps: {
            placeholder: t.driver('filters.filterPatronymic') + ' исполнителя',
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'surname',
        extra: true,
        type: 'input',
        label: t.driver('filters.filterSurname') + ' исполнителя',
        config: {
          label: t.driver('filters.filterSurname') + ' исполнителя',
          fieldProps: {
            placeholder: t.driver('filters.filterSurname') + ' исполнителя',
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'vehiclePlateNumber',
        type: 'input',
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
    [dictionaries?.vehicleTypes, dictionaries?.orderTypes],
  );
}

export default useFiltersActions;
