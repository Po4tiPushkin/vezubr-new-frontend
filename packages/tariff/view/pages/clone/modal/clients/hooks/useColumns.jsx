import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import { ROLES, CONTRAGENT_STATUS } from '@vezubr/common/constants/constants';
import t from "@vezubr/common/localization";


function useColumns({dictionaries, clientId, countersHash, fetchData: reload}) {
  return useMemo(
    () => [
      {
        title: 'ID',
        width: 75,
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        renderToExport: (id) => id,
        render: (id) => {
          return <VzTable.Cell.TextOverflow>{id}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'Роль',
        dataIndex: 'role',
        key: 'role',
        width: 200,
        render: (value) => <VzTable.Cell.TextOverflow>{value && ROLES[value]}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Название',
        dataIndex: 'title',
        key: 'title',
        width: 250,
        render: (value) => <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.clients('table.inn'),
        dataIndex: 'inn',
        key: 'inn',
        width: 250,
        render: (value) => <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        width: 250,
        render: (value) => <VzTable.Cell.TextOverflow>{CONTRAGENT_STATUS[value] || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Тип контрагента',
        dataIndex: 'type',
        key: 'type',
        width: 200,
        render: (value) => <VzTable.Cell.TextOverflow>{dictionaries?.contractorTypes?.find(item => item.id == value)?.title || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.clients('table.vatRate'),
        dataIndex: 'vatRate',
        key: 'vatRate',
        width: 200,
        render: (value) => <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата регистрации',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 200,
        render: (value) => <VzTable.Cell.TextOverflow>{value && moment(value).format('DD-MM-YYYY')}</VzTable.Cell.TextOverflow>,
      },
    ],
    [dictionaries, clientId, countersHash, reload],
  );
}

export default useColumns;
