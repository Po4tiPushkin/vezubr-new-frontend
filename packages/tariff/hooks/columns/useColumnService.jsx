import React from 'react';
import { useObserver } from 'mobx-react';
import { TariffContext } from '../../context';
import TariffCost from '../../form-components/tariff-cost';
import TariffCarService from '../../store/TariffCarService';
import ServiceAddDropdownContent from '../../form-components/service/service-add-dropdown-content';
import ServiceRemoveDropdownContent from '../../form-components/service/service-remove-dropdown-content';
import { Ant } from '@vezubr/elements';

export default function useColumnService({ tableConfig, client }) {
  const { store } = React.useContext(TariffContext);
  const { placeholders } = store;
  return useObserver(() => {
    const serviceCostsLength = store.serviceData.length;
    return {
      title: 'Услуги',
      ...((store.editable)
        ? {
          filterIcon: (filtered) => <Ant.Icon type="plus-circle" style={{ color: 'green' }} />,
          filterDropdown: ({ confirm }) => <ServiceAddDropdownContent confirm={confirm} />,
        }
        : {}),

      children: store.serviceData.map((service, index) => {
        const key = TariffCarService.getKey(service);
        return {
          title: store.orderServices[service.article]?.name,
          dataIndex: 'vehicle',
          key,
          ...(store.editable
            ? {
              filterIcon: (filtered) => <Ant.Icon type="delete" style={{ color: 'red' }} title={'Удалить'} />,
              filterDropdown: ({ confirm }) => (
                <ServiceRemoveDropdownContent serviceData={service} confirm={confirm} />
              ),
            }
            : {}),

          width: tableConfig?.serviceWidth,
          render: (vehicle) => <TariffCost vehicle={vehicle} client={client} costField={vehicle.getService(key)} placeholders={{ ...placeholders, type: 'services' }} />,
        };
      }),
    };
    // title: 'Услуги',
    // children: store.services.map((service, index) => {
    //   const key = TariffCarService.getKey(service);
    //   return {
    //     title: service.title,
    //     dataIndex: 'vehicle',
    //     key,
    //     width: tableConfig?.serviceWidth,
    //     render: (vehicle) => <TariffCost client={client} placeholders={{ ...placeholders, type:'services' }}  costField={vehicle.getService(key)} vehicle={vehicle} />,
    //   };
    // }),
  });
}
