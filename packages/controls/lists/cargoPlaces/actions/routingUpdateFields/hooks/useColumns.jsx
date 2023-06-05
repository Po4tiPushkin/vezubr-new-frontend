import React, { useMemo } from 'react';
import { VzTable } from '@vezubr/elements';
import cn from "classnames";
import RouteVehicleCount from "../form-components/vehicleCount";
import RouteVehicleEndAt from "../form-components/vehicleEndAt";
import RouteVehicleStartAt from "../form-components/vehicleStartAt";
import VehicleActionRemove from "../form-components/vehicleType/action/tariff-vehicle-action-remove";
import TariffVehicleEditor from "../form-components/vehicleType/tariff-vehicle-editor";
import TariffVehicleView from "../form-components/vehicleType/tariff-vehicle-view";

function useColumns() {
  const columns = useMemo(
    () => [
      {
        title: 'Машина',
        dataIndex: 'vehicle',
        className: cn('col-vehicle', 'col-has-icon-action--left'),
        key: 'vehicleKey',
        fixed: 'left',
        width: 300,
        render: (vehicle, { vehicleTypeId }) => (
          <>
            {vehicleTypeId !== 0 && <VehicleActionRemove vehicle={vehicle} />}
            {vehicleTypeId === 0 ? <TariffVehicleEditor vehicle={vehicle} /> : <TariffVehicleView vehicle={vehicle} />}
          </>
        )
      },
      {
        title: 'Кол-во ТС',
        dataIndex: 'vehicle',
        className: cn('col-body-types'),
        key: 'vehicleCount',
        width: 150,
        render: (vehicle, { vehicleTypeId }) => (
          vehicleTypeId !== 0 && <RouteVehicleCount vehicle={vehicle} />
        )
      },
      {
        title: 'Смена работы с ',
        width: 250,
        dataIndex: 'vehicle',
        key: 'vehicleStartAt',
        render: (vehicle, { vehicleTypeId }) => (
          vehicleTypeId !== 0 && <RouteVehicleStartAt vehicle={vehicle} />
        )
      },
      {
        title: 'Смена работы до ',
        width: 250,
        dataIndex: 'vehicle',
        key: 'vehicleEndAt',
        render: (vehicle, { vehicleTypeId }) => (
          vehicleTypeId !== 0 && <RouteVehicleEndAt vehicle={vehicle} />
        )
      },
    ],
    [],
  );
  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
