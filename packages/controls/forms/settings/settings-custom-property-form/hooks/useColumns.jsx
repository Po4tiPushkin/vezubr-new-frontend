import { Ant, IconDeprecated, VzTable } from '@vezubr/elements';
import React, { useMemo } from 'react';

function useColumns({deleteRecord, editRecord}) {
  const columns = useMemo(
    () => [
      {
        title: 'Уникальный номер значения',
        dataIndex: 'id',
        key: 'id',
        width: 300,
        render: (id) => {
          return (
            <VzTable.Cell.TextOverflow>{id ? id : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Наименование значения',
        dataIndex: 'title',
        key: 'title',
        width: 400,
        render: (title) => {
          return (
            <VzTable.Cell.TextOverflow>{title ? title : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Действия',
        key: 'actions',
        width: 200,
        render: (title, record) => {
          return (
            <>
              <Ant.Button className={'margin-right-8'} size={'small'} onClick={() => editRecord(record)}>Редактировать</Ant.Button>
              <Ant.Button size={'small'} onClick={() => deleteRecord(record.id)}>Удалить</Ant.Button>
            </>
          );
        },
      }
    ],
    [deleteRecord, editRecord],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
