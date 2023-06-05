import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Utils } from '@vezubr/common/common';
import { AssignAgreementToContract } from '@vezubr/components';

function useColumns({ dictionaries, history, user, contractorId, isManager }) {
  const columns = useMemo(
    () => [
      {
        title: 'Номер договора',
        width: 120,
        dataIndex: 'contractNumber',
        key: 'contractNumber',
        sorter: true,
        render: (text, record) => {
          return (
            <VzTable.Cell.TextOverflow>
              <Link to={record.contractNumber ? `/contract/${record.id}` : `/agreement/${record.id}?contractorId=${contractorId}`}>
                {record?.contractNumber ? (text ? text : '-') : record?.agreementNumber ? record?.agreementNumber : '-'}
              </Link>
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Дата подписания',
        width: 150,
        dataIndex: 'signedAt',
        key: 'signedAt',
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>{(text && moment(text).format('DD.MM.YYYY')) || '-'}</VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Срок действия',
        width: 150,
        dataIndex: 'expiresAt',
        key: 'expiresAt',
        sorter: true,
        render: (text) => (
          <VzTable.Cell.TextOverflow>
            {(text && moment(text).format('DD.MM.YYYY')) || 'Бессрочный'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Тип договора',
        width: 120,
        dataIndex: 'contractType',
        key: 'contractType',
        sorter: true,
        render: (contractType) => {
          return contractType && dictionaries?.contourContractContractTypes[contractType];
        },
      },
      {
        title: 'Отсрочка платежа',
        width: 150,
        dataIndex: 'paymentDelay',
        key: 'paymentDelay',
        sorter: true,
        render: (text) => <VzTable.Cell.TextOverflow>{text?.toString()}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Действия',
        dataIndex: 'agreementType',
        key: 'agreementType',
        width: 130, 
        render: (agreement = {}, record, index) =>
          record?.agreementNumber && isManager === false ? (
            <AssignAgreementToContract agreementId={record?.id} contractorId={contractorId} />
          ) : (
            <></>
          ),
      },
    ],
    [dictionaries?.contourContractContractTypes, history, user, isManager],
  );

  return columns;
}

export default useColumns;
