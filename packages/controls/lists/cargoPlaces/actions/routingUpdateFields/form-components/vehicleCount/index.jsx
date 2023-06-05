import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';

function RouteVehicleCount(props) {
  const { vehicle } = props;

  const update = React.useCallback(
    (val) => {
      vehicle.setVehicleCount(val);
    },
    [vehicle],
  );

  return (
    <div>
      <Ant.InputNumber
        value={vehicle.vehicleCount}
        optionFilterProp={'children'}
        placeholder={'Кол-во ТС'}
        size={'small'}
        step={1}
        min={0}
        onChange={update}
        style={{ width: 120 }}
      />
    </div>
  );
}

RouteVehicleCount.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(RouteVehicleCount);
