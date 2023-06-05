import React from 'react';
import PropTypes from 'prop-types';
import { VzEmpty } from '@vezubr/elements';
import { observer } from 'mobx-react';
import compose from '@vezubr/common/hoc/compose';
import withBargainStore from '../../hoc/withBargainStore';
import BargainOffer from '../../components-inner/offer/bargain-offer';
import withConvertMiMinToList from '../../hoc/withConvertMiMinToList';
import BargainOfferAdd from '../../components-inner/offer/bargian-offer-add';
import { BargainProducerTypeProps } from '../../types';
import BargainItem from '../../elements/bargain-item';
import iconVezubr from '@vezubr/common/assets/redbul.png';
import { formatOfferProducer } from '../../utils';

const avatarConfigVezubr = {
  src: iconVezubr,
};

function BargainListMakeOffers(props) {
  const { selfProducer: selfProducerInput, onEditOffer, onDeleteOffer, onAddOffer, store, hasMy } = props;

  const offers = store.list;

  const selfProducer = React.useMemo(() => selfProducerInput && formatOfferProducer(selfProducerInput), [
    selfProducerInput,
  ]);

  const { isActive, isCompleted } = store;
  const hasOffers = offers.length > 0;

  return (
    <div className={'bargain-list bargain-list-make-offers'}>
      {!hasOffers && !isActive && <VzEmpty vzImageName={'auctionOrange'} title={'Торги'} />}

      <div className={'bargain-list__wrapper'}>
        {hasOffers &&
          offers.map((offer) => (
            <BargainOffer
              key={offer.id}
              offer={offer}
              selfProducer={selfProducer}
              onEditOffer={onEditOffer}
              onDeleteOffer={onDeleteOffer}
            />
          ))}

        <BargainOfferAdd canAdd={!hasMy} selfProducer={selfProducer} count={1} onAddOffer={onAddOffer} />

        {isCompleted && hasOffers && (
          <BargainItem className={'bargain-offer__stop'} avatarConfig={avatarConfigVezubr}>
            <span>Торги зевершены</span>
          </BargainItem>
        )}
      </div>
    </div>
  );
}

BargainListMakeOffers.propTypes = {
  selfProducer: BargainProducerTypeProps,
  onAddOffer: PropTypes.func,
  onEditOffer: PropTypes.func,
  onDeleteOffer: PropTypes.func,
  hasMy: PropTypes.bool,
};

export default compose([withConvertMiMinToList(), withBargainStore(), observer])(BargainListMakeOffers);
