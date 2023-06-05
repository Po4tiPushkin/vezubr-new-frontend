import { VzTable } from '@vezubr/elements';
import React, { useMemo } from 'react';

function useColumns(dictionaries) {
  const columns = useMemo(
    () => [
      {
        title: 'Тип грузоперевозки',
        dataIndex: 'category',
        width: 100,
        key: 'category',
        render: (value) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.vehicleTypeCategories?.find(item => item.id == value)?.title}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Название типа ТС',
        dataIndex: 'name',
        width: 200,
        key: 'name',
        render: (value) => (
          <VzTable.Cell.TextOverflow>{value}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Доступные типы Кузова',
        dataIndex: 'availableBodyTypes',
        width: 200,
        key: 'availableBodyTypes',
        render: (value) => {
          if (!value) {
            return ''
          }
          return Object.keys(value).map(el => dictionaries.vehicleBodies.find(item => item.id === +el)?.title).join(', ')
        }
      }
    ],
    [dictionaries?.vehicleTypeCategories],
  );

  return columns;
}

export default useColumns;
