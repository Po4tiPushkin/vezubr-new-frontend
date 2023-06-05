import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import OfferItem from '../../../../store/OfferItem';
import { Ant } from '@vezubr/elements';

function BargainOfferStatusMin(props) {
  const { offer } = props;
  const { sum } = offer.data;
  const { min } = offer.store;

  if (sum === min) {
    return (
      <span className={'bargain-offer__status bargain-offer__status--min'}>
        <Ant.Tag color={'cyan'}>Минимальная</Ant.Tag>
      </span>
    );
  }

  return null;
}

BargainOfferStatusMin.propTypes = {
  offer: PropTypes.instanceOf(OfferItem),
};

export default observer(BargainOfferStatusMin);
