import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { ROLES } from '@vezubr/common/constants/constants';
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

    {
      key: 'role',
      type: 'select',
      label:'Роль',
      config: {
        label: 'Роль',
        fieldProps: {
          mode: 'single',
          maxTagCount: 1,
          placeholder: 'Роль',
          style: {
            width: 300,
          },
        },
        data: Object.keys(ROLES).filter(el => el !== '2').map((key) => ({  
          label: ROLES[key],
          value: key,
        })),
      },
    },
  ], []);
}

export default useFiltersActions;