import { IconDeprecated, LoaderFullScreen, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import { Loaders as LoadersService, Common as CommonService } from '@vezubr/services';
import React, { useState } from 'react';
import LoaderForm from '../../../forms/loader-form';
import { useHistory } from 'react-router-dom';
const CLS = 'loader-form';

const LoaderEdit = (props) => {
  const { match } = props;
  const history = useHistory();
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [countryList, setCountryList] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const loaderId = match.params.id;
        let response = await LoadersService.info(loaderId);
        const responseCountry = await CommonService.countryList({ itemsPerPage: 10000 });

        response.specialities = response.specialities?.map((item) => ({
          id: item,
          expiresOnDate:
            item == 'forklift_operator'
              ? response?.forkliftOperatorLicenceValidTill
              : item == 'stacker'
              ? response?.stackerLicenceValidTill
              : item == 'slinger'
              ? response?.slingerLicenceValidTill
              : null,
        }));
        setData(response);
        setCountryList(responseCountry.countries);
      } catch (e) {
        showError(e);
        console.error(e);
      }
      finally {
        setLoading(false)
      }
    };
    fetchData();
  }, []);

  const onSave = React.useCallback(
    async (form, files, extraData) => {
      const loaderId = match.params.id;
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      if (errors) {
        return;
      }
      setLoading(true);

      const submitting = {
        ...data,
        ...values,
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
        ...extraData
      };
      try {
        const r = await LoadersService.update(loaderId, submitting);

        showAlert({
          title: 'Данные специалиста успешно обновлены',
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
          <IconDeprecated name={'boxOrange'} />
          {'Редактирование специалиста'}
        </div>
      </Page.Title>
      <LoaderForm countryList={countryList} values={data} onSave={onSave} saveButtonText={'Сохранить изменения'} />
    </WhiteBox>
  );
};
export default LoaderEdit;
