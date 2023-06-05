import React, { useCallback, useRef, useState } from 'react';
import { Ant, ButtonDeprecated, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { connect } from 'react-redux';
import { Address as AddressService } from '@vezubr/services';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import { history } from '../../../infrastructure';

import AddressMainForm from '../../../forms/address/address-main-form';
import AddressContactForm from '../../../forms/address/address-contacts-form';

import { undecorateDataForCreateAddress } from '../detail/utils';

const backUrlDefault = '/addresses/';

function AddressesAdd({ loadingTypes, addressTypes }) {
  const { location } = history;
  const goBack = useGoBack({
    defaultUrl: '/addresses',
    location,
    history,
  });

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const handleCancel = useCallback(async () => {
    goBack();
  }, [goBack]);

  const formInfoRef = useRef(null);
  const formContactsRef = useRef(null);

  const handleSave = useCallback(async (form) => {
    const { values: valuesInfo, errors: errorsInfo } = await VzForm.Utils.validateFieldsFromAntForm(
      formInfoRef.current,
    );
    const { values: valuesContacts, errors: errorsContacts } = await VzForm.Utils.validateFieldsFromAntForm(
      formContactsRef.current,
    );

    if (errorsInfo || errorsContacts) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }
    const dataSave = undecorateDataForCreateAddress({ ...valuesInfo, contacts: [valuesContacts] });

    try {
      setLoading(true)
      await AddressService.update(dataSave);
      showAlert({
        content: t.common('Адрес успешно создан'),
        title: t.common('ОК'),
        onOk: () => {
          history.replace(backUrlDefault);
        },
        onCancel: () => {
          history.replace(backUrlDefault);
        }
      });
    } catch (e) {
      console.error(e);
      showError(e);
      VzForm.Utils.handleApiFormErrors(e, formInfoRef.current);
      VzForm.Utils.handleApiFormErrors(e, formContactsRef.current);
    } finally {
      setLoading(false);
    }
  }, []);

  const onChange = useCallback(async (values) => {
    setValues(values)
  }, []);

  return (
    <div className={'address-page-add'}>
      <Page.Title onBack={goBack} icon={<Ant.Icon type={'form'} />}>
        Создание адреса
      </Page.Title>

      <WhiteBox className={'address-page-add__body clearfix'}>
        <WhiteBox.Header type={'h1'} icon={<Ant.Icon type={'form'} />} iconStyles={{ color: '#F57B23' }}>
          Новый адрес
        </WhiteBox.Header>

        <AddressMainForm
          addressTypes={addressTypes.filter(addressType => addressType.id !== 4)}
          onInit={(form) => {
            formInfoRef.current = form;
          }}
          loadingTypes={loadingTypes}
          onChange={onChange}
          values={values}
        />

        <WhiteBox.Header type={'h2'} icon={<Ant.Icon type={'audit'} />} iconStyles={{ color: '#F57B23' }}>
          Контакты
        </WhiteBox.Header>

        <AddressContactForm
          onInit={(form) => {
            formContactsRef.current = form;
          }}
        />

        <VzForm.Actions>
          <ButtonDeprecated onClick={handleCancel} className={'semi-wide margin-left-16'} theme={'primary'}>
            Отмена
          </ButtonDeprecated>

          <ButtonDeprecated loading={loading} onClick={handleSave} className={'semi-wide margin-left-16'} theme={'primary'}>
            Добавить
          </ButtonDeprecated>
        </VzForm.Actions>
      </WhiteBox>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { dictionaries: { loadingTypes, addressTypes } = {} } = state;
  return {
    loadingTypes,
    addressTypes,
  };
};

export default connect(mapStateToProps)(AddressesAdd);
