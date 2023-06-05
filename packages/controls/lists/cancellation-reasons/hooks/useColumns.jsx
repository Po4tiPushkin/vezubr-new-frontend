import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable, IconDeprecated } from '@vezubr/elements';
import moment from 'moment';

function useColumns({ onDelete }) {
  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 200,
        key: 'id',
        sorter: false,
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Причина',
        dataIndex: 'reason',
        width: 500,
        key: 'reason',
        sorter: false,
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Действия',
        key: 'actions',
        render: (val, record) => (
          <div className={'actions flexbox'}>
            <div onClick={() => onDelete(record)}>
              <IconDeprecated name={'trashBinBlack'} />
            </div>
          </div>
        )
      }
    ],
    [],
  );

  return columns;
}

export default useColumns;
