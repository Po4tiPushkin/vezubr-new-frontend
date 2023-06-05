import React from 'react';
import PropTypes from 'prop-types';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import TariffFixed from '../store/TariffFixed';
import { TariffContext } from '../context';
import {
  TARIFF_FIXED_DEFAULT_SERVICE,
  TARIFF_DEFAULT_SERVICE_VALUES,
  TARIFF_FIXED_DEFAULT_MAIN_SERVICE,
  TARIFF_FIXED_DEFAULT_PARAMS,
  SERVICE_PARAMS,
  TARIFF_FIXED_ADDITIONAL_SERVICES,
} from '../constants';

export const TariffFixedStoreConnectProps = {
  tariff: PropTypes.object,
  editable: PropTypes.bool,
  dictionaries: PropTypes.object.isRequired,
};

export default function withTariffFixedStore(WrappedComponent) {
  function TariffStoreConnect(props) {
    const { tariff, editable, clone, placeholders,  ...otherProps } = props;

    const { vehicleTypes, orderServices, vehicleBodies } = otherProps.dictionaries;

    const defaultServiceValues = TARIFF_DEFAULT_SERVICE_VALUES;
    const useServices = TARIFF_FIXED_DEFAULT_SERVICE;
    const useMainServices = TARIFF_FIXED_DEFAULT_MAIN_SERVICE;
    const useServiceParams = TARIFF_FIXED_DEFAULT_PARAMS;
    const additionalServices = TARIFF_FIXED_ADDITIONAL_SERVICES;
    const tariffPrev = usePrevious(tariff);
    const editablePrev = usePrevious(editable);

    const [store] = React.useState(() => {
      return new TariffFixed({
        editable,
        useServices,
        useMainServices,
        vehicleBodies,
        vehicleTypes,
        defaultServiceValues,
        orderServices,
        tariff,
        useServiceParams,
        serviceParams: SERVICE_PARAMS,
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

  TariffStoreConnect.propTypes = TariffFixedStoreConnectProps;

  return TariffStoreConnect;
}
