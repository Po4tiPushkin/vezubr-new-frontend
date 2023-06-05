import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from "../../../infrastructure";

function useFiltersActions({ setUseExport, history }) {
  return useMemo(() => [
    {
      key: 'inn',
      type: 'input',
      label: 'ИНН',
      config: {
        label: 'ИНН',
        fieldProps: {
          placeholder: 'ИНН',
          style: {
            width: 180,
          },
        },
      },
    },

    {
      key: 'title',
      type: 'input',
      label: 'Наименование клиента',
      config: {
        label: 'Наименование клиента',
        fieldProps: {
          style: {
            width: 180,
          },
        },
      },
    },

    ...[
      APP !== 'producer'
        ?
        {
          key: 'addChild',
          type: 'button',
          position: 'topRight',
          config: {
            icon: 'plusWhite',
            className: 'rounded box-shadow primary',
            content: <p className="no-margin">Добавить внутреннего Контрагента</p>,
            withMenu: false,
            onClick: () => {
              history.push('/counterparty/create-child');
            },
          },
        }
        :
        {}
    ],

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