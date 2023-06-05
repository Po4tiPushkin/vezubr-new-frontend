import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { RouteContext } from '../../../context';
import { Ant } from '@vezubr/elements';

function RouteVehicleEditor(props) {
  const { vehicle } = props;

  const { store } = React.useContext(RouteContext);

  const availableVehicleTypeIds = store.availableVehicleTypeIds;

  const carOptions = React.useMemo(() => {
    return availableVehicleTypeIds.map((vehicleTypeId) => {
      const value = vehicleTypeId;
      const key = vehicleTypeId;
      const title = store.getVehicleTypeName(vehicleTypeId);
      return (
        <Ant.Select.Option key={key} value={value}>
          {title}
        </Ant.Select.Option>
      );
    });
  }, [availableVehicleTypeIds]);

  const update = React.useCallback(
    (vehicleTypeId) => {
      vehicle.setVehicleTypeId(vehicleTypeId);
      vehicle.tariff.clearError('tariffScale');
      vehicle.tariff.addDefaultVehicleIfNeed();
    },
    [vehicle],
  );

  return (
    <div>
      <Ant.Select
        value={'Добавить машину'}
        optionFilterProp={'children'}
        placeholder={'Добавить машину'}
        size={'small'}
        onChange={update}
        style={{ width: 200 }}
      >
        {carOptions}
      </Ant.Select>
    </div>
  );
}

RouteVehicleEditor.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(RouteVehicleEditor);
