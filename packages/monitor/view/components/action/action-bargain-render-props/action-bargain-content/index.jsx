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

function ActionBargainContent(props) {
  const { order } = props;

  const { bargain_offers, bargain_status } = order.data;

  const orderId = order.id;

  const isBargainNotLoaded = typeof bargain_offers === 'undefined';

  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(!isBargainNotLoaded);

  const fetchOrderBargains = React.useCallback(async () => {
    setLoading(true);

    try {
      const orderDetailsResponse = await OrderService.orderDetails(order.id);
      const orderDetails = orderDetailsResponse.data.order;

      const { bargain_offers } = orderDetails;

      const updatedData = {
        bargain_offers,
      };

      order.updateDirtyData(updatedData);

      setLoading(false);
      setLoaded(true);
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setLoading(false);
  }, []);

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
    if (isBargainNotLoaded) {
      fetchOrderBargains();
    }
  }, []);

  return (
    <div className={'order-view-monitor-bargain'}>
      {loaded && (
        <Bargain.ListCanAccept
          list={bargain_offers}
          status={bargain_status}
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

ActionBargainContent.propTypes = {
  order: PropTypes.object.isRequired,
};

export default observer(ActionBargainContent);
