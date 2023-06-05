import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';

import BargainOfferDate from '../../components-inner/offer/fields/bargain-offer-date';
import BargainOfferProducerName from '../../components-inner/offer/fields/bargain-offer-producer';
import BargainOfferRate from '../../components-inner/offer/fields/bargain-offer-rate';
import BargainActionAccept from '../../components-inner/actions/bargain-action-accept';
import BargainOfferStatus from '../../components-inner/offer/fields/bargain-offer-status';
import BargainOfferStatusMin from '../../components-inner/offer/fields/bargain-offer-status-min';

function useColumnsCalcAccept({ renderProducerUrl, onAcceptOffer }) {
  const columns = useMemo(
    () => [
      {
        title: 'Время поступления',
        width: 200,
        dataIndex: 'offer',
        key: 'date',
        fixed: 'left',
        sorter: (a, b) => a?.offer.data?.updatedAt - b?.offer?.data?.updatedAt,
        defaultSortOrder: 'descend',
        render: (offer, record, index) => (
          <BargainOfferDate offer={offer} field={'updatedAt'} format={'DD.MM.YYYY HH:mm'} />
        ),
      },

      {
        title: 'Подрядчик',
        width: 350,
        dataIndex: 'offer',
        key: 'name',
        className: 'col-text-narrow',
        render: (offer, record, index) => (
          <VzTable.Cell.TextOverflow>
            <BargainOfferProducerName offer={offer} renderProducerUrl={renderProducerUrl} />
          </VzTable.Cell.TextOverflow>
        ),
      },

      {
        title: 'Цена без НДС',
        dataIndex: 'offer',
        width: 200,
        className: 'col-currency col-text-right',
        key: 'cost',
        sorter: (a, b) => a?.offer.data?.sum - b?.offer?.data?.sum,
        render: (offer, record, index) => <BargainOfferRate offer={offer} />,
      },

      {
        title: 'Статус',
        dataIndex: 'offer',
        width: 150,
        key: 'status',
        render: (offer, record, index) => (
          <>
            <BargainOfferStatus offer={offer} />
            <BargainOfferStatusMin offer={offer} />
          </>
        ),
      },

      {
        title: 'Действие',
        width: 200,
        dataIndex: 'offer',
        key: 'actions',
        fixed: 'right',
        render: (offer, record, index) => <BargainActionAccept offer={offer} onAction={onAcceptOffer} />,
      },
    ],
    [renderProducerUrl, onAcceptOffer],
  );

  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumnsCalcAccept;
