import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { ORDERS_STAGES_FILTERS } from '../data/constants';
import { TreeSelect } from '@vezubr/elements/antd';
import { observer, OBSERVER_ACTIONS } from '../../../infrastructure';

function useFiltersActions({ dictionaries, setUseExport, history }) {

  return useMemo(
    () => [

      {
        key: 'title',
        type: 'input',
        label: 'Название',
        config: {
          fieldProps: {
            placeholder: 'Название шаблона',
            style: {
              width: 140,
            },
            id: 'regular-orders-title'
          },
        },
      },

      {
        key: 'active',
        type: 'select',
        label: 'Статус',
        config: {
          fieldProps: {
            placeholder: 'Статус',
            style: {
              width: 100,
            },
            id: 'regular-orders-status'
          },
          data: [
            {
              label: 'Активный',
              value: 'true'
            },
            {
              label: 'Не активный',
              value: 'false'
            }
          ]
        },
      },

      {
        key: 'orderType',
        type: 'select',
        label: t.order('filters.orderType.title'),
        config: {
          fieldProps: {
            placeholder: 'Тип рейса',
            style: {
              width: 100,
            },
            id: 'regular-orders-ordertype'
          },
          data: dictionaries?.orderTypes?.filter(item => item.id !== 2)?.map(({ id, title }) => ({
            label: title,
            value: id.toString(),
          })),
        },
      },
      {
        key: 'firstAddress',
        type: 'input',
        label: t.order('filters.filterFirstAddress.title'),
        config: {
          // label: t.order('filters.filterFirstAddress.label'),
          fieldProps: {
            placeholder: 'Адрес подачи',
            style: {
              width: 250,
            },
            id: 'regular-orders-firstaddress'
          },
        },
      },
      {
        key: 'lastAddress',
        type: 'input',
        label: t.order('filters.filterLastAddress.title'),
        config: {
          // label: t.order('filters.filterLastAddress.label'),
          fieldProps: {
            placeholder: 'Адрес доставки',
            style: {
              width: 250,
            },
            id: 'regular-orders-lastaddress'
          },
        },
      },

      {
        key: 'addOrder',
        type: 'button',
        position: 'topRight',
        config: {
          icon: 'plusWhite',
          className: 'rounded box-shadow primary',
          content: <p className="no-margin">Добавить шаблон</p>,
          withMenu: false,
          id: 'regular-orders-add',
          onClick: () => {
            history.push('/regular-order/new');
          },
        },
      },

      {
        key: 'filterButtonContext',
        type: 'buttonContext',
        position: 'topRight',
        config: {
          id: 'regular-orders-menu',
          menuOptions: {
            list: [
              {
                icon: 'settingsOrange',
                onAction: () => {
                  observer.emit(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE);
                },
                title: 'Изменить отображение колонок',
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
    [dictionaries?.vehicleBodies, dictionaries?.orderTypes],
  );
}

export default useFiltersActions;
