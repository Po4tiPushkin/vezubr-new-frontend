import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { RouteContext } from './context';

function RouteTableRow({ className: classNameInput, ...props }) {
  const { store } = React.useContext(RouteContext);

  const vehicleKey = props['data-row-key'];
  const vehicleError = store.editable && store.getVehicleError(vehicleKey);

  const className = cn(classNameInput, { 'vehicle-has-error': vehicleError });

  return <tr {...props} className={className} />;
}

export default observer(RouteTableRow);
