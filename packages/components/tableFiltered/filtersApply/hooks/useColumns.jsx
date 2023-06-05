import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import ElementEditor from './../editColumns';

export default function useColumns(dataSource, onRemove, onUpdate, onDefault, defaultFilterId) {

  const columns = useMemo( 
    () => [
      {
        title: 'Название фильтра',
        dataIndex: 'name',
        key: 'name',
        render: (name, record, index) => {
          return (
            <ElementEditor
              onRemove={onRemove}
              onUpdate={onUpdate}
              uuid={record.uuid}
              onDefault={onDefault}
              name={name}
              isDefault={defaultFilterId ? defaultFilterId === record.uuid : false}
            />
          );
        },
      },
    ],
    [dataSource, defaultFilterId],
  );

  return VzTable.useColumnsCalcWidth(columns);
}
