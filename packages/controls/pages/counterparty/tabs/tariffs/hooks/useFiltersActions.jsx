import React, { useMemo } from 'react';
import { history } from '../../../../../infrastructure'
import { Ant } from "@vezubr/elements";

function useFiltersActions({ contractorId, isDisabled }) {
  return useMemo(
    () => [
      //Actions
      {
        key: 'addTariff',
        type: 'custom',
        position: 'topRight',
        component: Ant.Button,
        config: {
          icon: 'plus',
          type: 'primary',
          children: 'Добавить тариф',
          className: isDisabled ? 'disabled' : '',
          onClick: () => {
            history.push(`/tariffs/add?contractorId=${contractorId}&goBack=${encodeURIComponent(`/counterparty/${contractorId}/tariffs`)}`);
          },
        },
      },
    ],
    [isDisabled],
  );
}

export default useFiltersActions;
