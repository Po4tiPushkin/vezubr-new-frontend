import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import { ORDERS_STAGES } from '@vezubr/common/constants/constants';
import { Ant } from '@vezubr/elements';


function useRelatedOrdersColumns({ pushParams, params, onOpenRelatedOrdersModal }) {
  const columns = useMemo(
    () => [
      {
        title: t.order('table.number'),
        width: 75,
        dataIndex: 'id',
        key: 'id',
        render: (id, record) => {
          return <LinkWithBack to={{ pathname: `/orders/${id}/general` }}>{id}</LinkWithBack>;
        },
      },

      {
        title: 'Номер рейса',
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        render: (id, record) => {
          return <LinkWithBack to={{ pathname: `/orders/${record.id}/general` }}>{id}</LinkWithBack>;
        },
      },
      {
        title: 'Номер заявки',
        dataIndex: 'requestNr',
        width: 200,
        key: 'requestNr',
        render: (value) => <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Действия',
        dataIndex: 'actions',
        key: 'actions',
        render: (agreement = {}, record, index) => (
          <Ant.Button
            type={'default'}
            size={'small'}
            onClick={() => {
              onOpenRelatedOrdersModal(false);
              pushParams({ ...params, orderId: record.id });
            }}
          >
            Найти в списке рейсов
          </Ant.Button>
        ),
      },
    ],
    [
      pushParams,
      params,
      onOpenRelatedOrdersModal,
    ],
  );

  return columns;
}

export default useRelatedOrdersColumns;
