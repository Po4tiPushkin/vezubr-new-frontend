import React from 'react';
import { useObserver } from 'mobx-react';
import { TariffContext } from '../../context';
import TariffCost from '../../form-components/tariff-cost';
import TariffCarService from '../../store/TariffCarService';

export default function useColumnsMainService({ tableConfig, placeholders, client }) {
  const { store } = React.useContext(TariffContext);

  return useObserver(() => {
    return store.mainServices.map((service) => {
      const key = TariffCarService.getKey(service);
      return {
        title: service.title,
        dataIndex: 'vehicle',
        key,
        width: tableConfig?.serviceWidth,
        render: (vehicle) => <TariffCost client={client} placeholders = {{ ...store.placeholders, type: "services" }} costField={vehicle.getService(key)} vehicle={vehicle} />,
      };
    });
  });
}
