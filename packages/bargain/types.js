import PropTypes from 'prop-types';
import OfferItem from './store/OfferItem';

export const BargainProducerTypeProps = PropTypes.shape({
  id: PropTypes.number.isRequired,
  company_name: PropTypes.string,
  companyShortName: PropTypes.string,
  inn: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  logo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    download_url: PropTypes.string.isRequired,
  }),
});

export const BargainOfferProps = {
  offer: PropTypes.instanceOf(OfferItem),
  selfProducer: BargainProducerTypeProps,
  onEditOffer: PropTypes.func,
  onDeleteOffer: PropTypes.func,
};

export const BargainItemProps = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  avatarConfig: PropTypes.shape({
    src: PropTypes.string,
    icon: PropTypes.string,
    shape: PropTypes.string,
  }),
  align: PropTypes.oneOf(['right', 'left']),
  info: PropTypes.node,
};

export const BargainOfferItemProps = PropTypes.shape({
  id: PropTypes.number.isRequired,
  sum: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  createdAt: PropTypes.number.isRequired,
  updatedAt: PropTypes.number.isRequired,
  producer: BargainProducerTypeProps,
});
