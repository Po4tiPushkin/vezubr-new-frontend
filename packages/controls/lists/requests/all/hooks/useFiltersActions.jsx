import t from '@vezubr/common/localization';
import { useMemo } from 'react';
import { observer, OBSERVER_ACTIONS } from '../../../../infrastructure';

function useFiltersActions({
  dictionaries,
  setUseExport,
  pushParams,
  setCanRefreshFilters,
  employees,
  groups
}) {

  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['toStartAtDateFrom', 'toStartAtDateTill'],
        type: 'dateRange',
        position: 'topLeft',
        label: 'Дата подачи',
      },

      {
        key: 'status',
        type: 'select',
        label: 'Статус заявки',
        config: {
          label: 'Статус заявки',
          fieldProps: {
            mode: 'single',
            maxTagCount: 1,
            placeholder: t.transports('Все'),
            style: {
              width: 300,
            },
          },
          data: dictionaries?.requestListStatuses.filter(el => ['closed', 'canceled', 'declined'].includes(el.id))
            .map(({ id, title }) => (
              {
                label: title,
                value: id,
              })),
        },
      },
      ...[
        APP !== 'client'
          ?
          {
            key: 'implementerEmployeeId',
            type: 'select',
            label: 'В работе у',
            extra: true,
            config: {
              label: 'В работе у',
              fieldProps: {
                showSearch: true,
                placeholder: 'В работе у',
                optionFilterProp: 'title',
              },
              data: _.sortBy(employees, 'fullName').map(({ id, fullName }) => ({
                label: fullName,
                title: fullName,
                value: id.toString(),
              })),
            },
          }
          :
          {}
      ],
      ...[
        APP === 'dispatcher'
          ?
          {
            key: 'requestGroupId',
            type: 'select',
            label: 'Группа',
            config: {
              label: 'Группа',
              fieldProps: {
                showSearch: true,
                placeholder: 'Группа',
                optionFilterProp: 'title',
              },
              data: _.sortBy(groups, 'title').map(({ id, title }) => ({
                label: title,
                title,
                value: id.toString(),
              })),
            },
          }
          :
          {}
      ],
      {
        key: 'publishedAt',
        name: ['publishedAtDateFrom', 'publishedAtDateTill'],
        type: 'dateRange',
        label: 'Дата публикации',
        config: {
          label: 'Дата публикации',
          useSetter: false,
        },
      },

      //Actions
      {
        key: 'filterButtonExtra',
        type: 'filterButtonExtra',
        position: 'topRight',
      },
      {
        key: 'filtersApply',
        type: 'filtersApply',
        position: 'topRight',
        filterSetName: 'orders',
        pushParams,
        setCanRefreshFilters,
      },
      {
        key: 'filterButtonContext',
        type: 'buttonContext',
        position: 'topRight',
        config: {
          menuOptions: {
            list: [
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
                },
                title: 'Изменить отображение колонок',
              },
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_EXPORTING_CONFIG_TABLE);
                },
                title: 'Настроить экспорт',
                id: 'orders-settings',
              },
              // {
              //   icon: 'printOrange',
              //   onAction: () => void 0,
              //   title: 'Распечатать',
              // },
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
    [employees, groups, setUseExport],
  );
}

export default useFiltersActions;
