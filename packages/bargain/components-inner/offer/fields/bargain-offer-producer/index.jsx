import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import OfferItem from '../../../../store/OfferItem';
import moment from 'moment';

function BargainOfferProducer(props) {
  const { offer, renderProducerUrl, defaultName, selfProducer, useAgo } = props;
  const { producer, updatedAt } = offer.data;

  const producerId = producer?.id;
  const isSelfProducer = selfProducer && selfProducer.id === producerId;

  let title = isSelfProducer
    ? 'Вы'
    : producer
    ? producer.companyShortName || `ИНН: ${producer?.inn}`
    : defaultName || '-';

  if (!isSelfProducer && renderProducerUrl && producerId) {
    title = renderProducerUrl({ producer, id: producerId, title });
  }

  return (
    <span className={'bargain-offer__producer'}>
      <span className={'bargain-offer__producer__name'}>{title}</span>
      {useAgo && (
        <>
          <span className={'bargain-offer__producer__divider'}>-</span>
          <span className={'bargain-offer__producer__ago'}>{moment.unix(updatedAt).fromNow()}</span>
        </>
      )}
    </span>
  );
}

BargainOfferProducer.propTypes = {
  offer: PropTypes.instanceOf(OfferItem),
  useAgo: PropTypes.bool,
  renderProducerUrl: PropTypes.func,
  defaultName: PropTypes.string,
  selfProducer: PropTypes.object,
};

export default observer(BargainOfferProducer);
