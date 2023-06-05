import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { TreeSelect } from '@vezubr/elements/antd';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

function useFiltersActions({
  dictionaries,
  setUseExport,
  history,
  selectedRows,
  cargoRegions,
  pushParams,
  setCanRefreshFilters,
  setMultiSelect,
  multiSelect,
}) {
  const cargoPlaceStatusesOptions = useMemo(
    () =>
      dictionaries?.cargoPlaceStatuses?.map((item) => ({
        title: t.order(`cargoPlaceStatuses.${item.id}`),
        value: item.id,
        key: item.title,
      })),
    [dictionaries?.cargoPlaceStatuses],
  );

  const cargoPlaceTypesOptions = useMemo(
    () => dictionaries?.cargoPlaceTypes.map(item => {
      return {
        title: item.title,
        label: item.title,
        value: item.id,
        key: item.id,
      }
    })
    , [dictionaries?.cargoPlaceTypes])

  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['creationDateFrom', 'creationDateTo'],
        type: 'dateRange',
        position: 'topLeft',
        label: 'Дата создания',
        config: {
          id: 'cargoplaces-maindate'
        }
      },
      //Actions
      {
        key: 'addСargoPlace',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'plusWhite',
          className: 'rounded box-shadow primary',
          content: <p className="no-margin">Добавить ГМ</p>,
          withMenu: false,
          id: 'cargoplaces-add',
          onClick: () => {
            history.push('/cargoPlaces/add');
          },
        },
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
        key: 'externalId',
        type: 'input',
        label: 'ID ГМ партнера',
        config: {
          fieldProps: {
            placeholder: 'ID ГМ партнера',
            style: {
              width: 200,
            },
            id: 'cargoplaces-externalid'
          },
        },
      },
      {
        key: 'type',
        type: 'select',
        label: 'Тип',
        config: {
          fieldProps: {
            showSearch: true,
            placeholder: 'Тип',
            optionFilterProp: 'title',
          },
          data: cargoPlaceTypesOptions,
        },
      },
      {
        key: 'departureAddress',
        type: 'input',
        label: 'Адрес отправления',
        config: {
          fieldProps: {
            placeholder: 'Адрес отправления',
            style: {
              width: 180,
            },
            id: 'cargoplaces-departureaddress'
          },
        },
      },
      {
        key: 'deliveryAddress',
        type: 'input',
        label: 'Адрес доставки',
        config: {
          fieldProps: {
            placeholder: 'Адрес доставки',
            style: {
              width: 180,
            },
            id: 'cargoplaces-deliveryaddress'
          },
        },
      },
      {
        key: 'invoiceNumber',
        type: 'input',
        label: 'Номер накладной',
        config: {
          fieldProps: {
            placeholder: 'Номер накладной',
            style: {
              width: 180,
            },
            id: 'cargoplaces-invoicenumber'
          },
        },
      },
      {
        key: 'barCode',
        type: 'input',
        label: 'Bar code',
        config: {
          fieldProps: {
            placeholder: 'Bar code',
            style: {
              width: 180,
            },
            id: 'cargoplaces-barcode-filter'
          },
        },
      },
      {
        key: 'status',
        type: 'selectTree',
        label: 'Статус',
        getValue: (val) => val && val.split(','),
        config: {
          fieldProps: {
            placeholder: 'Статус',
            allowClear: true,
            treeCheckable: true,
            treeNodeFilterProp: 'title',
            maxTagCount: 0,
            showCheckedStrategy: TreeSelect.SHOW_PARENT,
            searchPlaceholder: 'Выберите статус',
            dropdownStyle: {
              maxHeight: 300,
            },
            style: {
              width: 100,
            },
          },
          data: cargoPlaceStatusesOptions,
        },
      },
      {
        key: 'departureRegionId',
        type: 'select',
        label: 'Регион отправления',
        config: {
          fieldProps: {
            placeholder: 'Регион отправления',
            style: {
              width: 180,
            },
          },
          data: cargoRegions.map(({ id, title }) => ({
            label: title,
            value: id.toString(),
          })),
        },
      },
      {
        key: 'deliveryRegionId',
        type: 'select',
        label: 'Регион доставки',
        config: {
          fieldProps: {
            placeholder: 'Регион доставки',
            style: {
              width: 180,
            },
          },
          data: cargoRegions.map(({ id, title }) => ({
            label: title,
            value: id.toString(),
          })),
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
        filterSetName: 'cargoPlace',
        id: 'cargoplaces-filtersapply',
        pushParams,
        setCanRefreshFilters,
      },
      {
        key: 'filterButtonContext',
        type: 'buttonContext',
        position: 'topRight',
        config: {
          id: 'cargoplaces-menu',
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
                icon: 'checkOrange',
                title: !multiSelect ? 'Мультивыбор ГМ' : 'Обычный режим ГМ',
                id: 'cargoplaces-multiselect',
                onAction: () => {
                  setMultiSelect(!multiSelect);
                },
              },
              // {
              //   icon: 'arbeitenOrange',
              //   onAction: () => {
              //     // TODO need api
              //   },
              //   title: 'Импорт грузоместа',
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
    [cargoPlaceStatusesOptions, selectedRows, cargoRegions, multiSelect],
  );
}

export default useFiltersActions;
