import { IconDeprecated, LoaderFullScreen, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import { Drivers as DriversService, Common as CommonService } from '@vezubr/services';
import React, { useState, useCallback, useEffect } from 'react';
import DriverForm from '../../../forms/driver-form';
import { history, store } from '../../../infrastructure';
import { FormValidators } from '@vezubr/common/common';
import { useSelector } from 'react-redux';
const CLS = 'driver-form';

const DriverCreate = (props) => {

  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user)
  const [countryList, setCountryList] = useState([]);
  const onSave = useCallback(async (form, files, extraData) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors) {
      return;
    }
    const validatedValues = FormValidators.ValidateFormDriver.validateDriverCreateFormValues(values, extraData);
    const submitting = {
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

    try {
      setLoading(true);
      const r = await DriversService.create(submitting);
      if (Array.isArray(extraData?.vehicles) && extraData.vehicles.length) {
        await DriversService.setLinkedVehicles({ id: r.id, vehicles: extraData.vehicles })
      }
      setLoading(false);

      showAlert({
        title: 'Водитель был успешно создан',
        onOk: () => {
          history.goBack();
        },
      });
      if (!user?.driversAdded) {
        store.dispatch({ type: 'SET_USER', user: { ...user, driversAdded: true } });
      }
    } catch (e) {
      setLoading(false);
      showError(e);
      console.error(e);
    }
  }, []);

  const fetchCountryList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await CommonService.countryList({ itemsPerPage: 10000 });
      setCountryList(response.countries);
    } catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchCountryList();
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
          <IconDeprecated name={'wheelOrange'} />
          {'Новый водитель'}
        </div>
      </Page.Title>
      <DriverForm countryList={countryList} onSave={onSave} />
    </WhiteBox>
  );
};

export default DriverCreate;
