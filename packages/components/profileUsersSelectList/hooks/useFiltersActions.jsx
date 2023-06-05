import { useMemo } from 'react';
const PHONE_MASK = '+7 (999) 999-99-99';

function useFiltersActions({ dictionaries, units, groups }) {

  const userRolesTreeData = dictionaries?.userRoles?.map(({ id, title }) => ({
    key: id,
    value: id,
    label: title
  }))

  const employeeRolesTreeData = dictionaries?.employeeRoles?.map(({ title, id }) => ({
    key: id,
    value: parseInt(id),
    title
  }))

  const unitListTreeData = units.map(({ id, title }) => ({
    key: id,
    value: id,
    title
  }));

  const groupsData = groups.map(({ id, title }) => ({
    key: id,
    value: id,
    label: title,
  }));

  return useMemo(
    () => [
      {
        key: 'fullName',
        type: 'input',
        config: {
          minLength: 2,
          fieldProps: {
            placeholder: 'Ф.И.О пользователя',
            style: {
              width: 180,
            },
          },
        },
      },

      {
        key: 'role',
        type: 'select',
        config: {
          fieldProps: {
            placeholder: 'Тип',
            allowClear: true,
            treeCheckable: true,
            style: {
              width: 180,

            },
          },
          data: userRolesTreeData,
        },
      },

      {
        key: 'employeeRoles',
        type: 'selectTree',
        config: {
          fieldProps: {
            placeholder: 'Роль',
            allowClear: true,
            multiple: true,
            treeCheckable: true,
            style: {
              width: 140,
              minWidth: 140,
            },
          },
          data: employeeRolesTreeData,
        },
      },

      {
        key: 'phone',
        type: 'input',
        config: {
          minLength: 2,
          fieldProps: {
            placeholder: 'Телефон',
            style: {
              width: 160,
            },
          },
        },
      },

      {
        key: 'email',
        type: 'input',
        config: {
          minLength: 2,
          fieldProps: {
            placeholder: 'Электронная почта',
            style: {
              width: 220,
            },
          },
        },
      },
      {
        key: 'unit',
        type: 'selectTree',
        config: {
          fieldProps: {
            placeholder: 'Подразделение',
            allowClear: true,
            multiple: true,
            treeCheckable: true,
            style: {
              width: 180,
            },
          },
          data: unitListTreeData,
        },
      },
      ...[
        APP === 'dispatcher'
          ?
          {
            key: 'requestGroupIds',
            type: 'selectTree',
            config: {
              fieldProps: {
                placeholder: 'Группы',
                allowClear: true,
                multiple: true,
                treeCheckable: true,
                style: {
                  width: 180,
                },
              },
              data: groupsData,
            },
          }
          :
          {}
      ],
    ],
    [units, groups],
  );
}

export default useFiltersActions;
