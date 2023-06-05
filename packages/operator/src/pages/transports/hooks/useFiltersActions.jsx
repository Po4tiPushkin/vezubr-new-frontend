import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';

function useFiltersActions({ dictionaries, setUseExport }) {
  return useMemo(
    () => [
      {
        key: 'filterVehicleId',
        type: 'input',
        label: t.registries('ID'),
        config: {
          fieldProps: {
            placeholder: t.registries('ID'),
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'filterProducerCompany',
        type: 'input',
        label: t.loader('filter.producer'),
        config: {
          label: t.loader('filter.producer'),
          fieldProps: {
            style: {
              width: 200,
            },
          },
        },
      },
      {
        key: 'filterVehicleTypeIds',
        type: 'select',
        label: t.order('vehicleType'),
        config: {
          label: t.order('vehicleType'),
          fieldProps: {
            placeholder: t.clients('filter.all'),
            style: {
              width: 200,
            },
          },
          data: Object.keys(dictionaries?.vehicleTypes).map((key) => ({
            label: dictionaries?.vehicleTypes[key],
            value: key,
          })),
        },
      },

      {
        key: 'filterPlateNumber',
        type: 'input',
        label: t.order('filters.plateNumber.title'),
        config: {
          label: t.order('filters.plateNumber.title'),
          fieldProps: {
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'filterUiStatus',
        type: 'select',
        label: t.transports('uiStatus'),
        getValue: (v) => v && v.split(',').map((item) => ~~item),
        config: {
          label: t.transports('uiStatus'),
          fieldProps: {
            placeholder: t.transports('Все'),
            style: {
              width: 300,
            },
          },
          data: dictionaries?.unitUiStates.map(({ title, id }) => ({
            label: title,
            value: id,
          })),
        },
      },

      {
        key: 'filterDriverSurname',
        type: 'input',
        label: t.transports('fio'),
        config: {
          label: t.transports('fio'),
          fieldProps: {
            style: {
              width: 200,
            },
          },
        },
      },

      {
        key: 'scoringStatus',
        type: 'select',
        label: 'Скоринг статус',
        extra: true,
        config: {
          label: 'Скоринг статус',
          fieldProps: {
            placeholder: t.transports('Все'),
            style: {
              width: 200,
            },
          },
          data: Object.keys(dictionaries?.scoringStatuses).map((key) => ({
            label: dictionaries?.scoringStatuses[key],
            value: key,
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
                onAction: () => void 0,
                title: 'Столбцы',
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
    [dictionaries?.unitUiStates, dictionaries?.scoringStatuses, dictionaries?.vehicleTypes],
  );
}

export default useFiltersActions;
