import { ORDER_CATEGORIES_GROUPPED } from '@vezubr/common/constants/constants';
import React, { useMemo } from 'react';

const AGREEMENT_ACTIVE_OPTIONS = [
  {
    title: 'Все',
    id: 'all'
  },
  {
    title: 'Активные',
    id: 'active'
  },
  {
    title: 'Удаленные',
    id: 'deleted'
  }
]

function useFiltersActions({ onAddAgreement, editable}) {
  return useMemo(
    () => [
      {
        key: 'active',
        type: 'select',
        config: {
          fieldProps: {
            allowClear: true,
            style: {
              width: 120,
            },
          },
          data: AGREEMENT_ACTIVE_OPTIONS.map(el => ({ key: el.id, value: el.id, label: el.title })),
        },
      },
      {
        key: 'addValue',
        type: 'button',
        position: 'topRight',
        config: {
          className: `rounded box-shadow primary ${!editable ? 'disabled' : ''}`,
          content: <p className="no-margin">Добавить ДУ</p>,
          withMenu: false,
          onClick: onAddAgreement,
        },
      },
    ],
    [onAddAgreement, editable],
  );
}

export default useFiltersActions;
