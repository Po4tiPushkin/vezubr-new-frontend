import { useMemo } from 'react';

function useFiltersActions() {
  return useMemo(() => [
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
  ], []);
}

export default useFiltersActions;