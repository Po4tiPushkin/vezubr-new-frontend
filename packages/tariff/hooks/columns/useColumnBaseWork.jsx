import React from 'react';
import { useObserver } from 'mobx-react';
import { TariffContext } from '../../context';
import { Ant } from '@vezubr/elements';
import BaseWorkAddDropdownContent from '../../form-components/baseWork/base-work-add-dropdown-content';
import TariffCarBaseWork from '../../store/TariffCarBaseWork';
import BaseWorkRemoveDropdownContent from '../../form-components/baseWork/base-work-remove-dropdown-content';
import TariffCost from '../../form-components/tariff-cost';

export default function useColumnBaseWork({ tableConfig, client }) {
  const { store } = React.useContext(TariffContext);
  return useObserver(() => {
    const baseWorksLength = store.baseWorks.length;
    return {
      title: 'Работа в часах (минималка)',
      ...((store.editable && !store.isClone)
        ? {
          filterIcon: (filtered) => <Ant.Icon type="plus-circle" style={{ color: 'green' }} />,
          filterDropdown: ({ confirm }) => <BaseWorkAddDropdownContent confirm={confirm} />,
        }
        : {}),

      children: store.baseWorks.map((baseWork, index) => {
        const key = TariffCarBaseWork.getKey(baseWork);
        return {
          title: `${baseWork.hoursWork} + ${baseWork.hoursInnings}`,
          dataIndex: 'vehicle',
          key,
          ...(baseWorksLength > 1 && store.editable
            ? {
              filterIcon: (filtered) => <Ant.Icon type="delete" style={{ color: 'red' }} title={'Удалить'} />,
              filterDropdown: ({ confirm }) => (
                <BaseWorkRemoveDropdownContent baseWorkData={baseWork} confirm={confirm} />
              ),
            }
            : {}),

          width: tableConfig?.baseWorkWidth,
          render: (vehicle) => <TariffCost client={client} costField={vehicle.getBaseWork(key)} placeholders={{ ...store.placeholders, type: 'baseWorks' }} vehicle={vehicle} />,
        };
      }),
    };
  });
}
