import React from 'react';
import { useObserver } from 'mobx-react';
import cn from 'classnames';
import VehicleActionRemove from '../../form-components/vehicle/action/tariff-vehicle-action-remove';
import TariffVehicleEditor from '../../form-components/vehicle/tariff-vehicle-editor';
import TariffVehicleView from '../../form-components/vehicle/tariff-vehicle-view';
import { TariffContext } from '../../context';

export default function useColumnVehicle({ tableConfig }) {
  const { store } = React.useContext(TariffContext);

  return useObserver(() => ({
    title: 'Машина',
    dataIndex: 'vehicle',
    className: cn('col-vehicle', { 'col-has-icon-action--left': store.editable }),
    key: 'vehicleKey',

    ...(tableConfig?.vehicleWidth
      ? {
          fixed: 'left',
          width: tableConfig.vehicleWidth,
        }
      : {}),

    render: (vehicle, record) => {
      const { vehicleTypeId } = record;

      return (
        <>
          {store.editable && vehicleTypeId !== 0 && <VehicleActionRemove vehicle={vehicle} />}
          {vehicleTypeId === 0 ? <TariffVehicleEditor vehicle={vehicle} /> : <TariffVehicleView vehicle={vehicle} />}
        </>
      );
    },
  }));
}
