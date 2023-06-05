import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { TableActions } from '@vezubr/components';

function useColumns({ dictionaries, reload }) {
  const columns = useMemo(
    () => [
      {
        title: t.order('table.number'),
        width: 75,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        sorter: true,
        renderToExport: false,
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>
      },
      {
        title: 'Номер рейса',
        width: 120,
        dataIndex: 'orderNr',
        key: 'orderNr',
        sorter: true,
        render: (text, record) => <LinkWithBack
          to={{ pathname: `/orders/${record.orderId}/${APP === 'dispatcher' ? 'documents-order' : 'documents'}` }}>
          {text}
        </LinkWithBack>
      },
      {
        title: 'Тип документа',
        width: 150,
        dataIndex: 'type',
        key: 'documentType',
        sorter: true,
        render: (type) => <VzTable.Cell.TextOverflow>
          {dictionaries.documentsTypes.find(el => el.id === type)?.title}
        </VzTable.Cell.TextOverflow>
      },
      {
        title: 'Способ подписания',
        width: 150,
        dataIndex: 'isWithoutDocFlow',
        key: 'isWithoutDocFlow',
        render: (text) => <VzTable.Cell.TextOverflow>{text ? 'Безбумажный' : 'Бумажный'}</VzTable.Cell.TextOverflow>
      },
      {
        title: 'Статус подписания',
        width: 150,
        dataIndex: 'state',
        key: 'state',
        sorter: true,
        render: (state) => <VzTable.Cell.TextOverflow>
          {dictionaries.documentsStates.find(el => el.id === state)?.title}
        </VzTable.Cell.TextOverflow>
      },
      {
        title: 'Дата создания',
        width: 150,
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>
          {(text && moment.utc(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
        </VzTable.Cell.TextOverflow>
      },
      {
        title: t.clients('Действия'),
        key: 'actions',
        width: 250,
        fixed: 'right',
        render: (contours = [], record) => (
          <TableActions
            className={'actions-documents'}
            type={'Documents'}
            record={record}
            dictionaries={dictionaries}
            reload={reload}
          />
        ),
      },
    ],
    [dictionaries, reload],
  );

  return columns;
}

export default useColumns;
