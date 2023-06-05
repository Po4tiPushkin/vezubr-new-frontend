import React, { useMemo } from 'react';
import { VzTable,Ant } from '@vezubr/elements';
import moment from 'moment';
import t from '@vezubr/common/localization';
import cn from 'classnames';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useColumns({ onAcceptOffer, accepted, producer, isDisabledButtons, vatRateVisible, isDisabledAccept }) {
  const columns = useMemo(
    () => [
      {
        title: 'Время поступления',
        width: 140,
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: (createdAt, record) => (
          <VzTable.Cell.TextOverflow>
            {moment(record.updatedAt || record.createdAt).format('DD.MM.YYYY HH:mm')}
          </VzTable.Cell.TextOverflow>
        ),
      },
      {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        align: 'center',
        className: 'col-text-narrow',
        render: (status) => (status && t.order(`bargainStatus.${status}`) || 'Получено'),
      },
      {
        title: 'Контрагент',
        dataIndex: 'contractor',
        width: 280,
        key: 'contractor',
        align: 'center',
        render: (contractor, record, index) => (contractor?.title || contractor?.inn || '')
      },
      {
        title: 'Стоимость без НДС',
        dataIndex: 'sum',
        width: 140,
        className: 'col-currency col-text-right',
        key: 'sum',
        align: 'center',
        render: (sum, record, index) => (currencyFormat.format(sum / 100) || ''),
      },
      ...[
        (vatRateVisible ? {
          title: 'Стоимость с НДС',
          dataIndex: 'costVatRate',
          width: vatRateVisible ? 140 : 0,
          className: 'col-currency col-text-right',
          key: 'sumVat',
          align: 'center',
          render: (vatRate, record, index) => (currencyFormat.format((record.sum + (record.sum * vatRate / 100)) / 100) || ''),

        } : {
          width: 0
        }),
      ],
      {
        title: 'Действие',
        width: 150,
        dataIndex: 'id',
        key: 'actions',
        align: 'center',
        // ...{
        //   [vatRateVisible ? 'fixed' : '']: 'right',
        // },
        render: (id, record, index) => <>
          <Ant.Button
            icon = {'check'}
            size = {'small'}
            disabled={accepted || isDisabledAccept}
            title = {'Принять ставку'}
            onClick = {() => onAcceptOffer(id)}
            className={cn({'disabled': isDisabledButtons})}
            style={{marginRight: 'auto'}}
          >
            Принять
          </Ant.Button></>,
      },
    ],
    [onAcceptOffer, accepted, producer, isDisabledButtons, vatRateVisible, isDisabledAccept],
  );

  return columns;
}


export default useColumns;
