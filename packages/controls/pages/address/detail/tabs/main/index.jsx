import React, { useCallback, useContext, useState } from 'react';
import AddressMainForm from '../../../../../forms/address/address-main-form';
import { Ant, showAlert, showError, VzForm } from '@vezubr/elements';
import { Address as AddressService } from '@vezubr/services';
import t from '@vezubr/common/localization';
import { connect } from 'react-redux';
import AddressContext from '../../context';
import { undecorateAddress, toDefaultUnits, toUnDefaultUnits } from '../../utils';

const AddressMain = (props) => {
  const { loadingTypes, addressTypes } = props;

  const { addressInfo, setAddressInfo, setMode, mode, commonCountError, reload, handleDelete, id } = useContext(
    AddressContext,
  );

  const formattedAddressInfo = toUnDefaultUnits(addressInfo);

  const handleEdit = useCallback(() => {
    setMode('edit');
  }, []);

  const handleSave = useCallback(
    async (form) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      const updatedAddressInfo = { ...addressInfo, ...values };
      const addressData = undecorateAddress({ ...updatedAddressInfo, id });

      if (errors !== null) {
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      const formattedAddressData = toDefaultUnits(addressData);

      setAddressInfo(updatedAddressInfo);
      delete formattedAddressData.contractorOwner;
      try {
        await AddressService.update(formattedAddressData);
        showAlert({
          content: t.common('Адрес был успешно обновлен'),
          onOk: () => {
            reload();
          },
        });
        setMode('view');
      } catch (e) {
        console.error(e);
        showError(e);
        VzForm.Utils.handleApiFormErrors(e, form);
      }
    },
    [reload, addressInfo],
  );

  const handleCancel = useCallback((form) => {
    form.resetFields();
    setMode('view');
  }, []);

  const onChange = useCallback(
    (values) => {
      setAddressInfo({ ...addressInfo, ...toDefaultUnits(values) });
    },
    [addressInfo],
  );

  return (
    <div>
      <AddressMainForm
        values={formattedAddressInfo}
        addressTypes={addressTypes.filter(addressType => addressType.id !== 4)}
        loadingTypes={loadingTypes}
        disabled={mode === 'view'}
        mode={mode}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={handleEdit}
        handleDelete={handleDelete}
        onChange={onChange}
        checkOnInit={true}
        delegated={APP === 'dispatcher' ? addressInfo?.contractorOwner?.delegated : false}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { dictionaries: { loadingTypes, addressTypes } = {} } = state;
  return {
    loadingTypes,
    addressTypes,
  };
};

export default connect(mapStateToProps)(AddressMain);
