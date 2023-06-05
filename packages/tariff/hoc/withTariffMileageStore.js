import React from 'react';
import PropTypes from 'prop-types';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import TariffMileage from '../store/TariffMileage';
import { TariffContext } from '../context';
import {
  TARIFF_MILEAGE_ADDITIONAL_SERVICES,
  TARIFF_MILEAGE_BASEWORKS,
  TARIFF_MILEAGE_DEFAULT_PARAMS,
  TARIFF_MILEAGE_DEFAULT_MAIN_SERVICE
} from '../constants';

export default function withTariffMileageStore(WrappedComponent) {
  function TariffStoreConnect(props) {
    const { tariff, editable, dictionaries, placeholders, clone, ...otherProps } = props;

    const { vehicleTypes, orderServices, vehicleBodies } = dictionaries;

    const useMainServices = TARIFF_MILEAGE_DEFAULT_MAIN_SERVICE;
    const additionalServices = TARIFF_MILEAGE_ADDITIONAL_SERVICES;
    const defaultParams = TARIFF_MILEAGE_DEFAULT_PARAMS;
    const tariffPrev = usePrevious(tariff);
    const editablePrev = usePrevious(editable);

    const [store] = React.useState(() => {
      return new TariffMileage({
        editable,
        useMainServices,
        vehicleBodies,
        vehicleTypes,
        orderServices,
        tariff,
        additionalServices,
        defaultParams,
        clone,
        placeholders
      });
    });

    const contextValue = React.useMemo(
      () => ({
        store,
      }),
      [store],
    );

    React.useEffect(() => {
      if (tariff && tariffPrev !== tariff) {
        store.setTariff(tariff);
      }

      if (editablePrev !== editable) {
        store.setEditable(editable);
      }
    }, [tariff, tariffPrev, editable, editablePrev]);

    return (
      <TariffContext.Provider value={contextValue}>
        <WrappedComponent {...otherProps} store={store} />
      </TariffContext.Provider>
    );
  }

  return TariffStoreConnect;
}
