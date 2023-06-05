import { useMemo } from 'react';
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
        key: 'paymentState',
        type: 'select',
        label: 'Оплата',
        config: {
          label: 'Оплата',
          data: dictionaries?.invoices?.map(({id, title}) => ({
            label: title,
            value: id.toString(),
          })),
        },
      },

      {
        key: 'registrySum',
        name: ['invoiceSumMin', 'invoiceSumMax'],
        type: 'range',
        label: 'Сумма',
        extra: true,
        config: {
          label: 'Сумма',
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
    [dictionaries?.paymentStatus],
  );
}

export default useFiltersActions;
