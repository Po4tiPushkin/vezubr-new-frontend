import React, { useMemo } from 'react';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import { CONTOUR_COMMISSION_PAYER, CONTOUR_STATUSES, CONTOUR_TYPES } from '@vezubr/common/constants/constants';
import { VzTable } from '@vezubr/elements';

function useColumns() {
  return useMemo(
    () => [
      {
        title: 'ID',
        width: 75,
        dataIndex: 'id',
        key: 'id',
        fixed: 'left',
        renderToExport: (id, record, index) => id,
        render: (id, record, index) => <LinkWithBack to={{ pathname: `/contours/${id}` }}>{id}</LinkWithBack>,
      },
      {
        title: 'Название',
        width: 250,
        dataIndex: 'title',
        key: 'title',
        className: 'col-text-narrow',
        render: (text, record, index) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Тип',
        width: 200,
        dataIndex: 'type',
        key: 'type',
        render: (typeId, record, index) => (
          <VzTable.Cell.TextOverflow>{CONTOUR_TYPES.map(el => el.id === typeId)?.title}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Статус',
        width: 200,
        dataIndex: 'status',
        key: 'status',
        render: (statusId, record, index) => (
          <VzTable.Cell.TextOverflow>{CONTOUR_STATUSES[statusId]}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: 'Платит комиссию',
        width: 150,
        dataIndex: 'comissionPayer',
        key: 'comissionPayer',
        render: (comissionPayer, record, index) => (
          <VzTable.Cell.TextOverflow>{CONTOUR_COMMISSION_PAYER.map(el => el.id === comissionPayer)?.title}</VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: 'Автом. присоединение',
        width: 200,
        dataIndex: 'contractorAutoJoin',
        key: 'contractorAutoJoin',
        render: (contractorAutoJoin, record, index) => {
          return (contractorAutoJoin && 'Да') || 'Нет';
        },
      },
      {
        title: 'Включ. пров. документов',
        width: 200,
        dataIndex: 'allowDocAccept',
        key: 'allowDocAccept',
        render: (allowDocAccept, record, index) => {
          return (allowDocAccept && 'Да') || 'Нет';
        },
      },
      {
        title: 'Включены реестры',
        width: 200,
        dataIndex: 'allowRegistries',
        key: 'allowRegistries',
        render: (allowRegistries, record, index) => {
          return (allowRegistries && 'Да') || 'Нет';
        },
      },
      {
        title: 'Включены акты',
        dataIndex: 'allowActs',
        key: 'allowActs',
        render: (allowActs, record, index) => {
          return (allowActs && 'Да') || 'Нет';
        },
      },
    ],
    [],
  );
}

export default useColumns;
