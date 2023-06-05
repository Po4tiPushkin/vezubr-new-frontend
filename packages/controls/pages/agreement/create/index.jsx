import useGoBack from '@vezubr/common/hooks/useGoBack';
import { Page, showError, VzForm, WhiteBoxDeprecated } from '@vezubr/elements';
import { Contracts as ContractsService } from '@vezubr/services';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AgreementForm from '../../../forms/agreement-form';
import moment from 'moment'

const AgreementAdd = ({ match }) => {
  const history = useHistory()
  const { location } = history;
  const [loading, setLoading] = useState();
  const [contract, setContract] = useState();
  const backUrlDefault = useMemo(() => `/contract/${match.params.id}`, [match.params.id]);
  useEffect(() => {
    const fetchContract = async () => {
      const response = await ContractsService.getContract(match.params.id);
      setContract(response);
    }
    fetchContract();
  }, [match.params.id]);

  const goBack = useGoBack({ location, history, defaultUrl: backUrlDefault });

  const onSave = useCallback(
    async (form) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);
      setLoading(true)
      if (errors !== null) {
        return;
      }

      const payload = {
        ...values,
        contract: match.params.id,
        file: values.file.fileId ? values.file.fileId.toString() : undefined,
        signedAt: values.signedAt ? moment(values.signedAt).format('YYYY-MM-DD') : null,
        expiresAt: values.expiresAt ? moment(values.expiresAt).format('YYYY-MM-DD') : null,
      };

      try {
        const resp = await ContractsService.createAgreement(payload);
        return resp.id;
      } catch (e) {
        console.error(e);
        let mesg = null
        if (e.code === 403) {
          mesg = "У вас нет прав на создание ДУ"
        }
        showError(mesg || e);
      } finally {
        setLoading(false)
      }
    },
    [goBack, match.params.id],
  );

  return contract ? (
    <div className="agreement-add">
      <Page.Title onBack={goBack}>Договор № {contract.contractNumber} / Создание дополнительных условий по тарификации</Page.Title>
      <WhiteBoxDeprecated className={'extra-wide margin-top-24 agreement-add__form'}>
        <AgreementForm
          onSave={onSave}
          onCancel={goBack}
          contract={contract}
          loading={loading}
        />
      </WhiteBoxDeprecated>
    </div>
  ) : null;
};

export default AgreementAdd;
