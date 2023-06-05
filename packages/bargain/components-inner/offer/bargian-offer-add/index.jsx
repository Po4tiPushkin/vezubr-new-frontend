import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { BargainListContext } from '../../../context';
import { BargainProducerTypeProps } from '../../../types';
import BargainActionAdd from '../../actions/bargain-action-add';
import BargainItem from '../../../elements/bargain-item';
import Utils from '@vezubr/common/common/utils';

const getNewOffer = (store, selfProducer) =>
  store.createNewOffer({
    id: 0,
    sum: 50000,
    producer: selfProducer,
  });

function BargainOfferAdd(props) {
  const { selfProducer, onAddOffer, count, canAdd: canAddInput } = props;

  const [countLeft, setCountLeft] = React.useState(count);

  const { store } = React.useContext(BargainListContext);

  const [newOffer, setNewOffer] = React.useState(() => getNewOffer(store, selfProducer));

  const addNewOffer = React.useCallback(() => {
    setNewOffer(getNewOffer(store, selfProducer));
  }, [selfProducer]);

  const onAdded = React.useCallback(() => {
    setCountLeft(countLeft - 1);
    addNewOffer();
  }, [countLeft]);

  const canAdd = canAddInput && onAddOffer && countLeft > 0 && store.isActive;

  if (!canAdd) {
    return null;
  }

  const avatarConfig = {
    src: selfProducer?.logo?.download_url && Utils.concatImageUrl(selfProducer.logo.download_url),
  };

  return (
    <BargainItem className={'bargain-offer__add'} avatarConfig={avatarConfig} align={'right'}>
      <BargainActionAdd
        offer={newOffer}
        title={'Ваша ставка:'}
        size={'default'}
        onAction={onAddOffer}
        onPostAction={onAdded}
      />
    </BargainItem>
  );
}

BargainOfferAdd.propTypes = {
  onAddOffer: PropTypes.func,
  canAdd: PropTypes.bool,
  count: PropTypes.number.isRequired,
  selfProducer: BargainProducerTypeProps,
};

export default observer(BargainOfferAdd);
