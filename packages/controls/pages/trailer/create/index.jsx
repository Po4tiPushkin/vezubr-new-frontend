import { IconDeprecated, LoaderFullScreen, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import React, { useState, useCallback } from 'react';
import { Vehicle as VehicleService, Trailer as TrailerService } from '@vezubr/services';
import TrailerForm from '../../../forms/trailer-form';
import { FormValidators } from '@vezubr/common/common'
import t from '@vezubr/common/localization';
import { history } from '../../../infrastructure';
const CLS = 'trailer-form';

const TrailerCreate = (props) => {
  const [loading, setLoading] = useState(false);

  const onSave = useCallback(async (form, files, extraData) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors) {
      return;
    }
    if (values.vin === '') {
      delete values.vin
    }
    const validatedValues = FormValidators.ValidateFormTrailer.validateTrailerCreateFormValues(values, extraData)
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
    if (files.photoRightSide) {
      submitting.photoFiles[1] = { fileHash: files.photoRightSide.fileHash, fileId: String(files.photoRightSide.fileId) }
    }
    if (files.photoLeftSide) {
      submitting.photoFiles[2] = { fileHash: files.photoLeftSide.fileHash, fileId: String(files.photoLeftSide.fileId) }
    }
    try {
      setLoading(true);
      const r = await TrailerService.create(submitting);
      setLoading(false);

      showAlert({
        title: 'Полуприцеп был успешно создан',
        onOk: () => {
          history.push(`/trailers/${r.id}`);
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
          {'Новый Полуприцеп'}
        </div>
      </Page.Title>
      <TrailerForm onSave={onSave} />
    </WhiteBox>
  );
};

export default TrailerCreate;
