import { ORDER_CATEGORIES_GROUPPED } from '@vezubr/common/constants/constants';
import React, { useMemo } from 'react';
function useFiltersActions({ onSave, selectedVehicleTypes, onCancel, edited, filtersVisible, vehicleBodies = [] }) {
  return useMemo(
    () => [
      ...[
        filtersVisible
          ? {
            key: 'category',
            type: 'selectTree',
            label: 'Тип автоперевозки',
            getValue: (val) => val,
            config: {
              label: 'Тип автоперевозки',
              fieldProps: {
                placeholder: 'Тип автоперевозки',
                allowClear: true,
                dropdownStyle: {
                  maxHeight: 300,
                },
                style: {
                  width: 200,
                },
              },
              data: ORDER_CATEGORIES_GROUPPED,
            },
          }
          : {},
      ],
      ...[
        filtersVisible
          ? {
            key: 'liftingCapacityMin',
            type: 'input',
            label: 'Грузоподъемность, т',
            config: {
              label: 'Грузоподъемность, т',
              fieldProps: {
                placeholder: 'Грузоподъемность',
                style: {
                  width: 200,
                },
              },
            },
          }
          : {},
      ],
      ...[
        filtersVisible
          ?
          {
            key: 'bodyTypes',
            type: 'select',
            label: 'Тип кузова',
            config: {
              label: 'Тип кузова',
              fieldProps: {
                mode: 'multiple',
                placeholder: 'Все',
                style: {
                  width: 600,
                },
              },
              data: vehicleBodies?.map(({ id, title }) => ({
                label: title,
                value: id,
              })),
            },
          }
          :
          {}
      ],
      //Actions
      {
        key: 'cancel',
        type: 'button',
        position: 'topRight',
        config: {
          className: `rounded box-shadow ${!edited ? 'disabled' : ''}`,
          content: <p className="no-margin">Отменить</p>,
          withMenu: false,
          onClick: () => {
            onCancel();
          },
        },
      },
      {
        key: 'addValue',
        type: 'button',
        position: 'topRight',
        config: {
          className: `rounded box-shadow primary ${!edited ? 'disabled' : ''}`,
          content: <p className="no-margin">Сохранить</p>,
          withMenu: false,
          onClick: () => {
            onSave(selectedVehicleTypes);
          },
        },
      },
    ],
    [selectedVehicleTypes, edited, filtersVisible],
  );
}

export default useFiltersActions;
