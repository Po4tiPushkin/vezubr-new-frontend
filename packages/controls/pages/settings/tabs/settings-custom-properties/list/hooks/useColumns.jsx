import { IconDeprecated, VzTable } from '@vezubr/elements';
import React, { useMemo } from 'react';
import { TYPES } from '../../constants';
import DeleteAction from '../actions/delete';

function useColumns({ history, reloadCustomProps, dictionaries }) {
  const columns = useMemo(
    () => [
      {
        title: 'Сущность поля',
        dataIndex: 'entityName',
        key: 'entityName',
        render: (entityName) => {
          return (
            <VzTable.Cell.TextOverflow>{entityName ? dictionaries?.customPropertyEntities?.find(({id}) => id == entityName)?.title : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Наименование поля',
        dataIndex: 'cyrillicName',
        key: 'cyrillicName',
        width: 200,
        render: (name) => {
          return (
            <VzTable.Cell.TextOverflow>{name ? name : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Тип поля',
        dataIndex: 'type',
        key: 'type',
        width: 300,
        render: (type) => {
          return (
            <VzTable.Cell.TextOverflow>{type ? TYPES.find(({value}) => value == type)?.title : ''}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Обязательное',
        dataIndex: 'isRequired',
        key: 'isRequired',
        render: (isRequired) => {
          return (
            <VzTable.Cell.TextOverflow>{isRequired ? 'Да' : 'Нет'}</VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Действия',
        key: 'actions',
        fixed: 'right',
        render: (text, record, index) => (
          <div className={'actions flexbox'}>
            <div onClick={() => history.push(`/settings/custom-props/edit/${record.id}`)}>
              <IconDeprecated name={'editBlack'} />
            </div>
            <DeleteAction id={record.id} reloadCustomProps={reloadCustomProps} />
          </div>
        )
      },
    ],
    [],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
