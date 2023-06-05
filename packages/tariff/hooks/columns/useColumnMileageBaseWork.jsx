import React from 'react';
import { useObserver } from 'mobx-react';
import { TariffContext } from '../../context';
import { Ant } from '@vezubr/elements';
import MileageBaseWorkAddDropdownContent from '../../form-components/mileageBaseWork/mileageBW-add-dropdown-content';
import TariffCarBaseWorksMileage from '../../store/TariffCarBWMileage';
import MileageBaseWorkRemoveContent from '../../form-components/mileageBaseWork/mileageBW-remove-dropdown-content';
import TariffInputNumberSubValue from '../../form-components/tariff-input-number-sub-value';
export default function useColumnMileageBaseWork({ tableConfig, }) {
  const { store } = React.useContext(TariffContext);
  return useObserver(() => {
    const baseWorksCostsLength = store.baseWorks.length;
    return {
      title: 'Минимальная стоимость, ₽',
      ...((store.editable)
        ? {
          filterIcon: (filtered) => <Ant.Icon type="plus-circle" style={{ color: 'green' }} />,
          filterDropdown: ({ confirm }) => <MileageBaseWorkAddDropdownContent confirm={confirm} />,
        }
        : {}),

      children: store.baseWorks.map(el => {
        const key = TariffCarBaseWorksMileage.getKey(el);
        return {
          title: `${el.cost}`,
          dataIndex: 'vehicle',
          key,
          ...(baseWorksCostsLength > 1 && store.editable
            ? {
              filterIcon: (filtered) => <Ant.Icon type="delete" style={{ color: 'red' }} title={'Удалить'} />,
              filterDropdown: ({ confirm }) => (
                <MileageBaseWorkRemoveContent cost={el.cost} confirm={confirm} />
              ),
            }
            :
            {}),
          children: [
            {
              title: 'Пробег, км',
              dataIndex: 'vehicle',
              key: `${el.cost}-mileage`,
              render: (vehicle) => <TariffInputNumberSubValue
                getValue={() => vehicle.getMileageBW(key).getValue('mileage')}
                setValue={(e) => vehicle.getMileageBW(key).setValue('mileage', e)}
                getError={() => vehicle.getMileageBW(key).getError('mileage')}
              />
            },
            {
              title: 'Адресов, шт',
              dataIndex: 'vehicle',
              key: `${el.cost}-pointsCount`,
              render: (vehicle) => <TariffInputNumberSubValue
                getValue={() => vehicle.getMileageBW(key).getValue('pointsCount')}
                setValue={(e) => vehicle.getMileageBW(key).setValue('pointsCount', e)}
                getError={() => vehicle.getMileageBW(key).getError('pointsCount')}
              />
            },
            {
              title: 'Простой на всех точках, мин',
              dataIndex: 'vehicle',
              key: `${el.cost}-workMinutes`,
              render: (vehicle) => <TariffInputNumberSubValue
                getValue={() => vehicle.getMileageBW(key).getValue('workMinutes')}
                setValue={(e) => vehicle.getMileageBW(key).setValue('workMinutes', e)}
                getError={() => vehicle.getMileageBW(key).getError('workMinutes')}
              />
            },
          ]
        }
      })
    };
  });
}