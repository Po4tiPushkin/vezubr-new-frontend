import React, { useMemo } from 'react';


function useFiltersActions(data, namesList) {
  return useMemo(
    () => [
      {
        key: 'fullName',
        type: 'input',
        label: 'Ф.И.О. пользователя',
        config: {
          fieldProps: {
            placeholder: 'Ф.И.О. пользователя',
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'email',
        type: 'input',
        label: 'Email',
        config: {
          fieldProps: {
            placeholder: 'Email',
            style: {
              width: 140,
            },
          },
        },
      },
    ],
    [],
  );
}

export default useFiltersActions;