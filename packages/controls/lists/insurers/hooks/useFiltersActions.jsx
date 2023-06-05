import { useMemo } from 'react';
import t from '@vezubr/common/localization';
import {observer, OBSERVER_ACTIONS} from "../../../infrastructure";

function useFiltersActions({setUseExport}) {
  return useMemo(() => [
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
                observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
              },
              title: 'Изменить отображение колонок',
            },
            {
              icon: 'printOrange',
              onAction: () => void 0,
              title: 'Распечатать',
            },
          ],
        },
      },
    },
  ], [setUseExport]);
}

export default useFiltersActions;