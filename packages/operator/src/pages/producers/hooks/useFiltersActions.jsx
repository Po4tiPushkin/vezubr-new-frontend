import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { Agent as AgentService, Contour as ContourService } from '@vezubr/services/index.operator';
import { Empty, Spin } from '@vezubr/elements/antd';

const ROLES = {
  4: t.reg('dispatcher'),
  1: t.reg('contractor'),
}

function useFiltersActions({ dictionaries }) {

  return useMemo(
    () => [
      {
        key: 'filterId',
        type: 'input',
        label: t.clients('filter.id'),
        config: {
          fieldProps: {
            placeholder: t.clients('filter.id'),
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'filterName',
        type: 'input',
        label: t.clients('filter.filterName'),
        config: {
          label: t.clients('filter.filterName'),
          fieldProps: {
            placeholder: t.clients('filter.all'),
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'filterStates',
        type: 'select',
        label: t.transports('uiStatus'),
        config: {
          label: t.transports('uiStatus'),
          fieldProps: {
            placeholder: t.clients('filter.all'),
            style: {
              width: 300,
            },
          },
          data: Object.keys(dictionaries?.contractorStates).map((key) => ({
            label: dictionaries?.contractorStates[key],
            value: key,
          })),
        },
      },

      {
        key: 'filterMinBalance',
        type: 'input',
        label: t.clients('filter.filterMinBalance'),
        extra: true,
        config: {
          label: t.clients('filter.filterMinBalance'),
          fieldProps: {
            placeholder: '>= 0',
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'filterInn',
        type: 'input',
        label: t.clients('filter.filterInn'),
        config: {
          label: t.clients('filter.filterInn'),
          fieldProps: {
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'filterRole',
        type: 'select',
        label: "Роль",
        config: {
          label: "Роль",
          fieldProps: {
            placeholder: "Роль",
            style: {
              width: 300,
            },
          },
          data: Object.keys(ROLES).map(key => ({
            label: ROLES[key],
            value: key
          })),
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
                onAction: () => void 0,
                title: 'Столбцы',
              },
            ],
          },
        },
      },
    ],
    [
      dictionaries?.contractorStates,
      dictionaries?.scoringStatuses,
    ],
  );
}

export default useFiltersActions;
