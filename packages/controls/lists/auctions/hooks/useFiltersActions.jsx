import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

function useFiltersActions({ dictionaries, setUseExport }) {
  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['toStartAtDateFrom', 'toStartAtDateTill'],
        type: 'dateRange',
        position: 'topLeft',
        label: 'Дата подачи',
        config: {
          id: 'auctions-maindate'
        }
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
            id: 'auctions-ordernr-filter'
          },
        },
      },

      {
        key: 'requestNr',
        type: 'input',
        label: 'Номер заявки',
        config: {
          fieldProps: {
            placeholder: 'Номер заявки',
            style: {
              width: 140,
            },
            id: 'auctions-request-id'
          },
        },
      },

      {
        key: 'orderType',
        type: 'select',
        label: t.order('filters.orderType.title'),
        config: {
          label: t.order('filters.orderType.label'),
          fieldProps: {
            placeholder: t.order('filters.orderType.placeholder'),
            style: {
              width: 100,
            },
            id: 'auctions-ordertype'
          },
          data: dictionaries?.orderTypes?.map(({id, title}) => ({
            label: title,
            value: id.toString(),
          })),
        },
      },

      //Extra filters
      // {
      //   key: 'firstAddress',
      //   type: 'input',
      //   extra: true,
      //   label: t.order('filters.filterFirstAddress.title'),
      //   config: {
      //     label: t.order('filters.filterFirstAddress.label'),
      //     fieldProps: {
      //       style: {
      //         width: 300,
      //       },
      //     },
      //   },
      // },

      // {
      //   key: 'lastAddress',
      //   type: 'input',
      //   extra: true,
      //   label: t.order('filters.filterLastAddress.title'),
      //   config: {
      //     label: t.order('filters.filterLastAddress.label'),
      //     fieldProps: {
      //       style: {
      //         width: 300,
      //       },
      //     },
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
          id: 'auctions-menu',
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
    [dictionaries?.vehicleBodies, dictionaries?.bargainStatuses, dictionaries?.orderTypes],
  );
}

export default useFiltersActions;
