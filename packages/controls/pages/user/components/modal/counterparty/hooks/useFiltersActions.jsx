import { useMemo } from 'react';

function useFiltersActions() {
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


  ], []);
}

export default useFiltersActions;