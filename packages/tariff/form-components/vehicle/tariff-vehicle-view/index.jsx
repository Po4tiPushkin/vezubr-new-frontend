import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { TariffContext } from '../../../context';
import { VzTable, VzForm } from '@vezubr/elements';

function TariffVehicleView(props) {
  const { vehicle } = props;

  const { store } = React.useContext(TariffContext);

  const renderWrapCell = (items) => <VzTable.Cell.TextOverflow>{items}</VzTable.Cell.TextOverflow>;

  return (
    <>
      {store.editable ? vehicle.vehicleTypeName : renderWrapCell(vehicle.vehicleTypeName)}
      {store.editable && <VzForm.TooltipError error={store.getVehicleError(vehicle.key)} />}
    </>
  );
}

TariffVehicleView.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(TariffVehicleView);
