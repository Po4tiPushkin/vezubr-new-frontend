import React from 'react';
import { convertTariffDataWithParams, convertTariffDataWithParamsLoaders } from '../utils';
import PropTypes from 'prop-types';

export const TariffConvertTariffProps = {
  tariff: PropTypes.object,
  dictionaries: PropTypes.object,
};

export default function withConvertTariff(WrappedComponent) {
  function TariffConvertTariff(props) {
    const { tariff: tariffInput, costWithVat = false , ...otherProps } = props;
    const dictionaries = otherProps.dictionaries;
    const { vehicleBodies } = dictionaries;

    const tariff = React.useMemo(() => {
      return tariffInput.params?.baseLoadersWorkCosts?.length ? convertTariffDataWithParamsLoaders({ tariffInput, costWithVat: costWithVat }) : convertTariffDataWithParams({ tariffInput, vehicleBodies, costWithVat });
    }, [tariffInput, vehicleBodies]);
    tariff.addresses = [];
    return <WrappedComponent {...otherProps} tariff={tariff} />;
  }

  TariffConvertTariff.propTypes = TariffConvertTariffProps;

  return TariffConvertTariff;
}
