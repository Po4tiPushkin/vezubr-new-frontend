import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../../../infrastructure';

function useFiltersActions({ dictionaries, setUseExport }) {
  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['registryDateFrom', 'registryDateTill'],
        type: 'dateRange',
        label: 'Дата реестра',
        position: 'topLeft',
      },

      {
        key: 'number',
        type: 'input',
        label: 'Номер реестра',
        config: {
          fieldProps: {
            placeholder: '№ реестра',
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'clientTitle',
        type: 'input',
        label: 'Заказчик',
        config: {
          label: 'Заказчик',
          fieldProps: {
            style: {
              width: 200,
            },
          },
        },
      },

      {
        key: 'paymentState',
        type: 'select',
        label: 'Оплата',
        config: {
          label: 'Оплата',
          data: dictionaries?.invoices?.map(({ id, title }) => ({
            label: title,
            value: id.toString(),
          })),
        },
      },

      // {
      //   key: 'registrySum',
      //   name: ['registrySumFrom', 'registrySumTill'],
      //   type: 'range',
      //   label: 'Сумма',
      //   extra: true,
      //   config: {
      //     label: 'Сумма',
      //   },
      // },

      // {
      //   key: 'payedDate',
      //   name: ['payedDateFrom', 'payedDateTill'],
      //   type: 'dateRange',
      //   label: 'Оплата диапазон',
      //   extra: true,
      //   config: {
      //     label: 'Оплата',
      //     useSetter: false,
      //   },
      // },

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
    [dictionaries],
  );
}

export default useFiltersActions;
