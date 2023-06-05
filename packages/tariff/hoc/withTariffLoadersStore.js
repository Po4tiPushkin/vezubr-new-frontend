import React from 'react';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import { TariffContext } from '../context';
import {
  TARIFF_DEFAULT_HOURS_WORKS,
  TARIFF_LOADERS_DEFAULT_SERVICE,
  TARIFF_DEFAULT_SERVICE_VALUES,
  TARIFF_LOADERS_DEFAULT_MAIN_SERVICE,
  TARIFF_DEFAULT_DISTANCE_COSTS,
} from '../constants';
import TariffLoaders from '../store/TariffLoaders';

export default function withTariffHourlyStore(WrappedComponent) {
  function TariffStoreConnect(props) {
    const { tariff, editable, dictionaries, placeholders,clone, ...otherProps } = props;
    const defaultServiceValues = TARIFF_DEFAULT_SERVICE_VALUES;
    const useServices = TARIFF_LOADERS_DEFAULT_SERVICE;
    const useMainServices = TARIFF_LOADERS_DEFAULT_MAIN_SERVICE;
    const defaultBaseWorks = TARIFF_DEFAULT_HOURS_WORKS;
    const defaultDistanceCosts = TARIFF_DEFAULT_DISTANCE_COSTS;
    const { vehicleTypes, orderServices, vehicleBodies, loaderSpecialities } = dictionaries;
    const tariffPrev = usePrevious(tariff);
    const editablePrev = usePrevious(editable);

    const [store] = React.useState(() => {
      return new TariffLoaders({
        editable,
        useServices,
        useMainServices,
        defaultBaseWorks,
        defaultServiceValues,
        orderServices,
        tariff,
        vehicleTypes,
        vehicleBodies,
        defaultDistanceCosts,
        loaderSpecialities,
        isLoader: true,
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
