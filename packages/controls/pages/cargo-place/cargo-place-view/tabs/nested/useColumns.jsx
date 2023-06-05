import React, { useContext, useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import { CargoContextView } from '../../context';

function useColumns({ dictionaries }) {
    const { store } = useContext(CargoContextView);
    const { data } = store;

    const columns = useMemo(
      () => [
        {
          title: 'ID ГМ',
          width: 150,
          dataIndex: 'id',
          key: 'id',
          render: (id) => 
              <VzTable.Cell.TextOverflow>{id}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Тип',
        width: 150,
        dataIndex: 'type',
        key: 'type',
        render: (type) => 
            <VzTable.Cell.TextOverflow>{dictionaries?.cargoPlaceTypes?.find(el => el.id === type)?.title}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'ID Партнера',
        dataIndex: 'externalId',
        key: 'externalId',
        width: 150,
        render: (externalId) =>
            <VzTable.Cell.TextOverflow>{externalId}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Баркод родительского ГМ',
        dataIndex: 'parentBarCode',
        key: 'parentBarCode',
        width: 150,
        render: (parentBarCode) =>
            <VzTable.Cell.TextOverflow>{parentBarCode}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Название',
        dataIndex: 'title',
        key: 'title',
        width: 150,
        render: (title) =>
            <VzTable.Cell.TextOverflow>{title}</VzTable.Cell.TextOverflow>,
      },
      {
          title: 'Адрес отправления',
          dataIndex: 'departureAddress',
          key: 'departureAddress',
          width: 200,
          render: (departureAddress) => 
              <VzTable.Cell.TextOverflow>{departureAddress}</VzTable.Cell.TextOverflow>,
      },

      {
          title: 'Адрес доставки',
          dataIndex: 'deliveryAddress',
          key: 'deliveryAddress',
          width: 200,
          render: (deliveryAddress) => 
              <VzTable.Cell.TextOverflow>{deliveryAddress}</VzTable.Cell.TextOverflow>,
      },
      

      ], [dictionaries]
    );
  
    return VzTable.useColumnsCalcWidth(columns);
  }
  
  export default useColumns;