import React from 'react';
import PropTypes from 'prop-types';
import CargoPlaceRouse from '../store/Route';
import { RouteContext } from '../context';

export default function withRouteStore(WrappedComponent) {
  function RouteStoreConnect(props) {
    const { dictionaries, ...otherProps } = props;

    const { vehicleTypes, vehicleBodies, veeroutePlanTypes } = dictionaries;

    const [store] = React.useState(() => {
      return new CargoPlaceRouse({
        veeroutePlanTypes,
        vehicleBodies,
        vehicleTypes,
      });
    });

    const contextValue = React.useMemo(
      () => ({
        store,
      }),
      [store],
    );

    return (
      <RouteContext.Provider value={contextValue}>
        <WrappedComponent {...otherProps} store={store} />
      </RouteContext.Provider>
    );
  }

  RouteStoreConnect.propTypes = {
    tariff: PropTypes.object,
    editable: PropTypes.bool,
    dictionaries: PropTypes.object.isRequired,
  };

  return RouteStoreConnect;
}
