import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { TariffContext } from '../../context';

function TariffTableRow({ className: classNameInput, ...props }) {
  const { store } = React.useContext(TariffContext);

  const vehicleKey = props['data-row-key'];
  const loaderKey = props['data-row-key'];
  const vehicleError = store.editable && store.getVehicleError(vehicleKey);
  const loaderError = store.editable && store.type === 2 && store.getLoaderError(loaderKey);
  const className = cn(classNameInput, { 'vehicle-has-error': store.type === 2 ? loaderError : vehicleError });

  return <tr {...props} className={className} />;
}

export default observer(TariffTableRow);
