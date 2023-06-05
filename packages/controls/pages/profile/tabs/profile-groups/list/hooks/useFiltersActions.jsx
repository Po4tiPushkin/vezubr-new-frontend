import React, { useMemo } from 'react';
const PHONE_MASK = '+7 (999) 999-99-99';

function useFiltersActions() {

  return useMemo(
    () => [
      {
        key: 'isActive',
        type: 'select',
        label: 'Статус группы',
        position: 'topLeft',
        config: {
          fieldProps: {
            placeholder: 'Выберите из списка'
          },
          data: [
            {
              label: 'Активный',
              value: true,
            },
            {
              label: 'Неактивный',
              value: false,
            },
          ],
        },
      },
    ],
    [],
  );
}

export default useFiltersActions;
