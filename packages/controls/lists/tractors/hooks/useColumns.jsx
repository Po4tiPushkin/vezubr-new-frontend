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
          return <LinkWithBack to={{ pathname: `/tractors/${record.id}` }}>{number}</LinkWithBack>;
        },
      },
  
      {
        title: 'Госномер',
        width: 150,
        dataIndex: 'plateNumber',
        key: 'plateNumber',
        sorter: true,
        renderToExport: (plateNumber) => plateNumber,
        render: (plateNumber, record) => {
          return <LinkWithBack to={{ pathname: `/tractors/${record.id}` }}>{plateNumber}</LinkWithBack>;
        },
      },
      {
        title: 'Марка',
        width: 150,
        dataIndex: 'markAndModel',
        key: 'markAndModel',
        sorter: true,
        renderToExport: (markAndModel) => markAndModel,
        render: (markAndModel) => {
          return <VzTable.Cell.TextOverflow>{markAndModel}</VzTable.Cell.TextOverflow>;
        },
      },
      {
        title: 'Статус в системе',
        width: 150,
        dataIndex: 'status',
        key: 'status',
        sorter: true,
        render: (status) => (
          <VzTable.Cell.TextOverflow>{status === 'active' ? 'Активный' : 'Неактивный'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Статус в рейсе',
        dataIndex: 'uiState',
        key: 'uiState',
        width: 150,
        sorter: true,
        render: (uiStatus) => <VzTable.Cell.TextOverflow>{dictionaries?.vehicleUiState?.find(el => el.id === uiStatus)?.title}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Водителей',
        width: 150,
        dataIndex: 'linkedDriversCount',
        key: 'driverCount',
        sorter: true,
        renderToExport: (linkedDriversCount) => linkedDriversCount,
        render: (linkedDriversCount) => <VzTable.Cell.TextOverflow>{linkedDriversCount}</VzTable.Cell.TextOverflow>,
      }
    ],
    [dictionaries?.transportOrderStatuses, dictionaries?.vehicleTypes],
  );

  React.useEffect(() => {
    if (!columns.find(item => item.key == "ownerTitle") && APP === "dispatcher") {
      columns.push({
        title: t.transports('table.producer'),
        width: 150,
        dataIndex: 'owner',
        key: 'ownerTitle',
        width: 150,
        sorter: true,
        render: (owner) => <VzTable.Cell.TextOverflow>{owner?.title}</VzTable.Cell.TextOverflow>,
      })
    }
  }, [dictionaries?.transportOrderStatuses, dictionaries?.vehicleTypes])
  

  return columns;
}

export default useColumns;
