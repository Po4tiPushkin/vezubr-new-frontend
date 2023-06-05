import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';

function RouteVehicleStartAt(props) {
  const { vehicle } = props;

  const update = React.useCallback(
    (val) => {
      vehicle.setVehicleStartAt(val);
    },
    [vehicle],
  );

  return (
    <div>
      <Ant.DatePicker
        value={vehicle.vehicleStartAt}
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

RouteVehicleStartAt.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(RouteVehicleStartAt);
