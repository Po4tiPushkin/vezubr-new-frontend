import { IconDeprecated, LoaderFullScreen, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import { Drivers as DriversService, Common as CommonService } from '@vezubr/services';
import React, { useState, useCallback, useEffect } from 'react';
import DriverForm from '../../../forms/driver-form';
import { history } from '../../../infrastructure';
import { FormValidators } from '@vezubr/common/common'

const CLS = 'driver-form';

const DriverEdit = (props) => {
  const { match } = props;
  const [data, setData] = useState();
  const [countryList, setCountryList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const driverId = match.params.id;
        const response = await DriversService.info(driverId);
        const responseCountry = await CommonService.countryList({ itemsPerPage: 10000 });
        response.driver.linkedVehicles = response.linkedVehicles
        setCountryList(responseCountry.countries);
        setData(response.driver);
        setLoading(false);
      } catch (e) {
        showError(e);
        console.error(e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSave = useCallback(
    async (form, files, extraData) => {
      const driverId = match.params.id;
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      if (errors) {
        return;
      }
      setLoading(true);
      const validatedValues = FormValidators.ValidateFormDriver.validateDriverCreateFormValues(values);
      const submitting = {
        ...data,
        ...validatedValues,
        ...Object.entries(files).reduce((acc, [key, value]) => {
          if (!acc[key]) {
            if (value) {
              acc[key] = {
                fileHash: value.fileHash,
                fileId: value.fileId || value.id
              }
            } else {
              acc[key] = value
            }
          }
          return acc
        }, {}),
      };
      try {
        const r = await DriversService.update(driverId, submitting);
        if (Array.isArray(extraData?.vehicles) && extraData.vehicles.length) {
          await DriversService.setLinkedVehicles({ id: r.id, vehicles: extraData.vehicles })
        }
        setLoading(false);

        showAlert({
          title: 'Данные водителя успешно обновлены',
          onOk: () => {
            history.goBack();
          },
        });
      } catch (e) {
        showError(e);
        console.error(e);
        setLoading(false);
      }
    },
    [data],
  );

  return (
    <WhiteBox className={CLS}>
      {loading ? <LoaderFullScreen text={'Загрузка...'} /> : <></>}
      <Page.Title
        onBack={() => {
          history.goBack();
        }}
      >
        <div className="flexbox align-center">
          <IconDeprecated name={'wheelOrange'} />
          {'Редактирование водителя'}
        </div>
      </Page.Title>
      <DriverForm countryList={countryList} values={data} onSave={onSave} saveButtonText={'Сохранить изменения'}/>
    </WhiteBox>
  );
};


export default DriverEdit;
