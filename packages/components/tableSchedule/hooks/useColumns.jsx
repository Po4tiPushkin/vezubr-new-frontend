import LinkWithBack from '../../link/linkWithBack';
import { VzTable } from '@vezubr/elements';
import React, { useMemo } from 'react';
import { SCHEDULE_ENTITIES } from '@vezubr/common/constants/constants';

function useColumns({ dictionaries, entity }) {
  const columns = useMemo(
    () => [
      {
        title: entity == SCHEDULE_ENTITIES.drivers ? 'ФИО' : 'Гос. Номер',
        width: 200,
        dataIndex: entity == SCHEDULE_ENTITIES.drivers ? 'fullName' : 'plateNumber',
        key: 'name',
        fixed: 'left',
        render: (name, record) => {
          return (
            <VzTable.Cell.TextOverflow>
              {entity == SCHEDULE_ENTITIES.drivers ? (
                <LinkWithBack to={{ pathname: `/drivers/${record.id}` }}>{`${record.surname || ''} ${name || ''} ${record.patronymic || ''}`}</LinkWithBack>
              ) : (
                <LinkWithBack to={{ pathname: `/${record.vehicleClass}s/${record.id}` }}>{`${record.vehicleClass == 'transport' ? 'ТС' : record.vehicleClass == 'tractor' ? 'Тягач' : 'Прицеп'}  ${record.plateNumber || ''}`}</LinkWithBack>
              )}
            </VzTable.Cell.TextOverflow>
          )
        },
      },
    ],
    [dictionaries, entity],
  );

  return columns;
}

export default useColumns;
