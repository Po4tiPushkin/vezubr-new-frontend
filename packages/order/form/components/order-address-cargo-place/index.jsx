import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import * as Order from '../../index';
import { useObserver } from 'mobx-react';
import { AddressContext } from '@vezubr/address/components/form-field-addresses/context';
import cn from 'classnames';
import { CargoPlaceAccountingContext } from "../../create/context";
const CLS = 'order-address-cargo-place';

function OrderAddressCargoPlace({ address, index }) {
  const { store } = React.useContext(Order.Context.OrderContext);
  const { canChangePredicateFn, positions } = useContext(AddressContext);
  const cargoPlaceAccounting = useContext(CargoPlaceAccountingContext);
  let extraPaddingClass = null;

  if (canChangePredicateFn(address, positions[address.guid]) === false) {
    extraPaddingClass = `${CLS}--padding`;
  }

  const { departure, arrival } = useObserver(() => {
    const cargoInfo = {
      departure: 0,
      arrival: 0,
    };

    if (address.isNew) {
      return cargoInfo;
    }

    const addresses = store.getDataItem('addresses');

    let position = index + 1;

    for (let i = index; i > -1; i--) {
      if (addresses?.[i]?.isNew) {
        position -= 1;
        break;
      }
    }

    return store.getDataItem('cargoPlaces').reduce((cargoInfo, item) => {
      if (position === item.departurePointPosition) {
        cargoInfo.departure = cargoInfo.departure + 1;
      }

      if (position === item.arrivalPointPosition) {
        cargoInfo.arrival = cargoInfo.arrival + 1;
      }

      return cargoInfo;
    }, cargoInfo);
  });

  const extraEmptyClass = useMemo(() => {
    if (cargoPlaceAccounting && !departure && !arrival) {
      return `${CLS}--empty-cargoplace`;
    }

    return null;
  }, [cargoPlaceAccounting, departure, arrival])

  if (address.isNew) {
    return null;
  }

  return (
    <div className={cn(`${CLS}`, extraPaddingClass, extraEmptyClass )}>
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
          {departure > 0 && (
            <div className={`${CLS}__place-info ${CLS}__place-info--loading`} title="Грузомест загрузить">
              {departure}
            </div>
          )}
        </div>
        <div className={`${CLS}__cell`}>
          {arrival > 0 && (
            <div className={`${CLS}__place-info ${CLS}__place-info--unloading`} title="Грузомест выгрузить">
              {arrival}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

OrderAddressCargoPlace.propTypes = {
  address: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  addressesCount: PropTypes.number.isRequired,
};

export default OrderAddressCargoPlace;
