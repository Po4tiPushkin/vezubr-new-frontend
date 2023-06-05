import { IconDeprecated, LoaderFullScreen, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import React, { useState, useCallback } from 'react';
import { Tractor as TractorService, Vehicle as VehicleService } from '@vezubr/services';
import TractorForm from '../../../forms/tractor-form';
import { history } from '../../../infrastructure';
import { useSelector } from 'react-redux';
const CLS = 'tractor-form';

const TractorCreate = (props) => {
  const user = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);

  const onSave = useCallback(async (form, files, extraData) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors) {
      return;
    }
    if (values.vin === '') {
      delete values.vin
    }
    const submitting = {
      createVehicle: true,
      ...values,
      ...extraData,
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
    if (files.photo) {
      submitting.photoFiles = [{ fileHash: files.photo.fileHash, fileId: files.photo.fileId }]
    }
    try {
      setLoading(true);
      const r = await TractorService.create({ id: user?.id, data: submitting });
      setLoading(false);

      showAlert({
        title: 'Тягач был успешно создан',
        onOk: () => {
          history.push(`/tractors/${r.tractorId}`);
        },
      });
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
          {'Новый тягач'}
        </div>
      </Page.Title>
      <TractorForm onSave={onSave}/>
    </WhiteBox>
  );
};

export default TractorCreate;
