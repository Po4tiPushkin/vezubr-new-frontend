import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { TariffContext } from '../../../context';
import { Ant } from '@vezubr/elements';

function TariffVehicleEditor(props) {
  const { vehicle } = props;

  const { store } = React.useContext(TariffContext);

  const availableVehicleTypeIds = store.availableVehicleTypeIds;

  const carOptions = React.useMemo(() => {
    return availableVehicleTypeIds.map((vehicleTypeId) => {
      const value = vehicleTypeId;
      const key = vehicleTypeId;
      const title = store.getVehicleTypeName(vehicleTypeId);
      return (
        <Ant.Select.Option label={title} key={key} value={value}>
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
      {!store.isClone && <Ant.Select
        value={'Добавить машину'}
        optionFilterProp={'children'}
        placeholder={'Добавить машину'}
        size={'small'}
        onChange={update}
        style={{ width: 200 }}
        showSearch={true}
      >
        {carOptions}
      </Ant.Select>}
    </div>
  );
}

TariffVehicleEditor.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(TariffVehicleEditor);
