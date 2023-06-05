import { useMemo } from 'react';
import t from '@vezubr/common/localization';
import {observer, OBSERVER_ACTIONS} from "../../../infrastructure";

function useFiltersActions({setUseExport}) {
  return useMemo(() => [
    {
      key: 'mainDate',
      name: ['toStartAtDateFrom', 'toStartAtDateTill'],
      type: 'dateRange',
      position: 'topLeft',
      label: 'Дата подачи',
      config: {
        id: 'deferred-maindate'
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
          id: 'deferred-ordernr-filter'
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
          id: 'deferred-requestnr'
        },
      },
    },

    {
      key: 'filterButtonContext',
      type: 'buttonContext',
      position: 'topRight',
      config: {
        id: 'deferred-menu',
        menuOptions: {
          list: [
            {
              icon: 'settingsOrange',
              onAction: () => {
                observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
              },
              title: 'Изменить отображение колонок',
            },
            {
              icon: 'printOrange',
              onAction: () => void 0,
              title: 'Распечатать',
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
  ], [setUseExport]);
}

export default useFiltersActions;