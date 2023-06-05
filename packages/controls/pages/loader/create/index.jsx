import { IconDeprecated, LoaderFullScreen, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import { Loaders as LoadersService, Common as CommonService } from '@vezubr/services';
import React, { useCallback, useState, useEffect } from 'react';
import LoaderForm from '../../../forms/loader-form';
import { useHistory } from 'react-router-dom';
const CLS = 'loader-form';

const LoaderCreate = (props) => {
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const [countryList, setCountryList] = useState([]);

  const onSave = React.useCallback(async (form, files, extraData) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors) {
      return;
    }

    const submitting = {
      ...values,
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
      ...extraData
    };

    try {
      setLoading(true);
      const r = await LoadersService.create(submitting);

      showAlert({
        title: 'Специалист был успешно создан',
        onOk: () => {
          history.goBack();
        },
      });
    } catch (e) {
      showError(e);
      console.error(e);
      VzForm.Utils.handleApiFormErrors(e, form);
    }
    finally {
      setLoading(false);
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
          <IconDeprecated name={'boxOrange'} />
          {'Новый специалист'}
        </div>
      </Page.Title>
      <LoaderForm countryList={countryList} onSave={onSave} />
    </WhiteBox>
  );
};

export default LoaderCreate;
