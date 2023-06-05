import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { Ant, VzTable } from '@vezubr/elements';
import moment from 'moment';

const useColumns = ({ showEdit, offerSum, actionButtons, currencyFormat, onChangeSums, sumWithVat, vatRateVisible, dictionaries }) => {
  return useMemo(() => {
    return [
      {
        title: 'Дата и Время',
        width: 140,
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        render: (date) => (
          (date && moment(date).format('DD.MM.YYYY HH:mm')) || '-'
        ),
      },
      {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 110,
        render: (status, record) => (status
          ? dictionaries.offerStatuses.find(el => el.id === status)?.title
          :
          record.sum ? 'Отправлено'
            :
            ''
        ),
      },
      {
        title: 'Контрагент',
        dataIndex: 'client',
        key: 'client',
        width: 280,
        align: 'center',
        render: (client, record, index) => (client?.title || client?.inn || '')
      },
      {
        title: 'Стоимость без НДС',
        dataIndex: 'sum',
        key: 'sum',
        align: 'center',
        width: 140,
        render: (sum) =>
        (showEdit ?
          <Ant.InputNumber
            size={'small'}
            value={offerSum}
            onChange={(value) => onChangeSums('withoutVat', value)}
            decimalSeparator={','}
          />
          :
          (currencyFormat.format(sum / 100) || '')
        )

      },
      ...[
        (vatRateVisible ? {
          title: 'Стоимость c НДС',
          key: 'sumWithVat',
          align: 'center',
          width: vatRateVisible ? 140 : 0,
          render: () =>
          (showEdit ?
            <Ant.InputNumber
              size={'small'}
              value={sumWithVat}
              onChange={(value) => onChangeSums('vat', value)}
              decimalSeparator={','}
            />
            :
            (currencyFormat.format(sumWithVat) || '')
          )

        } : {
          width: 0
        }),
      ],
      {
        title: 'Действие',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        // ...{
        //   [vatRateVisible ? 'fixed' : '']: 'right',
        // },
        width: 180,
        render: (action, record) => (
          actionButtons()
        )
      }
    ]
  }, [showEdit, offerSum, actionButtons, sumWithVat, vatRateVisible, dictionaries]);
}


export default useColumns;