import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { ROLES } from '@vezubr/common/constants/constants';

function useFiltersActions({ setShowModal }) {
  return useMemo(() => [
    {
      key: 'role',
      type: 'select',
      label: 'Роль',
      config: {
        label: 'Роль',
        fieldProps: {
          mode: 'single',
          maxTagCount: 1,
          placeholder: 'Роль',
          style: {
            width: 300,
          },
        },
        data: Object.keys(ROLES).map((key) => ({
          label: ROLES[key],
          value: key,
        })),
      },
    },
    {
      key: 'addCounterparty',
      type: 'button',
      position: 'topRight',
      config: {
        icon: 'plusWhite',
        className: 'rounded box-shadow primary',
        content: <p className="no-margin">Назначить ответсвенным</p>,
        withMenu: false,
        onClick: () => {
          setShowModal('assign')
        },
      },
    },
  ], [setShowModal]);
}

export default useFiltersActions;