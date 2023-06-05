import { IconDeprecated, LoaderFullScreen, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Vehicle as VehicleService, Trailer as TrailerService } from '@vezubr/services';
import TrailerForm from '../../../forms/trailer-form';
import { FormValidators } from '@vezubr/common/common'
import t from '@vezubr/common/localization';
import { history } from '../../../infrastructure';
const CLS = 'trailer-form';

const disabledFields = [
  'markAndModel',
  'yearOfManufacture'
]


const TrailerEdit = (props) => {
  const { match } = props;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const dictionaries = useSelector((state) => state.dictionaries);
  const onSave = useCallback(async (form, files, extraData) => {
    const trailerId = match.params.id;
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
              fileHash: value.fileHash || value.file?.fileHash,
              fileId: value?.file?.id || value.fileId || value.id
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
      submitting.photoFiles[1] = { fileHash: files.photoRightSide.fileHash, fileId: String(files.photoRightSide.fileId || files.photoRightSide.id) }
    }
    if (files.photoLeftSide) {
      submitting.photoFiles[2] = { fileHash: files.photoLeftSide.fileHash, fileId: String(files.photoLeftSide.fileId || files.photoLeftSide.id) }
    }
    try {
      setLoading(true);
      const r = await TrailerService.update({ id: trailerId, data: submitting });
      setLoading(false);

      showAlert({
        title: 'Полуприцеп успешно обновлен',
        onOk: () => {
          history.push(`/trailers/${r.id}`);
        },
      });
    } catch (e) {
      setLoading(false);
      showError(e);
      console.error(e);
    }
  }, [match]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const trailerId = match.params.id;
      const response = await TrailerService.info(trailerId);
      const values = FormValidators.ValidateFormTrailer.reformatTrailerEditFormValues(response, dictionaries);
      setData(values);
    } catch (e) {
      console.error(e);
      showError(e);
    }
    finally {
      setLoading(false)
    }
  }, [dictionaries]);

  useEffect(() => {
    fetchData()
  }, [])

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
          {`Редактирование Полуприцепа ${match.params.id}`}
        </div>
      </Page.Title>
      <TrailerForm disabledFields={disabledFields} saveButtonText={'Сохранить изменения'} values={data} onSave={onSave} />
    </WhiteBox>
  );
};

export default TrailerEdit;
