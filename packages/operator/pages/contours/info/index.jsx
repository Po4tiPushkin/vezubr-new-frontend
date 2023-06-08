import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import { Contour as ContourService } from '@vezubr/services/index.operator';
import Utils from '@vezubr/common/common/utils';
import { Loader, showError, showAlert, VzForm, Page } from '@vezubr/elements';
import ContourForm from '@vezubr/controls/forms/contour-form';
const ContourInfo = (props) => {
  const { loadingMainData, match, history } = props;
  const { id } = match.params;
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

const goBack = () => {
  history.push('/contours');
};

  const onSubmit = React.useCallback(async (form) => {
    setSending(true);
    try {
      const startDate = Date.now();
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);
      if (errors !== null) {
        return;
      }
      const response = await ContourService.update({
        ...values,
        id,
      });
      setData(response?.data);
      showAlert({
        title: t.common('ОК'),
        message: t.common('Контур был успешно обновлен'),
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setSending(false);
  }, [id]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await ContourService.details({ contourId: id });
      setData(response?.data || {});
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoading(false);
  }, [id]);

  React.useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className={'contour-page'}>
      <div className={'contour-info'}>
        <div>
          <Page.Title onBack={() => goBack()}>
            ID: {data?.id} / {data?.title}
          </Page.Title>
        </div>
        {loading ? <Loader /> : <ContourForm values={data} onSave={onSubmit} loading={sending} />}
      </div>
    </div>
  );
}
export default ContourInfo;
