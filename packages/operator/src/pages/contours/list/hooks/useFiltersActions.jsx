import React from 'react';
import t from '@vezubr/common/localization';

function useFiltersActions({ history }) {
  return React.useMemo(
    () => [
      {
        key: 'title',
        type: 'input',
        label: 'Название',
        config: {
          fieldProps: {
            placeholder: 'Название',
            style: {
              width: 140,
            },
          },
        },
      },
      //Actions
      {
        key: 'addAgent',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'plusBlue',
          className: 'rounded box-shadow',
          content: <p className="no-margin">Добавить контур</p>,
          withMenu: false,
          onClick: () => {
            history.push('/contours/add');
          },
        },
      },
      {
        key: 'filterButtonExtra',
        type: 'filterButtonExtra',
        position: 'topRight',
      },
    ],
    [history],
  );
}

export default useFiltersActions;
