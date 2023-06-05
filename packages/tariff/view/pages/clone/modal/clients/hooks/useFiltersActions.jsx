import { useMemo } from 'react';

function useFiltersActions() {
  return useMemo(() => [
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
  ], []);
}

export default useFiltersActions;