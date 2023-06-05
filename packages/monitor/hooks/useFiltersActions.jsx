import { useMemo } from 'react';

function useFiltersActions(userName, filterConfig) {
  return useMemo(() => {
    const result = [
      {
        key: 'mainDate',
        name: ['toStartAtDateFrom', 'toStartAtDateTill'],
        type: 'dateRange',
        position: 'topLeft',
        config: {
          formatParser: 'YYYY-MM-DD HH:mm:ss',
          requiredOptions: ['1', '4', '8', '0'],
          setterProps:{
            style: {
              width: 160,
            }
          },
          pickerProps:{
            style: {
              minWidth: 225,
            }
          },
        }
      },
      {
        key: 'isTaken',
        name: 'isTaken',
        type: 'select',
        position: 'topLeft',
        config: {
          title: 'Назначение ТС',
          fieldProps: {
            placeholder: 'Назначение ТС',
            allowClear: true,
            style: {
              width: 130,
            },
          },
          data: [
            {
              label: 'Не приняты',
              value: false,
            },
            {
              label: 'ТС не назначено',
              value: true
            }
          ],
        },
      }
    ]

    if (!result.find(item => item.name == 'isResponsible' || item.name == 'isResponsibleToOrder')) {
      result.push(
        {
          key: filterConfig == 1 ? 'isResponsible' : 'isResponsibleToOrder',
          name: filterConfig == 1 ? 'isResponsible' : 'isResponsibleToOrder',
          type: 'select',
          position: 'topLeft',
          config: {
            title: 'Ответственный пользователь',
            fieldProps: {
              placeholder: 'Ответственный',
              allowClear: true,
              style: {
                width: 130,
              },
            },
            data: [
              {
                label: 'Не ответственный',
                value: false,
              },
              {
                label: userName || 'Текущий пользователь',
                value: true
              }
            ],
          },
        }
      )
    }

    return result
  }, [userName, filterConfig])
}

export default useFiltersActions;
