import { useContext } from 'react';
import { useMemo } from 'react';
import { Ant } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { OrderCargoPlacesContext } from '../../../context';
import { TreeSelect } from '@vezubr/elements/antd';

function useFiltersActions({}) {
  const { cargoPlacesResolve, cargoPlacesClearAll, cargoPlaceStatuses } = useContext(OrderCargoPlacesContext);

  const dataSelectionStatuses = useMemo(
    () =>
      cargoPlaceStatuses.map(({ id }) => ({
        title: t.order(`cargoPlaceStatuses.${id}`),
        value: id,
      })),
    [cargoPlaceStatuses],
  );

  return useMemo(
    () => [
      {
        key: 'mainDate',
        name: ['createdAtFrom', 'createdAtTill'],
        type: 'dateRange',
        position: 'topLeft',
      },

      {
        key: 'id',
        type: 'input',
        label: 'ID грузоместа',
        config: {
          fieldProps: {
            placeholder: 'ID грузоместа',
            style: {
              width: 160,
            },
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
              width: 160,
            },
          },
        },
      },

      {
        key: 'statusAddress',
        type: 'input',
        label: 'Адрес к статусу',
        config: {
          fieldProps: {
            placeholder: 'Адрес к статусу',
            style: {
              width: 160,
            },
          },
        },
      },

      {
        key: 'status',
        type: 'selectTree',
        label: 'Статус',
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
          data: dataSelectionStatuses,
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
              width: 160,
            },
          },
        },
      },

      {
        key: 'barCode',
        type: 'input',
        label: 'Bar Code',
        config: {
          fieldProps: {
            placeholder: 'Bar Code',
            style: {
              width: 160,
            },
          },
        },
      },

      {
        key: 'deliveryId',
        type: 'input',
        label: 'ID адреса доставки',
        config: {
          fieldProps: {
            placeholder: 'ID адреса доставки',
            style: {
              width: 200,
            },
          },
        },
      },

      {
        key: 'externalId',
        type: 'input',
        label: 'ID адреса доставки Партнёра',
        config: {
          fieldProps: {
            placeholder: 'ID адреса доставки Партнёра',
            style: {
              width: 200,
            },
          },
        },
      },

      {
        key: 'pinned',
        type: 'select',
        label: 'Прикрепленные ГМ',
        config: {
          fieldProps: {
            placeholder: 'Все ГМ',
            style: {
              width: 100,
            },
          },
          data: [
            {
              label: 'Прикрепленные ГМ',
              value: '1',
            },
            {
              label: 'Не прикрепленные ГМ',
              value: '2',
            },
          ],
        },
      },

      //Actions
      {
        key: 'cargoPlaceResolve',
        type: 'custom',
        position: 'topRight',
        component: Ant.Button,
        config: {
          style: { marginTop: 3 },
          icon: 'plus',
          type: 'primary',
          children: 'Автоприкрепление ГМ',
          onClick: () => {
            cargoPlacesResolve();
          },
        },
      },
      {
        key: 'cargoPlaceClear',
        type: 'custom',
        position: 'topRight',
        component: Ant.Button,
        config: {
          style: { marginTop: 3 },
          type: 'dashed',
          icon: 'delete',
          children: 'Сбросить ГМ',
          onClick: () => {
            cargoPlacesClearAll();
          },
        },
      },
    ],
    [cargoPlacesResolve, cargoPlacesClearAll, dataSelectionStatuses],
  );
}

export default useFiltersActions;
