import React from 'react';
import PropTypes from 'prop-types';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import TariffHourly from '../store/TariffHourly';
import { TariffContext } from '../context';
import {
  TARIFF_DEFAULT_HOURS_WORKS,
  TARIFF_HOURLY_DEFAULT_SERVICE,
  TARIFF_DEFAULT_SERVICE_VALUES,
  TARIFF_HOURLY_DEFAULT_MAIN_SERVICE,
  TARIFF_HOURLY_ADDITIONAL_SERVICES
} from '../constants';

export const TariffHourlyStoreConnectProps = {
  tariff: PropTypes.object,
  editable: PropTypes.bool,
  dictionaries: PropTypes.object.isRequired,
};

export default function withTariffHourlyStore(WrappedComponent) {
  function TariffStoreConnect(props) {
    const { tariff, editable, dictionaries, placeholders, clone, ...otherProps } = props;

    const { vehicleTypes, orderServices, vehicleBodies } = dictionaries;

    const defaultServiceValues = TARIFF_DEFAULT_SERVICE_VALUES;
    const useMainServices = TARIFF_HOURLY_DEFAULT_MAIN_SERVICE;
    const defaultBaseWorks = TARIFF_DEFAULT_HOURS_WORKS;
    const additionalServices = TARIFF_HOURLY_ADDITIONAL_SERVICES;
    const tariffPrev = usePrevious(tariff);
    const editablePrev = usePrevious(editable);

    const [store] = React.useState(() => {
      return new TariffHourly({
        editable,
        useMainServices,
        vehicleBodies,
        vehicleTypes,
        defaultBaseWorks,
        defaultServiceValues,
        orderServices,
        tariff,
        additionalServices,
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

  TariffStoreConnect.propTypes = TariffHourlyStoreConnectProps;

  return TariffStoreConnect;
}
