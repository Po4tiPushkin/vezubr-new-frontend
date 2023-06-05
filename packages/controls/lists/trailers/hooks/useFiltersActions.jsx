import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';
import { ORDER_CATEGORIES_GROUPPED_TRAILER } from '@vezubr/common/constants/constants';

const statuses = [
  {
    value: 'active',
    label: 'Активный'
  },
  {
    value: 'not_active',
    label: 'Неактивный'
  }
]

function useFiltersActions({ dictionaries, setUseExport, history }) {
  return useMemo(
    () => [
      {
        key: 'plateNumber',
        type: 'input',
        label: 'Госномер Полуприцепа',
        config: {
          label: 'Госномер Полуприцепа',
          fieldProps: {
            style: {
              width: 190,
            },
          },
        },
      },
      {
        key: 'categories',
        type: 'selectTree',
        label: t.transports('table.categoryType'),
        config: {
          label: t.transports('table.categoryType'),
          fieldProps: {
            placeholder: 'Тип автоперевозки',
            style: {
              width: 271,
            },
          },
          data: ORDER_CATEGORIES_GROUPPED_TRAILER,
        },
      },
      {
        key: 'status',
        type: 'select',
        label: 'Статус в системе',
        getValue: (v) => v && [v],
        config: {
          label: 'Статус в системе',
          fieldProps: {
            mode: 'single',
            maxTagCount: 1,
            placeholder: t.transports('Все'),
            style: {
              width: 300,
            },
          },
          data: statuses
        },
      },
      {
        key: 'uiState',
        type: 'select',
        label: 'Статус в рейсе',
        config: {
          label: 'Статус в рейсе',
          fieldProps: {
            mode: 'single',
            maxTagCount: 1,
            placeholder: t.transports('Все'),
            style: {
              width: 300,
            },
          },
          data: dictionaries?.vehicleUiState?.map(({ id, title }) => ({
            label: title,
            value: id,
          })),
        },
      },

      //Actions
      {
        key: 'addTractor',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'plusWhite',
          className: 'rounded box-shadow primary',
          content: <p className="no-margin">Создать Полуприцеп</p>,
          withMenu: false,
          onClick: () => {
            history.push('/trailers/create');
          },
        },
      },
      {
        key: 'filterButtonExtra',
        type: 'filterButtonExtra',
        position: 'topRight',
      },
      {
        key: 'filterButtonContext',
        type: 'buttonContext',
        position: 'topRight',
        config: {
          menuOptions: {
            list: [
              {
                icon: 'arbeitenOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_IMPORT_TRAILERS);
                },
                title: 'Импорт Полуприцепов',
              },
              // {
              //   icon: 'printOrange',
              //   onAction: () => void 0,
              //   title: 'Распечатать',
              // },
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
                },
                title: 'Изменить отображение колонок',
              },
              {
                icon: 'excelOrange',
                onAction: () => {
                  setUseExport(true);
                },
                title: t.buttons('toExcel'),
              },
            ],
          },
        },
      },
    ],
    [dictionaries?.vehicleTypes, dictionaries?.orderTypes],
  );
}

export default useFiltersActions;
