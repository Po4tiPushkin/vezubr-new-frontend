import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

function useFiltersActions({
  dictionaries,
  setUseExport,
  history,
  cargoRegions,
  pushParams,
  setCanRefreshFilters,
  multiSelect,
  setMultiSelect
}) {

  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['toStartAtDateFrom', 'toStartAtDateTill'],
        type: 'dateRange',
        position: 'topLeft',
        label: 'Дата создания',
      },


      //Actions
      {
        key: 'addTariff',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'plusWhite',
          className: `rounded box-shadow primary ${APP === 'dispatcher' ? 'disabled' : ''}`,
          content: <p className="no-margin">Добавить адрес</p>,
          disabled: APP === 'dispatcher',
          withMenu: false,
          onClick: () => {
            history.push('/addresses/add');
          },
        },
      },
      {
        key: 'addressString',
        type: 'input',
        label: 'Подтвержденный адрес',
        config: {
          fieldProps: {
            placeholder: 'Подтвержденный адрес',
            style: {
              width: 200,
            },
          },
        },
      },
      {
        key: 'title',
        type: 'input',
        label: 'Название адреса',
        config: {
          fieldProps: {
            placeholder: 'Название адреса',
            style: {
              width: 180,
            },
          },
        },
      },
      {
        key: 'pointOwner',
        type: 'input',
        label: 'Отправитель/Получатель',
        config: {
          fieldProps: {
            placeholder: 'Отправитель/Получатель',
            style: {
              width: 180,
            },
          },
        },
      },
      {
        key: 'status',
        type: 'select',
        label: 'Статус',
        config: {
          fieldProps: {
            placeholder: 'Статус',
            style: {
              width: 100,
            },
          },
          data: [
            {
              label: 'Активный',
              value: 'true',
            },
            {
              label: 'Неактивный',
              value: 'false',
            },
          ],
        },
      },
      {
        key: 'regionId',
        type: 'select',
        label: 'Регион',
        config: {
          fieldProps: {
            placeholder: 'Регион',
            style: {
              width: 200,
            },
          },
          data: cargoRegions.map(({ id, title }) => ({
            label: title,
            value: id.toString(),
          })),
        },
      },
      {
        key: 'verifiedBy',
        type: 'input',
        label: 'Подтвердил',
        config: {
          fieldProps: {
            placeholder: 'Подтвердил',
            style: {
              width: 200,
            },
          },
        },
      },
      {
        key: 'createdBy',
        type: 'input',
        label: 'Создал',
        config: {
          fieldProps: {
            placeholder: 'Создал',
            style: {
              width: 200,
            },
          },
        },
      },
      {
        key: 'externalId',
        type: 'input',
        label: 'ID Адреса Партнёра',
        config: {
          fieldProps: {
            placeholder: 'ID Адреса Партнёра',
            style: {
              width: 200,
            },
          },
        },
      },
      {
        key: 'filterButtonExtra',
        type: 'filterButtonExtra',
        position: 'topRight',
      },
      {
        key: 'filtersApply',
        type: 'filtersApply',
        position: 'topRight',
        filterSetName: 'addresses',
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
                icon: 'arbeitenOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_IMPORT_ADDRESSES);
                },
                title: 'Импорт Адресов',
              },
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
                },
                title: 'Изменить отображение колонок',
              },
              {
                icon: 'checkOrange',
                title: !multiSelect ? 'Мультивыбор Адресов' : 'Обычный режим',
                onAction: () => {
                  setMultiSelect(!multiSelect);
                },
              },
              // {
              //   icon: 'arbeitenOrange',
              //   onAction: () => {
              //     // TODO need api
              //   },
              //   title: 'Импорт адреса',
              // },
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
    [dictionaries?.regions, cargoRegions, multiSelect],
  );
}

export default useFiltersActions;
