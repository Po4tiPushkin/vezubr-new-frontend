import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';

function useFiltersActions({ dictionaries, history, fieldTypesList }) {

  const fieldTypesListOptions = useMemo(
    () =>
      fieldTypesList.map(
        (value, key) => ({
          label: t.order(`history.${value}`),
          value: value,
          key: key,
        }),
      ),
    [fieldTypesList],
  );


  return useMemo(
    () => [
      {
        key: 'createdAt',
        name: ['createdAt', 'creationDateTo'],
        type: 'dateRange',
        position: 'topLeft',
      },
      //Actions

      {
        key: 'createdBy',
        type: 'input',
        label: 'Автор',
        config: {
          fieldProps: {
            placeholder: 'Автор',
            style: {
              width: 180,
            },
          },
        },
      },

      {
        key: 'property',
        type: 'select',
        label: 'Название поля',
        config: {
          fieldProps: {
            placeholder: 'Название поля',
            style: {
              width: 200,
            },
          },
          data: fieldTypesListOptions.sort((a, b) => a.label?.localeCompare(b.label))
        },
      },

      {
        key: 'newValue',
        type: 'input',
        label: 'Новое значение',
        config: {
          fieldProps: {
            placeholder: 'Новое значение',
            style: {
              width: 180,
            },
          },
        },
      },
      
      {
        key: 'oldValue',
        type: 'input',
        label: 'Старое значение',
        config: {
          fieldProps: {
            placeholder: 'Старое значение',
            style: {
              width: 180,
            },
          },
        },
      },
      

    ],
    [fieldTypesListOptions],
  );
}

export default useFiltersActions;
