import { IconDeprecated, LoaderFullScreen, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import { Tractor as TractorService } from '@vezubr/services';
import React from 'react';
import TractorForm from '../../../forms/tractor-form';
import { history } from '../../../infrastructure';

const CLS = 'tractor-form';

const TractorEdit = (props) => {
  const { match } = props;
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tractorId = match.params.id;
        const response = await TractorService.info(tractorId);
        response.tractor.linkedDrivers = Object.values(response.linkedDrivers).map(el => el.driver);
        setData(response.tractor);
        setLoading(false);
      } catch (e) {
        showError(e);
        console.error(e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSave = React.useCallback(
    async (form, files, extraData) => {
      const tractorId = match.params.id;
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      if (errors) {
        return;
      }
      if (values.vin === '') {
        delete values.vin
      }
      setLoading(true);
      delete data.linkedDrivers;
      const submitting = {
        ...data,
        ...values,
        ...extraData,
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
      if (files.photo) {
        submitting.photoFiles = [{ fileHash: files.photo.fileHash, fileId: files.photo.fileId || files.photo.id }]
      }
      try {
        const r = await TractorService.update({id: tractorId, data: submitting});
        setLoading(false);

        showAlert({
          title: 'Данные тягача успешно обновлены',
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
          <IconDeprecated name={'orderTypeDeliveryOrange'} />
          {'Редактирование тягача'}
        </div>
      </Page.Title>
      <TractorForm values={data} onSave={onSave} saveButtonText={'Сохранить изменения'}/>
    </WhiteBox>
  );
};

export default TractorEdit;
