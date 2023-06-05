import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import { Link } from 'react-router-dom'

function useColumns({ dictionaries }) {
  const columns = useMemo(
    () => [
      {
        title: 'ID ДС',
        width: 70,
        dataIndex: 'id',
        key: 'id',
        render: (text) => <VzTable.Cell.TextOverflow>{text}</VzTable.Cell.TextOverflow>,
      },

      {
        title: 'Номер ДС',
        width: 100,
        dataIndex: 'agreementNumber',
        key: 'agreementNumber',
        sorter: false,
      },

      {
        title: 'Дата подписания',
        width: 100,
        dataIndex: 'signedAt',
        key: 'signedAt',
        sorter: false,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{text ? moment(text).format('DD.MM.YYYY') : '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Срок действия',
        width: 100,
        dataIndex: 'expiresAt',
        key: 'expiresAt',
        sorter: false,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{text ? moment(text).format('DD.MM.YYYY') : 'Бессрочный'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'ДС по услуге',
        width: 200,
        dataIndex: 'agreementType',
        key: 'agreementType',
        sorter: false,
        render: (agreementType) => (
          <VzTable.Cell.TextOverflow>
            {dictionaries?.contourContractAgreementTypes[agreementType]}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'ID тарифа ',
        width: 100,
        dataIndex: 'tariffId',
        key: 'tariffId',
        sorter: false,
        render: (id) => {
          return (
            <VzTable.Cell.TextOverflow>
              <Link to={`/tariffs/${id}`}>{id}</Link>
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Конфигурация тарифа',
        width: 200,
        dataIndex: 'tariffAppointId',
        key: 'tariffAppointId',
        sorter: false,
        render: (tariffAppointId) => (
          <VzTable.Cell.TextOverflow>{dictionaries?.tariffTypes?.[tariffAppointId]}</VzTable.Cell.TextOverflow>
        ),
      },
    ],
    [dictionaries?.contourContractContractTypes, dictionaries?.contourContractAgreementTypes, dictionaries?.tariffTypes],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
