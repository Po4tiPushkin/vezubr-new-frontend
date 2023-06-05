import React from 'react';
import PropTypes from 'prop-types';
import { createDateTimeZoneZero } from "@vezubr/common/utils";

const CLS = 'order-address-label';

function OrderAddressLabel({ address, label }) {
  return (
    <div className={`${CLS}`}>
      <div className={`${CLS}__label`}>{label}</div>
      {address?.requiredArriveAt && (
        <div className={`${CLS}__actions`}>
          <div key="requiredArriveAt" className={`${CLS}__actions__item ${CLS}__actions__item--time`}>
            {(createDateTimeZoneZero(address.requiredArriveAt)).format('DD-MM-YYYY HH:mm')}
          </div>
        </div>
      )}
    </div>
  );
}

OrderAddressLabel.propTypes = {
  address: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  addressesCount: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default OrderAddressLabel;
