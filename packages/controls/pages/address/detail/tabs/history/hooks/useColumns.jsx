import React, { useMemo } from 'react';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import t from '@vezubr/common/localization';


function useColumns({dictionaries}) {

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        width: 75,
        dataIndex: 'id',
        key: 'id',
        sorter: true,
        renderToExport: (id, record, index) => id,
        render: (id, record, index) => <LinkWithBack to={{ pathname: `/addresses/${id}` }}>{id}</LinkWithBack>,
      },
      {
        title: 'Дата и время изменения',
        width: 200,
        dataIndex: 'createdAt',
        key: 'createdAt',
        className: 'col-text-narrow',
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>
        )
      },
      {
        title: 'Автор',
        width: 200,
        dataIndex: 'createdBy',
        key: 'createdBy',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => 
        <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Название поля',
        width: 200,
        dataIndex: 'property',
        key: 'property',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => 
          <VzTable.Cell.TextOverflow>{(text && t.address(`history.${text}`)) || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Новое значение',
        width: 200,
        dataIndex: 'newValue',
        key: 'newValue',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => 
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>, 
      },
      {
        title: 'Старое значение',
        width: 200,
        dataIndex: 'oldValue',
        key: 'oldValue',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
    ],
    [],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
