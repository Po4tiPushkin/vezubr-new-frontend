import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
function useFiltersActions() {
  return useMemo(
    () => [
      {
        key: 'filterTitle',
        type: 'input',
        label: 'Название тарифа',
        config: {
          label: 'Название тарифа',
          fieldProps: {
            style: {
              width: 180,
            },
          },
        },
      },
    ],
    [],
  );
}

export default useFiltersActions;
