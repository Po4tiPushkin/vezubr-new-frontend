import React from 'react';
import { useObserver } from 'mobx-react';
import cn from 'classnames';
import { TariffContext } from '../../context';
import TariffBodyTypesEditor from '../../form-components/tariff-body-types/tariff-body-types-editor';
import TariffBodyTypesView from '../../form-components/tariff-body-types/tariff-body-types-view';

export default function useColumnBodyType({ tableConfig }) {
  const { store } = React.useContext(TariffContext);

  return useObserver(() => ({
    title: 'Тип кузова',
    dataIndex: 'vehicle',
    className: cn('col-body-types'),
    key: 'bodyTypes',
    ...(tableConfig?.bodyTypesWidth
      ? {
          width: tableConfig.bodyTypesWidth,
        }
      : {}),

    render: (vehicle, record) => {
      const { vehicleTypeId } = record;

      return (
        <>
          {vehicleTypeId !== 0 && <TariffBodyTypesEditor disabled={store.isClone || !store.editable} vehicle={vehicle} />}
        </>
      );
    },
  }));
}
