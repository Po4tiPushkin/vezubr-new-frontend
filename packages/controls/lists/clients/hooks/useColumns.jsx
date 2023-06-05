import React, { useMemo } from 'react';
import { IconDeprecated, VzTable } from '@vezubr/elements';
import moment from 'moment';
import { ROLES, CONTRAGENT_STATUS } from '@vezubr/common/constants/constants';
import t from "@vezubr/common/localization";
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import {TableActions} from '@vezubr/components'

function useColumns({dictionaries, clientId, countersHash, fetchData: reload}) {
  return useMemo(
    () => [
      {
        title: '№',
        width: 75,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        fixed: 'left',
        renderToExport: (number) => number,
        render: (number, record) => {
          return <LinkWithBack to={{ pathname: `/counterparty/${record.id}` }}>{number}</LinkWithBack>;
        },
      },
      {
        title: t.clients('table.inn'),
        dataIndex: 'inn',
        sorter: true,
        key: 'inn',
        width: 250,
        render: (value, record) => {
          return (
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <LinkWithBack style={{display: 'inline-block'}} to={{ pathname: `/counterparty/${record.id}` }}>{value}</LinkWithBack>
              {!record.hasResponsible ? <IconDeprecated name="danger" title="Не назначены Внутренние Ответсвенные Пользователи (Логисты)" /> : ''}
            </div>
          );
        },
      },
      {
        title: 'Роль',
        dataIndex: 'role',
        key: 'role',
        sorter: true,
        width: 200,
        render: (value) => <VzTable.Cell.TextOverflow>{value && ROLES[value]}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Статус в контуре',
        dataIndex: 'contours',
        key: 'contours',
        width: 200,
        render: (contours = [], record) => (
          <VzTable.Cell.TextOverflow>
            {contours[0]?.managerContractorId == record.id ? 'Владелец' : 'Гость'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Название',
        dataIndex: 'title',
        sorter: true,
        key: 'title',
        width: 250,
        render: (value) => <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Статус',
        dataIndex: 'contours',
        key: 'contourStatus',
        width: 250,
        render: (value, record) => (
          <VzTable.Cell.TextOverflow>
            {dictionaries?.contourContractorStatuses?.find(({ id }) => id == record.contours[0]?.status)?.title || ''}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Состояние',
        dataIndex: 'status',
        sorter: true,
        key: 'status',
        width: 250,
        render: (value) => <VzTable.Cell.TextOverflow>{CONTRAGENT_STATUS[value] || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Тип контрагента',
        dataIndex: 'type',
        sorter: true,
        key: 'type',
        width: 200,
        render: (value) => (
          <VzTable.Cell.TextOverflow>
            {dictionaries?.contractorTypes?.find((el) => el.id === value)?.title || ''}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.clients('table.vatRate'),
        dataIndex: 'vatRate',
        sorter: true,
        key: 'vatRate',
        width: 200,
        render: (value) => <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата регистрации',
        dataIndex: 'createdAt',
        sorter: true,
        key: 'createdAt',
        width: 200,
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value && moment(value).format('DD-MM-YYYY')}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.clients('Действия'),
        key: 'actions',
        width: 250,
        fixed: 'right',
        render: (contours = [], record) => (
          <TableActions
            className={'actions-clients'}
            type={'Counterparties'}
            record={record}
            countersHash={countersHash}
            dictionaries={dictionaries}
            reload={reload}
          />
        ),
      },
    ],
    [dictionaries, clientId, countersHash, reload],
  );
}

export default useColumns;
