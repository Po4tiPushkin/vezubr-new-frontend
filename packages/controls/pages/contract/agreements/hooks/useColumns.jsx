import React, { useMemo } from 'react';
import { Ant, VzTable } from '@vezubr/elements';
import moment from 'moment';
import { Utils } from '@vezubr/common/common';
import { Link } from 'react-router-dom';
import { Icon as IconAnt } from '@vezubr/elements/antd';

const useColumns = ({ onDelete, onAddTariff, dictionaries, disabled, contractorId }) =>
  useMemo(
    () => [
      {
        title: 'Номер ДУ',
        dataIndex: 'agreementNumber',
        key: 'agreementNumber',
        width: 100,
        render: (agreementNumber, record) =>
          <VzTable.Cell.TextOverflow>{<Link to={`/agreement/${record.id}?contractorId=${contractorId}`}>{agreementNumber}</Link>}</VzTable.Cell.TextOverflow>,
      },
      {
        title: 'Дата подписания',
        dataIndex: 'signedAt',
        key: 'signedAt',
        width: 100,
        render: (signedAt) => (
          <VzTable.Cell.TextOverflow>
            {(signedAt && moment(signedAt).format('DD.MM.YYYY')) || '-'}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Срок действия',
        dataIndex: 'expiresAt',
        key: 'expiresAt',
        width: 100,
        render: (expiresAt, record) => {
          return (
            <VzTable.Cell.TextOverflow>
              {(expiresAt && moment(expiresAt).format('DD.MM.YYYY')) || 'Бессрочный'}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Тип тарифа',
        dataIndex: 'contractType',
        width: 100,
        key: 'contractType',
        render: (contractType) => {
          return (
            <VzTable.Cell.TextOverflow>
              {dictionaries?.contourContractContractTypes?.find(({ id }) => contractType == id)?.title}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Тип публикации',
        dataIndex: 'orderType',
        width: 100,
        key: 'orderType',
        render: (orderType) => {
          return (
            <VzTable.Cell.TextOverflow>
              {dictionaries.tariffOrderTypes.find(el => el.id === orderType)?.title}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Скан ДУ',
        dataIndex: 'file',
        width: 80,
        key: 'file',
        render: (file) => {
          return (
            <VzTable.Cell.TextOverflow>
              {file && <IconAnt type="file-pdf" onClick={() => window.open(window.API_CONFIGS[APP].host + file.downloadUrl.replace('/', ''), '_blank')} />}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Тариф',
        dataIndex: 'tariffTitle',
        width: 130,
        key: 'tariffTitle',
        render: (title, record) => {
          return (
            <>
              {record.tariffAppoint ? (
                <VzTable.Cell.TextOverflow>
                  <Link to={`/tariffs/${record?.tariffAppoint?.tariffId}`}>{record?.tariffAppoint?.tariffTitle}</Link>
                </VzTable.Cell.TextOverflow>

              ) : (
                <Ant.Button disabled={disabled} icon={'edit'} size={'small'} title={'Тариф'} onClick={() => onAddTariff(record.id)}>
                  Тариф
                </Ant.Button>
              )}
            </>
          );
        },
      },
      {
        title: '',
        dataIndex: 'id',
        width: 100,
        key: 'id',
        render: (id, record) => {
          return record.deleted ? (
            <VzTable.Cell.TextOverflow>
              {record.deletedAt && moment(record.deletedAt).format('DD.MM.YYYY')}
            </VzTable.Cell.TextOverflow>
          ) : (
            <Ant.Button disabled={disabled} icon={'delete'} size={'small'} title={'Удалить'} onClick={() => onDelete(id)}>
              Удалить
            </Ant.Button>
          );
        },
      },
    ],
    [dictionaries?.contourContractAgreementTypes, onAddTariff, onDelete, disabled, contractorId],
  );

export default useColumns;