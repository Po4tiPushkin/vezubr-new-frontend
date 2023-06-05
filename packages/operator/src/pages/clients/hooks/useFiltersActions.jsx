import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import useOnceLoadData from '@vezubr/common/hooks/useOnceLoadData';
import { Contour as ContourService } from '@vezubr/services/index.operator';
import { Empty, Spin } from '@vezubr/elements/antd';

function useFiltersActions({ dictionaries }) {

  const [dataContoursOptions, dataContoursLoading] = useOnceLoadData(async () => {
    const response = await ContourService.list();
    return (response?.data?.contours || []).map((contor) => ({
      label: contor.title,
      value: contor.id,
    }));
  });

  return useMemo(
    () => [
      {
        key: 'filterId',
        type: 'input',
        label: t.clients('filter.id'),
        config: {
          fieldProps: {
            placeholder: t.clients('filter.id'),
            style: {
              width: 140,
            },
          },
        },
      },
      {
        key: 'filterName',
        type: 'input',
        label: t.clients('filter.filterName'),
        config: {
          label: t.clients('filter.filterName'),
          fieldProps: {
            placeholder: t.clients('filter.all'),
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'filterStates',
        type: 'select',
        label: t.transports('uiStatus'),
        config: {
          label: t.transports('uiStatus'),
          fieldProps: {
            placeholder: t.clients('filter.all'),
            style: {
              width: 300,
            },
          },
          data: Object.keys(dictionaries?.contractorStates)?.map((key) => ({
            label: dictionaries?.contractorStates[key],
            value: key,
          })),
        },
      },

      {
        key: 'filterMinBalance',
        type: 'input',
        label: t.clients('filter.filterMinBalance'),
        config: {
          label: t.clients('filter.filterMinBalance'),
          fieldProps: {
            placeholder: '>= 0',
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'filterInn',
        type: 'input',
        label: t.clients('filter.filterInn'),
        config: {
          label: t.clients('filter.filterInn'),
          fieldProps: {
            style: {
              width: 140,
            },
          },
        },
      },

      {
        key: 'filterContourId',
        type: 'select',
        label: t.clients('Контур'),
        getValue: (val) => val && parseInt(val, 10),
        config: {
          label: t.clients('Контур'),
          fieldProps: {
            placeholder: t.clients('filter.all'),
            showSearch: true,
            optionFilterProp: 'children',
            loading: dataContoursLoading,
            notFoundContent: dataContoursLoading ? <Spin size="small" /> : <Empty />,
            style: {
              width: 300,
            },
          },
          data: dataContoursOptions,
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
            placeholder: t.clients('filter.all'),
            style: {
              width: 200,
            },
          },
          data: Object.keys(dictionaries?.scoringStatuses)?.map((key) => ({
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
            ],
          },
        },
      },
    ],
    [
      dictionaries?.contractorStates,
      dictionaries?.scoringStatuses,
      dataContoursLoading,
      dataContoursOptions,
    ],
  );
}

export default useFiltersActions;
