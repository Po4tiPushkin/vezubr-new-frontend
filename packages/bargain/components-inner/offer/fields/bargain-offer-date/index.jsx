import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import OfferItem from '../../../../store/OfferItem';
import moment from 'moment';

function BargainOfferDate(props) {
  const { offer, field, format } = props;
  const date = offer.data[field];

  return <span className={'bargain-offer__date'}>{moment.unix(date).format(format)}</span>;
}

BargainOfferDate.propTypes = {
  offer: PropTypes.instanceOf(OfferItem),
  format: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
};

export default observer(BargainOfferDate);
