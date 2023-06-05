import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
function useFiltersActions({ setShowModal }) {

  return useMemo(
    () => [
      //Actions
      {
        key: 'addValue',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'plusWhite',
          className: 'rounded box-shadow primary',
          content: <p className="no-margin">Добавить новое значение</p>,
          withMenu: false,
          onClick: () => {
            setShowModal(true)
          },
        },
      },
    ],
    [],
  );
}

export default useFiltersActions;
