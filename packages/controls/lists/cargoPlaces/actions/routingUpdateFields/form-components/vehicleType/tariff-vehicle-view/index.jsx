import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { RouteContext } from '../../../context';
import { VzTable, VzForm } from '@vezubr/elements';

function TariffVehicleView(props) {
  const { vehicle } = props;
  const { store } = React.useContext(RouteContext);

  return (
    <>
      {vehicle.vehicleTypeName}
      {<VzForm.TooltipError error={store.getVehicleError(vehicle.key)} />}
    </>
  );
}

TariffVehicleView.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(TariffVehicleView);
