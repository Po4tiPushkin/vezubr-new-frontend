import React, { useMemo } from 'react';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { TARIFF_TYPES } from "@vezubr/tariff";

function useColumns({ dictionaries }) {
  const columns = useMemo(
    () => [
      {
        title: 'ID',
        width: 105,
        dataIndex: 'tariffId',
        key: 'tariffId',
        sorter: true,
        renderToExport: (id, record, index) => id,
        render: (id, record, index) => {
          return <LinkWithBack to={{ pathname: `/tariffs/${id}` }}>{id}</LinkWithBack>;
        },
      },
      {
        title: 'Статус в контуре',
        width: 100,
        dataIndex: 'isOwner',
        key: 'isOwner',
        className: 'col-text-narrow',
        sorter: true,
        render: (isOwner, record, index) => (
          <VzTable.Cell.TextOverflow>{isOwner ? 'Владелец' : 'Гость'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Конфигурация тарифа',
        width: 130,
        dataIndex: 'type',
        key: 'type',
        className: 'col-text-narrow',
        sorter: true,
        render: (type, record, index) => (
          <VzTable.Cell.TextOverflow>
            {record.orderType === 'loaders_order' ? 'ПРР' : TARIFF_TYPES[type]}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Название',
        width: 130,
        dataIndex: 'title',
        key: 'title',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Начальная дата',
        width: 110,
        dataIndex: 'dateStart',
        key: 'dateStart',
        sorter: true,
        render: (date) => (
          <VzTable.Cell.TextOverflow>
            {date ? moment(Utils.secToMs(date)).format('DD.MM.YYYY') : null}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Конечная дата',
        dataIndex: 'dateEnd',
        key: 'dateEnd',
        width: 110,
        sorter: true,
        render: (date) => (
          <VzTable.Cell.TextOverflow>
            {date ? moment(Utils.secToMs(date)).format('DD.MM.YYYY') : null}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Время действия',
        dataIndex: 'dayHourFrom',
        key: 'dayHourFrom',
        width: 200,
        sorter: true,
        render: (date, record) => (
          <VzTable.Cell.TextOverflow>
            от {record.dayHourFrom} часов до {record.dayHourTill} часов дня
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Договор и ДС',
        dataIndex: 'contract',
        key: 'contractId',
        sorter: true,
        width: 150,
        render: (entity, record) => (
          <VzTable.Cell.TextOverflow>
            {record.contractId && <Link to={`/contract/${record.contractId}`}>{record.contractId}</Link>}
            {record.agreementId && (
              <Link to={`/agreement/${record.agreementId}`}>{record.agreementId}</Link>
            )}
          </VzTable.Cell.TextOverflow>
        ),
      },
    ],
    [dictionaries?.tariffTypes],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
