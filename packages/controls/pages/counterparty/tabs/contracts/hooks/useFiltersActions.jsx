import React, { useMemo } from 'react';
import { Ant } from "@vezubr/elements";

function useFiltersActions({ history, id, dictionaries, info }) {
  return useMemo(
    () => [
      {
        key: 'isActive',
        type: 'select',
        label: 'Статус договора',
        position: 'topLeft',
        config: {
          data: [
            {
              label: 'Активный',
              value: '1',
            },
            {
              label: 'Неактивный',
              value: '0',
            },
          ],
        },
      },

      {
        key: 'addContract',
        type: 'custom',
        position: 'topRight',
        component: Ant.Button,
        config: {
          icon: 'plus',
          type: 'primary',
          disabled: !info?.contours?.some(({status, contractorStatus}) => status === 1 && contractorStatus === 2),
          children: 'Добавить договор',
          onClick: () => history.push(`/counterparty/${id}/contract/add`),
        },
      },

    ],
    [history, id, dictionaries, info],
  );
}

export default useFiltersActions;
