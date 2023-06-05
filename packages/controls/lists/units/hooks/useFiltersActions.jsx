import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
function useFiltersActions({ setShowModal }) {

  return useMemo(
    () => [
      {
        key: 'filterTitle',
        type: 'input',
        label: 'Название подразделения',
        config: {
          label: 'Название подразделения',
          fieldProps: {
            placeholder: 'Название подразделения',
            style: {
              width: 340,
            },
          },
        },
      },

      //Actions
      ...[
        IS_ADMIN
          ?
          {
            key: 'addValue',
            type: 'button',
            position: 'topRight',
            config: {
              icon: 'plusWhite',
              className: 'rounded box-shadow primary',
              content: <p className="no-margin">Добавить подразделение</p>,
              withMenu: false,
              onClick: () => {
                setShowModal(true)
              },
            },
          }
          :
          {}
      ],
    ],
    [],
  );
}

export default useFiltersActions;
