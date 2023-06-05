import React, { useMemo } from 'react';
import { VzTable, IconDeprecated } from '@vezubr/elements';
import DeleteUserAction from '../actions/deleteUserAction';
import LinkWithBack from '@vezubr/components/link/linkWithBack';

function useColumns({ dictionaries, userId, goToEditUser, reloadUsers, groups = [] }) {
  const columns = useMemo(
    () => [
      {
        title: '№',
        width: 75,
        dataIndex: 'number',
        key: 'number',
        render: (number, record, index) => (
          <LinkWithBack to={{ pathname: `/profile/users/${record.id}` }}>{number}</LinkWithBack>
        ),
      },
      {
        title: 'Ф.И.О пользователя',
        dataIndex: 'fullName',
        key: 'fullName',
        width: 200,
        sorter: true,
        render: (name, record) => {
          return (
            <LinkWithBack to={{ pathname: `/profile/users/${record.id}` }}>{name ? name : ''}</LinkWithBack>
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
                <VzTable.Cell.TextOverflow key={`${record.id}-${index}`}>{roleName ? roleName : ''}</VzTable.Cell.TextOverflow>
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
        dataIndex: 'unitTitle',
        key: 'unitTitle',
        sorter: true,
        width: 150,
        render: (unit) => {
          return (
            <VzTable.Cell.TextOverflow>{unit}</VzTable.Cell.TextOverflow>
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
            render: (items) => {
              if (!Array.isArray(items)) {
                return ''
              }
              let groupsRender = ' ';
              items.forEach(el => {
                groupsRender += ` ${groups.find(item => item.id === el)?.title},`
              })
              groupsRender = groupsRender.slice(0, -1);
              return <>{groupsRender}</>;
            }
          }
          :
          {}
      ],
      {
        title: 'Действия',
        key: 'actions',
        fixed: 'right',
        width: 120,
        render: (text, record, index) => (
          <>
            {IS_ADMIN && (
              <div className={'actions flexbox'}>
                <div key={'edit-btn'} onClick={() => goToEditUser(record)} >
                  <IconDeprecated name={'editBlack'} />
                </div>
                {record.id !== userId ? (
                  <div key={'delete-btn'}>
                    <DeleteUserAction userId={record.id} reloadUsers={reloadUsers} />
                  </div>
                ) : null}
              </div>
            )}
          </>
        )
      },
    ],
    [dictionaries, groups],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
