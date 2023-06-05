import { VzTable } from '@vezubr/elements';
import React, { useMemo } from 'react';

function useColumns({ dictionaries, groups =[] }) {
  const columns = useMemo(
    () => [
      {
        title: '№',
        width: 75,
        dataIndex: 'number',
        key: 'number',
        render: (number, record, index) => (
          <VzTable.Cell.TextOverflow>{number}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Ф.И.О пользователя',
        dataIndex: 'fullName',
        key: 'fullName',
        width: 200,
        sorter: true,
        render: (name) => {
          return (
            <VzTable.Cell.TextOverflow>{name ? name : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Тип пользователя',
        dataIndex: 'role',
        key: 'role',
        width: 150,
        sorter: true,
        render: (role) => {
          return (
            <VzTable.Cell.TextOverflow>{dictionaries?.userRoles?.find(el => el.id === role)?.title}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Роль пользователя',
        dataIndex: 'employeeRoles',
        key: 'employeeRoles',
        width: 160,
        sorter: true,
        render: (employeeRoles = [], record) => {
          return employeeRoles && employeeRoles.map((role, index, array) => {
            const roleName = dictionaries?.employeeRoles?.find(item => item.id == role)?.title || ''
            return (
              <>
                <VzTable.Cell.TextOverflow key={`${record.id}-${index}-${role}`}>{roleName ? roleName : ''}</VzTable.Cell.TextOverflow>
              </>
            )
          })

        },
      },
      {
        title: 'Телефон',
        dataIndex: 'phone',
        key: 'phone',
        width: 160,
        sorter: true,
        render: (phone) => {
          return (
            <VzTable.Cell.TextOverflow>{phone ? phone : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Электронная почта',
        dataIndex: 'email',
        key: 'email',
        sorter: true,
        width: 150,
        render: (email) => {
          return (
            <VzTable.Cell.TextOverflow>{email ? email : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Подразделение',
        dataIndex: 'unit',
        key: 'unit',
        sorter: true,
        width: 150,
        render: (unit) => {
          return (
            <VzTable.Cell.TextOverflow>{unit?.title}</VzTable.Cell.TextOverflow>
          )
        }
      },
      {
        title: 'Наличие ЭЦП',
        dataIndex: 'hasDigitalSignature',
        key: 'hasDigitalSignature',
        sorter: true,
        width: 150,
        render: (text) => {
          return (
            <VzTable.Cell.TextOverflow>{text ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>
          )
        }
      },
      ...[
        APP === 'dispatcher'
        ?
        {
          title: 'Группа Логистов',
          dataIndex: 'requestGroupIds',
          key: 'requestGroupIds',
          width: 150,
          render: (items, record) => {
            if (!Array.isArray(items)) {
              return ''
            }
            return items && items.map((group, index, array) => {
              const groupName = groups.find(item => item.id === group)?.title
              return (
                <>
                  <VzTable.Cell.TextOverflow key={`${record.id}-${index}-${group}`}>{groupName ? groupName : ''}</VzTable.Cell.TextOverflow>
                </>
              )
            })
          }
        }
        :
        {}
      ],
    ],
    [dictionaries, groups],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
