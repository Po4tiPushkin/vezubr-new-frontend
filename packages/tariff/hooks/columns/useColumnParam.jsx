import React from 'react';
import { useObserver } from 'mobx-react';
import { TariffContext } from '../../context';
import TariffCost from '../../form-components/tariff-cost';
import TariffCarParam from '../../store/TariffCarParam';
import TariffTextTime from '../../form-components/tariff-text-time';

export default function useColumnsParam({ tableConfig, placeholders, client }) {
  const { store } = React.useContext(TariffContext);

  return useObserver(() => {
    return store.params.map((param) => {
      const key = TariffCarParam.getKey(param);
      return {
        title: param.title,
        dataIndex: 'vehicle',
        key,
        width: tableConfig?.serviceWidth,
        render: (vehicle) => <TariffTextTime costField={vehicle.getParam(key)} vehicle={vehicle} />,
      };
    });
  });
}
