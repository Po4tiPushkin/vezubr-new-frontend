import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';

function useColumns({ dictionaries, }) {
  const columns = useMemo(
    () => [
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
        title: 'Роль пользователя',
        dataIndex: 'roles',
        key: 'roles',
        width: 160,
        sorter: true,
        render: (employeeRoles = []) => {
          return employeeRoles && employeeRoles.map((role, index, array) => {
            const roleName = dictionaries?.employeeRoles?.find(item => item.id == role)?.title || ''
            return (
              <>
                <VzTable.Cell.TextOverflow>{roleName ? roleName : ''}</VzTable.Cell.TextOverflow>
              </>
            )
          })

        },
      },
      {
        title: 'Телефон',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        width: 160,
        sorter: true,
        render: (phone) => {
          return (
            <VzTable.Cell.TextOverflow>{phone ? Utils.formatPhoneString(phone) : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Электронная почта',
        dataIndex: 'email',
        key: 'email',
        sorter: true,
        render: (email) => {
          return (
            <VzTable.Cell.TextOverflow>{email ? email : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
    ],
    [dictionaries],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
