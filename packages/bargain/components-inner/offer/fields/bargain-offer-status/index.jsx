import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import OfferItem from '../../../../store/OfferItem';
import { Ant } from '@vezubr/elements';

const STATUSES = {
  2: {
    color: 'green',
    text: 'Принята',
  },

  4: {
    color: 'red',
    text: 'Оменена',
  },
};

function BargainOfferStatus(props) {
  const { offer } = props;
  const { status } = offer.data;

  if (STATUSES[status]) {
    const statusInfo = STATUSES[status];
    return (
      <span className={'bargain-offer__status'}>
        <Ant.Tag color={statusInfo.color}>{statusInfo.text}</Ant.Tag>
      </span>
    );
  }

  return null;
}

BargainOfferStatus.propTypes = {
  offer: PropTypes.instanceOf(OfferItem),
};

export default observer(BargainOfferStatus);
