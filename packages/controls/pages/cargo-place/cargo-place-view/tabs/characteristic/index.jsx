import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CargoContextView } from '../../context';
import { CargoPlace as CargoPlaceService } from '@vezubr/services';
import { Ant, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import t from '@vezubr/common/localization';

import CargoForm from '../../../../../forms/cargo-place/cargo-place-form';
import { undecorateCargoPlace } from '../../../utils';

const CLS = 'cargo-page-view';

function Characteristic(props) {
  const { store, id, onDelete, cargoAddresses, mode, setMode, addressesForm, setAddressesForm } =
    useContext(CargoContextView);
  const { cargoPlaceTypes, reverseCargoTypes, cargoPlaceStatuses } = useSelector((state) => state.dictionaries);

  const { data } = store;
  const handleSave = useCallback(
    async (form) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      if (errors !== null) {
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }
      try {
        const sourceData = { ...data, ...values, id, ...addressesForm };
        const cargoData = undecorateCargoPlace(sourceData);
        await CargoPlaceService.update(cargoData);
        store.setDirtyData(cargoData);
        setMode('view');
        showAlert({
          content: t.common('Характеристики грузоместа обновлены'),
        });
      } catch (e) {
        console.error(e);
        setMode('view');
        showError(e);
      }
    },
    [id, data, addressesForm],
  );

  const handleEdit = useCallback(() => {
    setMode('edit');
  }, []);

  const handleCancel = useCallback((form) => {
    form.resetFields();
    setMode('view');
  }, []);

  return (
    <div className={'cargo-view-tab-characteristic cargo-view-main-info'}>
      <CargoForm
        values={data}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onDelete={onDelete}
        disabled={mode === 'view'}
        mode={mode}
        cargoPlaceTypes={cargoPlaceTypes}
        reverseCargoTypes={reverseCargoTypes}
        cargoAddresses={cargoAddresses}
        cargoPlaceStatuses={cargoPlaceStatuses}
      />
    </div>
  );
}

export default Characteristic;
