import React, { useMemo, useCallback } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import { TariffContext } from '../../context';
import TariffCitiesElement from './elements/city';
import { useObserver } from 'mobx-react';
import { uuid } from '@vezubr/common/utils';

const getNewCity = () => ({
  cityName: '',
  guid: uuid(),
  isNew: true,
});

function TariffCities({ disabled }) {
  const { store } = React.useContext(TariffContext);
  const cities = useObserver(() => store.cities);

  React.useEffect(() => {
    if (store?.editable && !disabled && !cities.find((item) => item.isNew)) {
      let newCities = [...cities];
      if (newCities.length < 2) {
        newCities.push(getNewCity());
      } else {
        newCities.splice(newCities.length - 1, 0, getNewCity());
      }
      store.setCities(newCities);
    }
  }, [cities]);

  const getDescCity = useCallback(
    (index) => {
      if (index === 0) {
        return 'Город отправления';
      } else if (index === cities.length - 1) {
        return 'Город прибытия';
      }

      return 'Промежуточный город';
    },
    [cities],
  );

  const onCitySelect = useCallback(
    (value, index) => {
      let newCities = [...cities];
      newCities[index] = {
        ...newCities[index],
        cityName: value,
        isNew: false,
      };
      if (!newCities.find((item) => item.isNew)) {
        if (newCities.length < 2) {
          newCities.push(getNewCity());
        } else {
          newCities.splice(newCities.length - 1, 0, getNewCity());
        }
      }
      store.setCities(newCities);
    },
    [cities],
  );

  const citiesRender = useMemo(() => {
    return 
  });

  return (
    <div className={'tariff-cities'}>
      <VzForm.Row>
        {cities.map((el, index) => {
          return (
            <VzForm.Col span={24} key={el.guid}>
              <VzForm.Item label={getDescCity(index)} key={el.guid}>
                <TariffCitiesElement
                  {...{
                    key: el.guid,
                    filterDataSource: (data) =>
                      ([4, 6].includes(parseInt(data.data.data.fias_level)) ||
                        data.value === 'г Москва' ||
                        data.value === 'г Санкт-Петербург') &&
                      !cities.find((el) => el.cityName == data.value),
                    disabled: !store?.editable || disabled,
                    ...{
                      [!store?.editable || disabled ? 'value' : 'defaultValue']: el.cityName,
                    },
                    onSelect: (value) => onCitySelect(value, index),
                    type: 'address',
                    timer: 500,
                  }}
                />
              </VzForm.Item>
            </VzForm.Col>
          );
        })}
      </VzForm.Row>
    </div>
  );
}

export default TariffCities;
