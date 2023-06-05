import { IconDeprecated, LoaderFullScreen, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import React, { useState, useCallback } from 'react';
import { Vehicle as VehicleService } from '@vezubr/services';
import TransportForm from '../../../forms/transport-form';
import { FormValidators } from '@vezubr/common/common'
import t from '@vezubr/common/localization';
import { history, store } from '../../../infrastructure';
import { useSelector } from 'react-redux';
const CLS = 'transport-form';

const TransportCreate = (props) => {

  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user)

  const onSave = useCallback(async (form, files, extraData) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors) {
      return;
    }
    if (values.vin === '') {
      delete values.vin
    }
    if (values.volume === '') {
      delete values.volume;
    }
    const validatedValues = FormValidators.ValidateFormTransport.validateTransportCreateFormValues(values, extraData)
    const submitting = {
      createVehicle: true,
      ...validatedValues,
      ...Object.entries(files).reduce((acc, [key, value]) => {
        if (!acc[key]) {
          if (value) {
            acc[key] = {
              fileHash: value.fileHash,
              fileId: value.fileId
            }
          } else {
            acc[key] = value
          }
        }
        return acc
      }, {}),
    };
    submitting.photoFiles = []
    if (files.photo) {
      submitting.photoFiles[0] = { fileHash: files.photo.fileHash, fileId: files.photo.fileId }
    }
    if (files.photoRightSide) {
      submitting.photoFiles[1] = { fileHash: files.photoRightSide.fileHash, fileId: String(files.photoRightSide.fileId) }
    }
    if (files.photoLeftSide) {
      submitting.photoFiles[2] = { fileHash: files.photoLeftSide.fileHash, fileId: String(files.photoLeftSide.fileId) }
    }
    try {
      setLoading(true);
      const r = await VehicleService.create(submitting);
      setLoading(false);

      showAlert({
        title: 'ТС было успешно создано',
        onOk: () => {
          history.push(`/transports/${r.id}`);
        },
      });
      if (!user?.vehiclesAdded) {
        store.dispatch({ type: 'SET_USER', user: { ...user, vehiclesAdded: true } });
      }
    } catch (e) {
      setLoading(false);
      showError(e);
      console.error(e);
    }
  }, []);

  return (
    <WhiteBox className={CLS}>
      {loading ? <LoaderFullScreen text={'Загрузка...'} /> : <></>}
      <Page.Title
        onBack={() => {
          history.goBack();
        }}
      >
        <div className="flexbox align-center">
          <IconDeprecated name={'orderTypeDeliveryOrange'} />
          {t.order('newTransport')}
        </div>
      </Page.Title>
      <TransportForm onSave={onSave} />
    </WhiteBox>
  );
};

export default TransportCreate;
