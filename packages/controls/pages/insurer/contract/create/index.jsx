import React, { useCallback, useEffect, useState } from 'react';
import { Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import ContractForm from '../../../../forms/insurer/insurer-contract-form';
import t from '@vezubr/common/localization';
import moment from 'moment';
import { Insurers as InsurersService } from '@vezubr/services';

const InsurerContractAdd = ({ match, history, location, dictionaries }) => {
  const [insurer, setInsurer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsurer = async () => {
      try {
        setLoading(true)
        const response = await InsurersService.info(match.params.id);
        setInsurer(response);
      } catch (e) {
        console.error(e);
        showError(e);
      }
      finally {
        setLoading(false);
      }
    }
    fetchInsurer();
  }, [match.params.id])

  const goBack = useGoBack({
    location,
    history,
    defaultUrl: `/insurers/${match.params.id}/contracts`,
  });

  const onSave = useCallback(
    async (form, extraData) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);
      if (errors !== null) {
        return;
      }

      const body = {
        ...values,
        ...extraData,
        insurerId: match.params.id,
        fileId: values.file?.fileId ? values.file.fileId : undefined,
        maxAmountRestriction: values.maxAmountRestriction * 100,
        minPremium: values.minPremium * 100
      }
      delete body.file;
      onSaveContract(body);
    },
    [goBack, match.params.id],
  );


  const onSaveContract = async (body) => {
    try {
      setLoading(true)
      const response = await InsurersService.contractCreate(body);
      showAlert({
        content: t.common('Договор был успешно создан'),
        onOk: () => history.push(`/insurers/contracts/${response.id}`),
        onCancel: () => history.push(`/insurers/contracts/${response.id}`),
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    finally {
      setLoading(false)
    }
  }


  return insurer ? (
    <div className={'insurer-contract-add'}>
      <Page.Title onBack={goBack}>{insurer.title} / Создание договора</Page.Title>
      <WhiteBox className={'extra-wide margin-top-24 insurer-contract-add__form'}>
        <ContractForm loading={loading} type={'add'} location={location} onSave={onSave} onCancel={goBack} />
      </WhiteBox>
    </div>
  ) : null;
};



export default InsurerContractAdd;
