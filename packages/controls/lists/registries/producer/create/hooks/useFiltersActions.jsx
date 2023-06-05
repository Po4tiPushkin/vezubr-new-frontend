import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../../../infrastructure';

function useFiltersActions({ dictionaries, selectedRowKeys, loadingAddCartulary, onCreateCartulary, setUseExport, isAdd }) {
  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['toStartDateSince', 'toStartAtDateTill'],
        type: 'dateRange',
        label: 'Дата подачи',
        position: 'topLeft',
      },
      {
        key: 'orderNr',
        type: 'input',
        label: 'Номер рейса',
        config: {
          fieldProps: {
            placeholder: 'Номер рейса',
          },
        },
      },

      {
        key: 'contractNumber',
        type: 'input',
        label: 'Номер договора',
        config: {
          fieldProps: {
            label: 'Договор',
            placeholder: 'Номер договора',
          },
        },
      },
      {
        key: 'orderType',
        type: 'select',
        label: 'Тип рейса',
        config: {
          label: 'Тип',
          data: dictionaries?.orderTypes?.map(({ id, title }) => ({
            label: title,
            value: id.toString(),
          })),
        },
      },
      {
        key: 'clientCompany',
        type: 'input',
        config: {
          label: 'Заказчик',
        },
      },
      ...[
        APP !== 'producer'
          ?
          {
            key: 'producerCompany',
            type: 'input',
            config: {
              label: 'Подрядчик',
            },
          }
          :
          {}
      ],
      //Actions
      ...(!isAdd ? [
        {
          key: 'createCartulary',
          type: 'button',
          disabled: selectedRowKeys.length === 0 || loadingAddCartulary,
          position: 'topRight',
          config: {
            id: 'registry-create-create',
            icon: 'arbeitenBlue',
            className: 'rounded box-shadow',
            content: <p className="no-margin">Сформировать новый реестр</p>,
            withMenu: false,
            onClick: onCreateCartulary,
            loading: loadingAddCartulary,
          },
        },
      ] : []),
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
    [dictionaries?.orderTypes, selectedRowKeys.length === 0, loadingAddCartulary, onCreateCartulary],
  );
}

export default useFiltersActions;
