import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import t from '@vezubr/common/localization';
import Utils from '@vezubr/common/common/utils';

function useColumns({ dictionaries, points, employees }) {
  const columns = useMemo(
    () => [
      {
        title: 'ID',
        width: 75,
        dataIndex: 'id',
        key: 'id',
        renderToExport: (id, record, index) => id,
        render: (id, record, index) =>
          <VzTable.Cell.TextOverflow>
            {id}
          </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата и время изменения',
        width: 140,
        dataIndex: 'createdAt',
        key: 'createdAt',
        className: 'col-text-narrow',
        render: (text) => {
          const timezone = moment.tz.guess()
          const offset = moment(text).tz(timezone).utcOffset()
          return (<VzTable.Cell.TextOverflow>
            {(text && moment(text).add(offset, 'minutes').format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>)
        }
      },
      {
        title: 'Автор',
        width: 120,
        dataIndex: 'createdBy',
        key: 'createdBy',
        className: 'col-text-narrow',
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Название поля',
        width: 170,
        dataIndex: 'property',
        key: 'property',
        className: 'col-text-narrow',
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>{(text && t.order(`history.${text}`)) || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Новое значение',
        width: 160,
        dataIndex: 'newValue',
        key: 'newValue',
        className: 'col-text-narrow',
        render: (text, record, index) =>
          <VzTable.Cell.TextOverflow>
            {text ? Utils.getOrderHistoryValue(record.property, text, dictionaries, { employees }) : '-'}
          </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Старое значение',
        width: 160,
        dataIndex: 'oldValue',
        key: 'oldValue',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {text ? Utils.getOrderHistoryValue(record.property, text, dictionaries, { employees }) : '-'}
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Активная точка',
        dataIndex: 'orderPointPosition',
        key: 'orderPointPosition',
        className: 'col-text-narrow',
        render: (number, record) => <VzTable.Cell.TextOverflow>
          {Array.isArray(points) ? points.find(el => number === el.position)?.addressString : ''}
        </VzTable.Cell.TextOverflow>
      }
    ],
    [dictionaries, points, employees],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
