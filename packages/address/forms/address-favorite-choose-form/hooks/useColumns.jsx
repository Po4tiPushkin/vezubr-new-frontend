import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';
import AddressFavoriteCell from '../components/address-favorite-cell';

function useColumns(sort) {
  return useMemo(
    () => [
      {
        title: 'Адрес',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
        defaultSortOrder: sort === 'DESC' ? 'descend' : 'ascend' ,
        sortDirections: ['ascend', 'descend', 'ascend'],
        render: (id, record, index) => <AddressFavoriteCell id={id} />,
      },
    ],
    [sort],
  );
}

export default useColumns;
