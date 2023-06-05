import { LinkWithBack } from '@vezubr/components';
import { IconDeprecated, VzTable } from '@vezubr/elements';
import React, { useMemo } from 'react';

function useColumns({ dictionaries, onDeleteGroup }) {
  const columns = useMemo(
    () => {
      let cols = [
        {
          title: '№',
          width: 75,
          dataIndex: 'number',
          key: 'number',
          render: (number, record, index) => (
            <LinkWithBack
              id={`group-${number}`}
              to={{ pathname: `/profile/groups/edit/${record.id}`}}
            >
                {number}
            </LinkWithBack>
          ),
        },
        {
          title: 'Наименование группы',
          dataIndex: 'title',
          key: 'title',
          sorter: true,
          width: 150,
          render: (title, record) => {
            return (
              <LinkWithBack
                id={`group-${title}`}
                to={{ pathname: `/profile/groups/edit/${record.id}`}}
              >
                  {title}
              </LinkWithBack>
            )
          }
        },
        {
          title: 'Тип группы',
          dataIndex: 'groupTypes',
          key: 'groupTypes',
          sorter: true,
          width: 150,
          render: (groupTypes, record) => {
            return groupTypes && groupTypes.map((groupType, index, array) => {
              const groupTypeName = dictionaries?.requestGroupTypes?.find(item => item.id == groupType)?.title || ''
              return (
                <>
                  <VzTable.Cell.TextOverflow key={`${record.id}-${index}`}>{groupTypeName ? groupTypeName : ''}</VzTable.Cell.TextOverflow>
                </>
              )
            })
          }
        },
        {
          title: 'Действия',
          key: 'actions',
          fixed: 'right',
          width: 120,
          render: (text, record, index) => (
            <div className={'actions flexbox'}>
              <div key={'delete-btn'}>
                <div onClick={(e) => onDeleteGroup(record.id)}>
                  <IconDeprecated name={'trashBinBlack'} />
                </div>
              </div>
            </div>
          )
        },
      ]

      dictionaries?.requestGroupTypes?.map(({id, title}) => {
        if (!cols.find(item => item.key == id)) {
          cols.splice(cols.length - 1, 0, {
            title: title,
            dataIndex: `config.${id}`,
            key: `config.${id}`,
            sorter: false,
            width: 150,
            render: (title) => {
              return (
                <VzTable.Cell.TextOverflow>{title}</VzTable.Cell.TextOverflow>
              )
            }
          },)
        }
      })
      return cols
    },
    [dictionaries?.requestGroupTypes],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
