import React, { useCallback, useContext } from 'react';
import AddressContactForm from '../../../../../forms/address/address-contacts-form';
import { Ant, showAlert, showError, VzForm } from '@vezubr/elements';
import { Address as AddressService } from '@vezubr/services';
import t from '@vezubr/common/localization';
import AddressContext from '../../context';
import { undecorateAddress } from '../../utils';

const AddressContacts = () => {
  const { addressInfo, setMode, setAddressInfo, mode, commonCountError, reload, id } = useContext(AddressContext);

  const handleEdit = useCallback(() => {
    setMode('edit');
  }, []);

  const handleCancel = useCallback((form) => {
    form.resetFields();
    setMode('view');
  }, []);

  const onChange = useCallback((form, values) => {
    const contacts = [{...values}];
    setAddressInfo({...addressInfo, contacts});
  }, [addressInfo.contacts, addressInfo])

  const handleSave = useCallback(
    async (form) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      const contacts = [...addressInfo.contacts];
      contacts[0] = { ...addressInfo.contacts[0], ...values };

      const updatedContactsInfo = { ...addressInfo, contacts };
      const addressData = undecorateAddress({ ...updatedContactsInfo, id });

      if (errors !== null) {
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      setAddressInfo(updatedContactsInfo);
      delete addressData.contractorOwner;
      try {
        await AddressService.update(addressData);
        showAlert({
          content: t.common('Адрес был успешно обновлен'),
          onOk: () => {
            reload();
          },
        });
        setMode('view');
      } catch (e) {
        console.error(e);
        showError(null, { content: <pre>{JSON.stringify(e, null, 2)}</pre> });
      }
    },
    [addressInfo, reload],
  );

  return (
    <div>
      <AddressContactForm
        values={addressInfo?.contacts?.[0]}
        mode={mode}
        disabled={mode === 'view'}
        onSave={handleSave}
        onCancel={handleCancel}
        onEdit={handleEdit}
        onChange={onChange}
        checkOnInit={true}
        delegated={APP === 'dispatcher' ? addressInfo?.contractorOwner?.delegated : false}
      />
    </div>
  );
};

export default AddressContacts;
