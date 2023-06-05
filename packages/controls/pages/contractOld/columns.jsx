import React, { useMemo } from 'react';
import { Ant, VzTable } from '@vezubr/elements';
import moment from 'moment';
import { Utils } from '@vezubr/common/common';
import { Link } from 'react-router-dom';
import { Icon as IconAnt } from '@vezubr/elements/antd';

export const useColumns = ({ onDelete, onAddTariff, dictionaries, disabled }) =>
  useMemo(
    () => [
      {
        title: 'Номер ДУ',
        dataIndex: 'agreementNumber',
        key: 'agreementNumber',
        width: 100,
        render: (agreementNumber) => <VzTable.Cell.TextOverflow>{agreementNumber}</VzTable.Cell.TextOverflow>,
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
              {(expiresAt && moment(expiresAt).format('DD.MM.YYYY')) || '-'}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'ДУ по услуге',
        dataIndex: 'agreementType',
        width: 200,
        key: 'agreementType',
        render: (agreementType) => {
          return (
            <VzTable.Cell.TextOverflow>
              {dictionaries?.contourContractAgreementTypes?.find(({ id }) => id === agreementType)?.title}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Тип ДУ',
        width: 200,
        dataIndex: 'contractType',
        key: 'contractType',
        sorter: false,
        render: (contractType) => (
          <VzTable.Cell.TextOverflow>
            {dictionaries?.contourContractContractTypes?.find(({ id }) => id == contractType)?.title}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Скан ДУ',
        dataIndex: 'file',
        width: 70,
        key: 'file',
        render: (file) => {
          return (
            <VzTable.Cell.TextOverflow>
              {file ? <IconAnt type="file-pdf" onClick={() => window.open(file.downloadUrl, '_blank')} /> : 'Нет'}
            </VzTable.Cell.TextOverflow>
          );
        },
      },
      {
        title: 'Тариф',
        dataIndex: 'id',
        width: 100,
        key: 'id',
        render: (id, record) => {
          return (
            <>
              {record.tariffId ? (
                <Link to={`/tariffs/${record.tariffId}`}>{record.tariffId}</Link>
              ) : (
                <Ant.Button
                  disabled={disabled}
                  icon={'edit'}
                  size={'small'}
                  title={'Тариф'}
                  onClick={() => onAddTariff(id)}
                >
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
            <Ant.Button
              disabled={disabled}
              icon={'delete'}
              size={'small'}
              title={'Удалить'}
              onClick={() => onDelete(id)}
            >
              Удалить
            </Ant.Button>
          );
        },
      },
    ],
    [dictionaries?.contourContractAgreementTypes, onAddTariff, onDelete, disabled],
  );
