import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SkipAddressContext } from '../../context';
import {Ant, IconDeprecated} from '@vezubr/elements';
const CLS = 'order-address-cargo-place';

function OrderSkipAddress({ address, addressesCount }) {
  const isVisibleSkipButton = ((!address?.canChangePosition && address?.skipped) || (address?.canChangePosition === true))
      && (address?._startPosition !== 1 && address?._startPosition !== addressesCount);
  const {onSkipAddress, cargoPlace, order} = useContext(SkipAddressContext);
  const orderInWork = order?.frontend_status?.state < 400;

  const handleSkipAddress = (e) => {
    e.preventDefault();

    if (onSkipAddress) {
      onSkipAddress({
        startPosition: address?._startPosition,
        position: address?._position
      });
    }

    return false;
  }

  if (!onSkipAddress) {
    return null;
  }

  let departure = 0;
  let arrival = 0;

  if (cargoPlace && cargoPlace.length > 0) {
    cargoPlace?.forEach((item) => {
      if (item?.deliveryAddressId === address.id) {
        arrival++;
      }
      if (item?.departureAddressId === address.id) {
        departure++;
      }
    });
  }

  return (
    <>
      <div className={`${CLS}`}>
        <div className={`${CLS}__row`}>
          <div className={`${CLS}__cell`}>
            {address?.isLoadingWork && (
              <div className={`${CLS}__loading-type ${CLS}__loading-type--loading`} title="Погрузка">
                <Ant.Icon type="vertical-align-bottom" />
              </div>
            )}
          </div>
          <div className={`${CLS}__cell`}>
            {address?.isUnloadingWork && (
              <div className={`${CLS}__loading-type ${CLS}__loading-type--unloading`} title="Разгрузка">
                <Ant.Icon type="vertical-align-top" />
              </div>
            )}
          </div>
        </div>
        <div className={`${CLS}__row`}>
          <div className={`${CLS}__cell`}>
            {address?.isLoadingWork && departure > 0 && (
              <div className={`${CLS}__place-info ${CLS}__place-info--loading`} title="Грузомест загрузить">
                {departure}
              </div>
            )}
          </div>
          <div className={`${CLS}__cell`}>
            {address?.isUnloadingWork && arrival > 0 && (
              <div className={`${CLS}__place-info ${CLS}__place-info--unloading`} title="Грузомест выгрузить">
                {arrival}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
          className={'vz-address-skip-button__block-wrp'}
      >
        {isVisibleSkipButton && orderInWork && (
            <a
                title="Пропустить адрес"
                className={'vz-address-skip-button'}
                onClick={handleSkipAddress}
            >
              {address?.skipped ? (
                <IconDeprecated name={'brickGray'} className={'sidebar__icon no-events icon-xs'} />
              ) : (
                <IconDeprecated name={'brickOrange'} className={'sidebar__icon no-events icon-xs'} />
              )}
            </a>
        )}
      </div>
    </>
  )
}

OrderSkipAddress.propTypes = {
  address: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  addressesCount: PropTypes.number.isRequired,
};

export default OrderSkipAddress;
