import React from 'react';
import { useObserver } from 'mobx-react';
import { TariffContext } from '../../context';
import TariffCost from '../../form-components/tariff-cost';
import TariffLoaderService from '../../store/TariffLoaderService';

export default function useColumnLoaderService({ tableConfig, client, placeholders }) {
  const { store } = React.useContext(TariffContext);

  return useObserver(() => ({
    title: 'Услуги',
    children: store.services.map((service, index) => {
      const key = TariffLoaderService.getKey(service);
      return {
        title: service.title,
        dataIndex: 'loader',
        key,
        width: tableConfig?.serviceWidth,
        render: (loader) => <TariffCost client={client} placeholders={{ ...placeholders, type:'services' }}  costField={loader.getService(key)} />,
      };
    }),
  }));
}
