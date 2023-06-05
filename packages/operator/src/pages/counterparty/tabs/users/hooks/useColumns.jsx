import React, { useMemo } from 'react';
import { VzTable, IconDeprecated } from '@vezubr/elements';
import moment from 'moment';
import { Link } from 'react-router-dom';

function useColumns({ dictionaries }) {
  const columns = useMemo(
    () => [
      {
        title: 'Ф.И.О пользователя',
        dataIndex: 'fullName',
        key: 'fullName',
        width: 200,
        sorter: true,
        render: (name, record) => {
          return (
            <VzTable.Cell.TextOverflow>{`${record.surname} ${record.name} ${record.patronymic || ''}`}</VzTable.Cell.TextOverflow>
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
            <VzTable.Cell.TextOverflow>{Object.values(dictionaries?.userRoles)?.find(el => el.id === role)?.title}</VzTable.Cell.TextOverflow>
          );
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
    ],
    [dictionaries?.userRoles, dictionaries?.employeeRoles],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
