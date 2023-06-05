import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import MultiSelectFields from '../../fields';
function useColumns({ currentField, onChangeValue }) {
  const columns = useMemo(
    () =>
      [
        {
          title: t.order('table.number'),
          width: 75,
          dataIndex: 'id',
          key: 'id',
          sorter: true,
          render: (id) => {
            return <>{id}</>;
          },
        },
        {
          title: 'Предыдущее значение',
          width: 100,
          dataIndex: `${currentField?.value}`,
          key: `${currentField?.value}`,
          render: (value, record) => {
            return (
              <> {currentField?.value ?
                currentField?.type === 'select'
                  ?
                  currentField.values.find(el => value === el.listValue)?.title
                  :
                  String((value || ''))
                :
                ''
              }
              </>
            )
          }
        },
        {
          title: 'Новое значение',
          width: 100,
          dataIndex: 'newValue',
          key: 'newValue',
          render: (value, record) => (
            <MultiSelectFields onChangeValue={onChangeValue} value={value} id={record.id} currentField={currentField} />
          )
        }

      ],
    [currentField],
  );
  return columns
}

export default useColumns;
