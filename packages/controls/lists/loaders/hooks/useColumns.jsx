import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { VzTable } from '@vezubr/elements';
import LinkWithBack from '@vezubr/components/link/linkWithBack';
import moment from 'moment';

function useColumns({ dictionaries }) {
  const columns = useMemo(
    () => [
      {
        title: t.common('indexNumber'),
        width: 100,
        dataIndex: 'number',
        key: 'number',
        sorter: true,
        renderToExport: false,
        render: (number, record) => {
          return <LinkWithBack to={{ pathname: `/loaders/${record.id}` }}>{number}</LinkWithBack>;
        },
      },
      {
        title: t.driver('table.lastName'),
        width: 150,
        dataIndex: 'surname',
        key: 'surname',
        sorter: true,
        render: (surname, record) => <LinkWithBack to={{ pathname: `/loaders/${record.id}` }}>{surname}</LinkWithBack>,
      },
      {
        title: 'Тип специалиста',
        width: 150,
        dataIndex: 'specialities',
        key: 'specialities',
        sorter: true,
        renderToExport: (speciality) => Array.isArray(speciality) ?
          speciality.map(el => dictionaries.loaderSpecialities.find(item => item.id === el)?.title).join(', ')
          :
          speciality,
        render: (speciality) => {
          if (!Array.isArray(speciality)) {
            return ''
          }
          let specialities = ' ';
          speciality.forEach(el => {
            specialities += ` ${dictionaries.loaderSpecialities.find(item => item.id === el)?.title},`
          })
          specialities = specialities.slice(0, -1);
          return <>{specialities}</>;
        },
      },
      {
        title: t.driver('table.name'),
        width: 150,
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        render: (name) => <VzTable.Cell.TextOverflow>{name}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.patronymic'),
        width: 150,
        dataIndex: 'patronymic',
        key: 'patronymic',
        sorter: true,
        render: (patronymic) => <VzTable.Cell.TextOverflow>{patronymic}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.applicationPhone'),
        width: 150,
        dataIndex: 'applicationPhone',
        key: 'applicationPhone',
        sorter: true,
        render: (applicationPhone) => <VzTable.Cell.TextOverflow>{applicationPhone}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.contactPhone'),
        width: 150,
        dataIndex: 'contactPhone',
        key: 'contactPhone',
        sorter: true,
        render: (contactPhone) => <VzTable.Cell.TextOverflow>{contactPhone}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.lastOrderDate'),
        width: 150,
        dataIndex: 'lastOrderDate',
        key: 'lastOrderDate',
        sorter: true,
        render: (lastOrderDate) => <VzTable.Cell.TextOverflow>{lastOrderDate && moment(lastOrderDate).format('DD.MM.YYYY HH:mm') || ''}</VzTable.Cell.TextOverflow>,
      },
      {
        title: t.driver('table.closedOrdersCount'),
        width: 150,
        dataIndex: 'closedOrdersCount',
        key: 'closedOrdersCount',
        sorter: true,
        render: (closedOrdersCount) => (
          <VzTable.Cell.TextOverflow>{closedOrdersCount.toString()}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: t.driver('table.problemOrdersCount'),
        width: 150,
        dataIndex: 'problematicOrdersCount',
        key: 'problematicOrdersCount',
        sorter: true,
        render: (problematicOrdersCount) => (
          <VzTable.Cell.TextOverflow>{problematicOrdersCount || '0'}</VzTable.Cell.TextOverflow>
        ),
      },
    ],
    [dictionaries?.transportOrderStatuses, dictionaries?.vehicleTypes, dictionaries?.unitUiStates],
  );

  return columns;
}

export default useColumns;
