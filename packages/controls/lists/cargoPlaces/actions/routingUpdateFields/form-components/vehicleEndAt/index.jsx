import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';

function RouteVehicleEndAt(props) {
  const { vehicle } = props;

  const update = React.useCallback(
    (val) => {
      vehicle.setVehicleEndAt(val);
    },
    [vehicle],
  );

  return (
    <div>
      <Ant.DatePicker
        value={vehicle.vehicleEndAt}
        placeholder={'дд.мм.гггг'}
        allowClear={true}
        size={'small'}
        format={"DD-MM-YYYY HH:mm"}
        showTime
        onChange={update}
      />
    </div>
  );
}

RouteVehicleEndAt.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(RouteVehicleEndAt);
