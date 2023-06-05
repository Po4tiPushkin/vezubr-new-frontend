import { SCHEDULE_ENTITIES } from '@vezubr/common/constants/constants';
import t from '@vezubr/common/localization';
import { useMemo } from 'react';

const POSSIBLE_PERIODS = [
  {
    key: 0,
    value: 'day',
    label: 'День',
  },
  {
    key: 1,
    value: 'week',
    label: 'Неделя',
  },
  {
    key: 2,
    value: 'month',
    label: 'Месяц',
  },
];

function useFiltersActions({ params, entity, onSelectPeriod }) {
  return useMemo(
    () => [
      {
        key: 'typeOfPeriod',
        type: 'select',
        config: {
          fieldProps: {
            placeholder: 'Тип периода',
            style: {
              width: 140,
            },
            allowClear: false,  
            initialValue: 'day',
            onSelect: (value) => onSelectPeriod(value)
          },
          data: POSSIBLE_PERIODS,
        },
      },
      ...[
        params.typeOfPeriod == 'day'
          ? {
              key: 'startAt',
              name: 'startAt',
              type: 'date',
              config: {
                useSetter: false,
                fieldProps: {
                  allowClear: false,
                }
              },
            }
          : {
              key: 'date',
              name: ['startAt', 'endAt'],
              type: 'dateRange',
              config: {
                useSetter: false,
                fieldProps: {
                  allowClear: false,
                }
              },
            },
      ],
      ...[
        entity == SCHEDULE_ENTITIES.drivers
          ? {
              key: 'name',
              type: 'input',
              config: {
                fieldProps: {
                  placeholder: t.driver('filters.filterName'),
                  style: {
                    width: 140,
                  },
                },
              },
            }
          : {
              key: 'plateNumber',
              type: 'input',
              config: {
                fieldProps: {
                  placeholder: t.transports('filters.plateNumber.placeholder'),
                  style: {
                    width: 140,
                  },
                },
              },
            },
      ],
      ...[
        entity == SCHEDULE_ENTITIES.drivers
          ? {
              key: 'surname',
              type: 'input',
              config: {
                fieldProps: {
                  placeholder: t.driver('filters.filterSurname'),
                  style: {
                    width: 140,
                  },
                },
              },
            }
          : {},
      ],
      ...[
        entity == SCHEDULE_ENTITIES.drivers
          ? {
              key: 'patronymic',
              type: 'input',
              config: {
                fieldProps: {
                  placeholder: t.driver('filters.filterPatronymic'),
                  style: {
                    width: 140,
                  },
                },
              },
            }
          : {},
      ],
    ],
    [params, entity, onSelectPeriod],
  );
}

export default useFiltersActions;
