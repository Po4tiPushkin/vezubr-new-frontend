import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Utils } from '@vezubr/common/common';

function useColumns({ dictionaries }) {
  const columns = useMemo(
    () => [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Ф.И.О. пользователя',
        dataIndex: 'fullName',
        key: 'fullName',
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Тип Пользователя',
        dataIndex: 'role',
        key: 'role',
        render: (text) => <VzTable.Cell.TextOverflow>{dictionaries?.userRoles?.[text]}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Телефон',
        dataIndex: 'phone',
        key: 'phone',
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Электронная почта',
        dataIndex: 'email',
        key: 'email',
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
    ],
    [],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
