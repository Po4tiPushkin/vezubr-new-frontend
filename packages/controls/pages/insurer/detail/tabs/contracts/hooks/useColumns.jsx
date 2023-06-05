import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import { Link } from 'react-router-dom';

function useColumns() {
  const columns = useMemo(
    () => [
      {
        title: 'Номер договора',
        width: 125,
        dataIndex: 'number',
        key: 'number',
        render: (text, record) => <VzTable.Cell.TextOverflow>
        <Link to={`/insurers/contracts/${record.id}`}>{text}</Link>
      </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Название договора',
        width: 250,
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <VzTable.Cell.TextOverflow>{text || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата подписания',
        width: 150,
        dataIndex: 'startsAt',
        key: 'startsAt',
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment(text).format('DD.MM.YYYY')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Срок действия',
        width: 150,
        dataIndex: 'expiresAt',
        key: 'expiresAt',
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment(text).format('DD.MM.YYYY')) || 'Бессрочный'}
          </VzTable.Cell.TextOverflow>
        ),
      },
    ],
    [],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
