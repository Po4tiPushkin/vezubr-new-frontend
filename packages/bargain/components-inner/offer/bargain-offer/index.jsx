import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { fileGetPreviewById } from '@vezubr/common/utils';

import { BargainOfferProps } from '../../../types';

import BargainItem from '../../../elements/bargain-item';
import BargainActionEdit from '../../actions/bargain-action-edit';
import BargainActionDelete from '../../actions/bargain-action-delete';
import BargainOfferRate from '../fields/bargain-offer-rate';
import BargainOfferProducer from '../fields/bargain-offer-producer';
import BargainOfferStatusMin from '../fields/bargain-offer-status-min';
import BargainOfferStatus from '../fields/bargain-offer-status';

function BargainOffer(props) {
  const { offer, onDeleteOffer, onEditOffer, selfProducer } = props;

  const { producer } = offer.data;

  const producerId = producer?.id;

  const isSelfProducer = selfProducer && selfProducer.id === producerId;

  const avatarConfig = {
    src: producer?.logoFileId && fileGetPreviewById(producer.logoFileId, 80, 80),
  };

  const isEditingRate = onEditOffer && isSelfProducer;
  const isDeleteRate = onDeleteOffer && isSelfProducer;

  return (
    <BargainItem
      className={cn('bargain-offer', { 'bargain-offer--itself': isSelfProducer })}
      align={isSelfProducer ? 'right' : 'left'}
      info={
        <BargainOfferProducer
          useAgo={true}
          selfProducer={selfProducer}
          offer={offer}
          defaultName={'Неизвестный подрядчик'}
        />
      }
      avatarConfig={avatarConfig}
    >
      {isEditingRate && <BargainActionEdit title={'Ваша ставка'} offer={offer} onAction={onEditOffer} />}
      {!isEditingRate && <BargainOfferRate title={'Ставка'} offer={offer} />}
      {isDeleteRate && <BargainActionDelete offer={offer} onAction={onDeleteOffer} />}
      <BargainOfferStatusMin offer={offer} />
      <BargainOfferStatus offer={offer} />
    </BargainItem>
  );
}

BargainOffer.propTypes = BargainOfferProps;

export default observer(BargainOffer);
