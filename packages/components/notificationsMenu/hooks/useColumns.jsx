import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment' 

function useColumns() {
  return useMemo(
    () => [
      {
        title: 'Дата получения',
        dataIndex: 'sentAt',
        key: 'sentAt',
        width: 150,
        className: 'col-text-narrow',
        render: (text, record, index) =>{ 
          const formattedDate = moment(text).format('DD.MM.YY HH:mm:ss')
          return <VzTable.Cell.TextOverflow>{text ? formattedDate : 'Не было прочтено'}</VzTable.Cell.TextOverflow>
        },
      },
      {
        title: 'Тип',
        dataIndex: 'type',
        key: 'type',
        className: 'col-text-narrow',
        width: 100,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: 'Текст	',
        dataIndex: 'message',
        key: 'message',
        width: 300,
        render: (text, record, index) => (
          <>{text}</>
        ),
      },

      {
        title: 'Дата прочтения',
        dataIndex: 'noticedAt',
        key: 'noticedAt',
        width: 150,
        render: (text, record, index) =>{ 
          const formattedDate = moment(text).format('DD.MM.YY HH:mm:ss')
          return <VzTable.Cell.TextOverflow>{text ? formattedDate : 'Не было прочтено'}</VzTable.Cell.TextOverflow>
        }
      },
    ],
    [],
  );
}

export default useColumns;
