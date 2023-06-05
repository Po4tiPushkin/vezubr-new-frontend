import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import * as Bargain from '@vezubr/bargain';
import { Ant, showError } from '@vezubr/elements';
import {Bargains as BargainsService, Offers as OffersService, Orders as OrderService} from '@vezubr/services';

const renderProducerUrl = ({ id, title }) => (
  <a target={'_blank'} rel="noopener noreferrer" href={`/producers?producerId=${id}`}>
    {title}
  </a>
);

function AuctionActionBargainContent(props) {
  const { orderId } = props;

  const [dataSource, setDataSource] = React.useState({
    offers: [],
    status: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const fetchOrderBargains = React.useCallback(async () => {
    setLoading(true);

    try {
      const orderDetailsResponse = await OrderService.orderDetails(orderId);
      const orderDetails = orderDetailsResponse.data.order;

      const { bargain_offers: offers, bargain_status: status } = orderDetails;

      setDataSource({
        offers,
        status,
      });

      setLoading(false);
      setLoaded(true);
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setLoading(false);
  }, [orderId]);

  const onAcceptOffer = React.useCallback(
    async (offer, data) => {
      const offerId = offer.id;
      await OffersService.accept({
        id: orderId,
        data: offerId,
      });

      offer.updateDirtyData({
        status: 2,
      });

      return null;
    },
    [orderId],
  );

  React.useEffect(() => {
    fetchOrderBargains();
  }, []);

  const { offers, status } = dataSource;

  return (
    <div className={'auction-action-bargain-content'}>
      {loaded && (
        <Bargain.ListCanAccept
          list={offers}
          status={status}
          onAcceptOffer={onAcceptOffer}
          renderProducerUrl={renderProducerUrl}
          height={300}
        />
      )}

      {(loading || !loaded) && (
        <div className={'loader'}>
          <Ant.Icon type="loading" />
        </div>
      )}
    </div>
  );
}

AuctionActionBargainContent.propTypes = {
  orderId: PropTypes.number.isRequired,
};

export default observer(AuctionActionBargainContent);
