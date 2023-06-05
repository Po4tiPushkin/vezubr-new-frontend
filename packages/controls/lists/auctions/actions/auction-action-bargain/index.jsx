import React from 'react';
import PropTypes from 'prop-types';
import useModalGroup from '@vezubr/common/hooks/useModalGroup';
import { Ant, Modal } from '@vezubr/elements';
import LinkWithBack from "@vezubr/components/link/linkWithBack";

function AuctionActionBargain({orderId, record}) {
  return (
    <LinkWithBack to={{ pathname: `/orders/${orderId}/auctions` }}>
      <Ant.Button size={'small'} icon={'monitor'}>
        Предложения
      </Ant.Button>
    </LinkWithBack>
  );
}

AuctionActionBargain.propTypes = {
  orderId: PropTypes.number.isRequired,
  record: PropTypes.object,
};

export default AuctionActionBargain;
