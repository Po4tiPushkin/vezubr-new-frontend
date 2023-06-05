import React from 'react';
import { useObserver } from 'mobx-react';
import { TariffContext } from '../../context';
import { Ant } from '@vezubr/elements';
import DistanceAddDropdownContent from '../../form-components/distance/distance-add-dropdown-content';
import TariffLoaderDistance from '../../store/TariffLoaderDistance';
import DistanceRemoveDropdownContent from '../../form-components/distance/distance-remove-dropdown-content';
import TariffCost from '../../form-components/tariff-cost';

export default function useColumnDistance({ tableConfig, placeholders, client }) {
  const { store } = React.useContext(TariffContext);
  return useObserver(() => {
    const distanceCostsLength = store.distanceData.length;
    return {
      title: 'Оплата выезда за МКАД (км, р)',
      ...((store.editable && !store.isClone)
        ? {
            filterIcon: (filtered) => <Ant.Icon type="plus-circle" style={{ color: 'green' }} />,
            filterDropdown: ({ confirm }) => <DistanceAddDropdownContent confirm={confirm} />,
          }
        : {}),

      children: store.distanceData.map((distance, index) => {
        const key = TariffLoaderDistance.getKey(distance);
        return {
          title:`${distance.distance}` ,
          dataIndex: 'loader',
          key,
          ...(distanceCostsLength > 1 && store.editable
            ? {
                filterIcon: (filtered) => <Ant.Icon type="delete" style={{ color: 'red' }} title={'Удалить'} />,
                filterDropdown: ({ confirm }) => (
                  <DistanceRemoveDropdownContent distanceData={distance} confirm={confirm} />
                ),
              }
            : {}),

          width: tableConfig?.baseWorkWidth,
          render: (loader) => <TariffCost client={client} costField={loader.getDistance(key)} placeholders={{...placeholders, type: 'distance'}} />,
        };
      }),
    };
  });
}
