import useGoBack from '@vezubr/common/hooks/useGoBack';
import t from '@vezubr/common/localization';
import {
  Ant,
  IconDeprecated,
  VzForm,
  WhiteBoxDeprecated,
  WhiteBoxHeaderDeprecated,
  showAlert,
  showError,
} from '@vezubr/elements';
import { Address as AddressService, CargoPlace as CargoPlaceService } from '@vezubr/services';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { history } from '../../../infrastructure';

import CargoForm from '../../../forms/cargo-place/cargo-place-form';
import { undecorateCargoPlace } from '../utils';

const backUrlDefault = '/cargoPlaces/';

function CargoPlaceAdd(props) {
  const { cargoPlaceTypes, reverseCargoTypes, cargoPlaceStatuses } = useSelector((state) => state.dictionaries);
  const [cargoAddresses, setCargoAddresses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSource = await AddressService.list({ status: true, itemsPerPage: 10000 });
        setCargoAddresses(dataSource?.points);
      } catch (e) {
        console.error(e);
        showError(e);
      }
    };
    fetchData();
  }, []);

  const goBack = useGoBack({
    defaultUrl: '/cargoPlaces',
    location,
    history,
  });

  const handleCancel = useCallback(async () => {
    history.replace(backUrlDefault);
  }, []);

  const handleSave = useCallback(async (form) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }

    try {
      await CargoPlaceService.update(undecorateCargoPlace(values));
      showAlert({
        content: t.common('Грузоместо успешно создано'),
        title: t.common('ОК'),
        onOk: () => {
          history.replace(backUrlDefault);
        },
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  });

  return (
    <WhiteBoxDeprecated className={'extra-wide cargo-page-add margin-top-24'}>
      <WhiteBoxHeaderDeprecated className={'cargo-page-add__header'} icon={<IconDeprecated name={'ordersOrange'} />}>
        {' '}
        Создание ГМ:{' '}
      </WhiteBoxHeaderDeprecated>

      <CargoForm
        className="cargo-page-add__form"
        cargoPlaceTypes={cargoPlaceTypes}
        cargoPlaceStatuses={cargoPlaceStatuses}
        cargoAddresses={cargoAddresses}
        reverseCargoTypes={reverseCargoTypes}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </WhiteBoxDeprecated>
  );
}

export default CargoPlaceAdd;
