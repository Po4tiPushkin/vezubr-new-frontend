import React from 'react';
import { useSelector } from 'react-redux';
import { VzTable } from '@vezubr/elements';

export default function useCustomPropsColumns(entity) {
  const customProps = useSelector((state) => state.customProperties);

  return React.useMemo(() => {
    if (customProps) {
      return customProps
        ?.filter(({ entityName }) =>
          entity == 'order' ? [entity, 'order_sharing', 'client'].includes(entityName) : entityName == entity,
        )
        ?.map(({ type, latinName, cyrillicName, possibleValues, entityName }) => {
          return {
            title: cyrillicName,
            dataIndex:
              entityName == 'order_sharing'
                ? 'sharingCustomProperties.' + latinName
                : entityName == 'client' && entity == 'order'
                ? 'clientCustomProperties.' + latinName
                : 'customProperties.' + latinName,
            key: latinName,
            width: 150,
            render: (value) => {
              return (
                <VzTable.Cell.TextOverflow>
                  {(type == 'multiple' ? possibleValues?.find(({ id }) => id == value)?.title : value) || '-'}
                </VzTable.Cell.TextOverflow>
              );
            },
          };
        });
    } else {
      return [];
    }
  }, [entity, customProps]);
}
