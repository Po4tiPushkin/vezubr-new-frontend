import React from 'react';
import PropTypes from 'prop-types';
import { Page, showError, showAlert, VzForm } from '@vezubr/elements';
import { Contour as ContourService } from '@vezubr/services/index.operator';
import ContourForm from '@vezubr/controls/forms/contour-form';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { useHistory } from 'react-router-dom';
const URL_BACK = '/contours';

function ContourAdd() {
  const [sending, setSending] = React.useState(false);
  const history = useHistory();
  const onSubmit = React.useCallback(async (form) => {
    setSending(true);
    try {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      if (errors !== null) {
        return;
      }
      const response = await ContourService.add(values);
      
      showAlert({
        title: t.common('ОК'),
        content: t.common('Контур был успешно создан'),
        onOk: () => {
          history.replace(URL_BACK);
        },
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setSending(false);
  }, []);

  const onCancel = React.useCallback(async () => {
    history.replace(URL_BACK);
  }, [history]);

  return (
    <div className='contour-page'>
      <div className={'contour-info'}>
        <div>
          <Page.Title onBack={() => onCancel()}>
            Создание контура
          </Page.Title>
        </div>
      </div>
      <ContourForm onSave={onSubmit} sending={sending} onCancel={onCancel} />
    </div>
  );
}

export default ContourAdd;
