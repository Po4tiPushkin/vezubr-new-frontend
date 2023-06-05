import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable, IconDeprecated } from '@vezubr/elements';
import moment from 'moment';

function useColumns({ onDelete, goToEdit }) {
  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 200,
        key: 'id',
        sorter: true,
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Название подразделения',
        dataIndex: 'title',
        width: 200,
        key: 'title',
        sorter: true,
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Идентификатор в системе',
        dataIndex: 'externalId',
        width: 200,
        key: 'externalId',
        sorter: true,
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Действия',
        key: 'actions',
        render: (val, record) => (
          <>
            {
              IS_ADMIN && (
                <div className={'actions flexbox'}>
                  <div onClick={() => goToEdit(record)}>
                    <IconDeprecated name={'editBlack'} />
                  </div>
                  <div onClick={() => onDelete(record.id)}>
                    <IconDeprecated name={'trashBinBlack'} />
                  </div>
                </div>
              )
            }
          </>
        )
      }
    ],
    [],
  );

  return columns;
}

export default useColumns;
