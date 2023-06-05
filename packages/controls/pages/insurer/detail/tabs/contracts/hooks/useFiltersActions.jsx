import React, { useMemo } from 'react';
import { Ant } from "@vezubr/elements";

function useFiltersActions({ history, id }) {
  return useMemo(
    () => [
      // {
      //   key: 'isActive',
      //   type: 'select',
      //   label: 'Активный',
      //   position: 'topLeft',
      //   config: {
      //     label: 'Статус договора',
      //     data: [
      //       {
      //         label: 'Активный',
      //         value: '1',
      //       },
      //       {
      //         label: 'Неактивный',
      //         value: '0',
      //       },
      //     ],
      //   },
      // },
      {
        key: 'addContract',
        type: 'custom',
        position: 'topRight',
        component: Ant.Button,
        config: {
          icon: 'plus',
          type: 'primary',
          children: 'Добавить договор',
          onClick: () => history.push(`/insurers/${id}/contracts/add`),
        },
      },

    ],
    [history, id],
  );
}

export default useFiltersActions;
