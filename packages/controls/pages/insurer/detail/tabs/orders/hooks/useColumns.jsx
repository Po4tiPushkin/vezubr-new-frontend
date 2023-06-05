import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';

import { LinkWithBack } from '@vezubr/components';
import t from '@vezubr/common/localization';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns({ dictionaries, history }) {
  const columns = useMemo(
    () => [
      {
        title: t.order('table.number'),
        width: 75,
        export: true,
        dataIndex: 'number',
        key: 'number',
        fixed: 'left',
        render: (number, record) => {
          return <LinkWithBack to={{ pathname: `/orders/${record.id}/general` }}>{number}</LinkWithBack>;
        },
      },
      {
        title: 'Номер рейса',
        export: true,
        dataIndex: 'orderNr',
        width: 200,
        key: 'orderNr',
        sorter: true,
        render: (id, record) => {
          return <LinkWithBack to={{ pathname: `/orders/${record.id}/general` }}>{id}</LinkWithBack>;
        },
      },
      {
        title: 'Идентификатор Рейса',
        width: 200,
        export: true,
        dataIndex: 'clientNumber',
        key: 'clientNumber',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Подача',
        export: true,
        dataIndex: 'toStartAt',
        key: 'toStartAt',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment.utc(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Требуемый Тип ТС',
        width: 200,
        export: true,
        dataIndex: 'requiredVehicleTypeId',
        key: 'requiredVehicleTypeId',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {dictionaries.vehicleTypes.find(el => el.id === text)?.name}
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Номер договора',
        width: 200,
        export: true,
        dataIndex: 'contractNumber',
        key: 'contractNumber',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата договора',
        export: true,
        dataIndex: 'contractStartsAt',
        key: 'contractStartAt',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment.utc(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Срок договора до',
        export: true,
        dataIndex: 'contractExpiresAt',
        key: 'contractExpiresAt',
        width: 200,
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment.utc(text).format('DD.MM.YYYY HH:mm:ss')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Страховая премия',
        width: 200,
        export: true,
        dataIndex: 'insurancePremium',
        key: 'insurancePremium',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {text && currencyFormat.format(text / 100)}
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Объявленная стоимость',
        width: 200,
        export: true,
        dataIndex: 'assessedCargoValue',
        key: 'assessedCargoValue',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {currencyFormat.format(text / 100)}
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Категория груза',
        width: 200,
        export: true,
        dataIndex: 'cargoCategory',
        key: 'cargoCategory',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {dictionaries.cargoTypes.find(el => el.id === text)?.title}
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.firstAddress'),
        width: 200,
        export: true,
        dataIndex: 'firstAddress',
        key: 'firstAddress',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.order('table.lastAddress'),
        width: 200,
        export: true,
        dataIndex: 'lastAddress',
        key: 'lastAddress',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Выгодоприобредатель',
        width: 200,
        export: true,
        dataIndex: 'beneficiary',
        key: 'beneficiary',
        className: 'col-text-narrow',
        sorter: true,
        render: (text, record, index) => <VzTable.Cell.TextOverflow>
          {text}
        </VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Заказчик',
        width: 200,
        export: true,
        dataIndex: 'client',
        key: 'clientName',
        className: 'col-text-narrow',
        render: (client) => (
          <VzTable.Cell.TextOverflow>
            {client && (client.title || client.inn || client.id)}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.order('table.producerCompany'),
        width: 200,
        export: true,
        dataIndex: 'producer',
        key: 'producerName',
        className: 'col-text-narrow',
        render: (producer) => (
          <VzTable.Cell.TextOverflow>
            {producer && (producer.title || producer.inn || producer.id)}
          </VzTable.Cell.TextOverflow>
        ),
      },

    ],
    [dictionaries],
  );

  return columns;
}

export default useColumns;
