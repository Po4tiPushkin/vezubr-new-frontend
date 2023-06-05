import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';
import { ROLES } from '@vezubr/common/constants/constants';
function useFiltersActions({ setUseExport, history }) {
  return useMemo(
    () => [
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
        label: 'Наименование подрядчика',
        config: {
          label: 'Наименование подрядчика',
          fieldProps: {
            style: {
              width: 180,
            },
          },
        },
      },

      {
        key: 'role',
        type: 'select',
        label: 'Роль',
        getValue: (v) => v && v.split(',').map((item) => item),
        config: {
          label: 'Роль',
          fieldProps: {
            mode: 'single',
            maxTagCount: 1,
            placeholder: 'Роль',
            style: {
              width: 300,
            },
          },
          data: Object.keys(ROLES)
            .filter((el) => el !== '2')
            .map((key) => ({
              label: ROLES[key],
              value: key,
            })),
        },
      },
      ...[
        APP !== 'producer'
          ? {
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
          : {},
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
    ],
    [setUseExport],
  );
}

export default useFiltersActions;
