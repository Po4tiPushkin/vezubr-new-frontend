import React from 'react';
import { useObserver } from 'mobx-react';
import cn from 'classnames';
import { TariffContext } from '../../context';
import TariffLoaderView from '../../form-components/loader/tariff-loader-view';
import VehicleActionRemove from '../../form-components/vehicle/action/tariff-vehicle-action-remove';
import TariffLoaderEditor from '../../form-components/loader/tariff-loader-editor';
export default function useColumnLoader({ tableConfig }) {
  const { store } = React.useContext(TariffContext);

  return useObserver(() => ({
    title: 'Тип исполнителя',
    dataIndex: 'loader',
    className: cn('col-vehicle', { 'col-has-icon-action--left': store.editable }),
    key: 'loaderKey',
    ...(tableConfig?.vehicleWidth
      ? {
        fixed: 'left',
        width: tableConfig.vehicleWidth,
      }
      : {}),

    render: (loader, record) => {
      const { speciality } = record;
      return (
        <>
          {store.editable && speciality !== -1 && <VehicleActionRemove vehicle={loader} />}
          {speciality === -1 ? <TariffLoaderEditor loader={loader} /> : <TariffLoaderView loader={loader} />}
        </>
      );
    },
  }));
}