import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

function useFiltersActions({ dictionaries }) {
  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['startDateSince', 'startDateTill'],
        type: 'dateRange',
        position: 'topLeft',
        label: 'Дата создания',
        config: {
          id: 'documents-flow-maindate'
        }
      },
      {
        key: 'orderNr',
        type: 'input',
        label: 'Номер рейса',
        config: {
          fieldProps: {
            placeholder: 'Номер рейса',
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'createdAt',
        name: 'createdAt',
        type: 'date',
        label: 'Дата создания',
        config: {
          label: 'Дата создания',
          useSetter: false,
        },
      },

      {
        key: 'documentType',
        type: 'select',
        config: {
          label: 'Тип',
          fieldProps: {
            placeholder: 'Тип',
            style: {
              width: 100,
            },
          },
          data: dictionaries.documentsTypes.map(({ id, title }) => ({
            label: title,
            value: id,
          })),
        },
      },

      {
        key: 'state',
        type: 'select',
        config: {
          label: 'Статус',
          fieldProps: {
            placeholder: 'Статус',
            style: {
              width: 100,
            },
          },
          data: dictionaries.documentsStates.map(({ id, title }) => ({
            label: title,
            value: id,
          })),
        },
      },

      //Actions
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
              // {
              //   icon: 'excelOrange',
              //   onAction: () => {
              //     setUseExport(true);
              //   },
              //   title: t.buttons('toExcel'),
              // },
            ],
          },
        },
      },
    ],
    [dictionaries?.vehicleTypes, dictionaries?.orderTypes],
  );
}

export default useFiltersActions;
