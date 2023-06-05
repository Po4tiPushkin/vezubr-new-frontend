import React, { useMemo } from 'react';

function useFiltersActions({ dictionaries, unitList, groups = [], getDataFuncForExport }) {

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

  const unitListTreeData = unitList.map(({ id, title }) => ({
    key: id,
    value: id,
    label: title,
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
            maxTagCount: 1,
            style: {
              width: 350,
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
      {
        key: 'filterButtonContext',
        type: 'buttonContext',
        position: 'topRight',
        config: {
          id: 'employees-menu',
          menuOptions: {
            list: [
              {
                icon: 'excelOrange',
                onAction: () => {
                  getDataFuncForExport();
                },
                title: 'Экспорт в Эксель',
                id: 'orders-exel',
              },
            ],
          },
        },
      },
    ],
    [unitList, groups, getDataFuncForExport],
  );
}

export default useFiltersActions;
