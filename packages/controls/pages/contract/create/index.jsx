import React, { useCallback, useEffect, useState } from 'react';
import { Ant, Modal, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import ContractForm from '../form';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import { connect } from 'react-redux';
import moment from 'moment';
import { Common as CommonService, Contracts as ContractsService } from '@vezubr/services';
import { dictionaryConvertToGeneralView } from '@vezubr/common/utils';

const ContractAdd = ({ match, history, location, dictionaries }) => {
  const [counterParty, setCounterParty] = useState(null);
  const [contractId, setContractId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dict = dictionaryConvertToGeneralView({ dictionaries });

  useEffect(() => {
    const fetchCounterParty = async () => {
      try {
        const response = await ContractsService.getProfile(match.params.id);
        setCounterParty(response);
      } catch (e) {
        console.error(e);
        showError(e);
      }
    };
    fetchCounterParty();
  }, [match.params.id]);

  const goBack = useGoBack({
    location,
    history,
    defaultUrl: `/counterparty/${match.params.id}/contracts`,
  });

  const onSave = useCallback(
    async (form) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);
      if (errors !== null) {
        return;
      }

      const body = {
        generatedDocumentsType: values.generatedDocumentsType,
        contractNumber: values.contractNumber,
        contractTypes: values.contractTypes,
        signedAt: moment(values.signedAt).format('YYYY-MM-DD'),
        expiresAt: values.expiresAt ? moment(values.expiresAt).format('YYYY-MM-DD') : null,
        paymentDelay: values.paymentDelay ? +values.paymentDelay : null,
        // producerId: match.params.id,
        contour: counterParty?.contours ? counterParty.contours[0]?.id : null,
        description: '',
        comment: values?.comment,
        contractor: match.params.id,
        file: values.file.fileId ? values.file.fileId.toString() : undefined,
        isDefaultForClientRate: values.defaultForClientRate ? values.defaultForClientRate : false,
        isDefaultForBargain: values.defaultForBargain ? values.defaultForBargain : false,
        isDefaultForTariff: values.defaultForTariff ? values.defaultForTariff : false,
        configuration: {
          periodRegisters: {
            type: values.typeAutomaticRegisters !== 0 ? values.periodRegisters : 0,
            value: values.periodRegisters == 0 ? parseInt(values.manualPeriod) : 0,
          },
          typeAutomaticRegisters: values.typeAutomaticRegisters || 0,
        },
      };
      onSaveContract(body);
    },
    [goBack, match.params.id, counterParty],
  );

  const onSaveContract = async (body) => {
    setLoading(true);
    try {
      const response = await ContractsService.createContract(body);
      showAlert({
        content: t.common('Договор был успешно создан'),
        onOk: () => history.push(`/contract/${response.id}`),
        onCancel: () => history.push(`/contract/${response.id}`),
      });
    } catch (e) {
      console.error(e);
      if (e.data?.expiresAt) showError('Дата конца договора должна быть больше даты начала');
      else showError(e);
    } finally {
      setLoading(false);
    }
  };

  const contractTypes = React.useMemo(() => {
    return dictionaries?.contourContractContractTypes?.map(({ id, title }) => {
      return {
        label: title,
        value: id,
      };
    });
  }, [dictionaries?.contourContractContractTypes]);

  return counterParty ? (
    <div className={'contract-add'}>
      <Page.Title onBack={goBack}>{counterParty.name} / Создание договора</Page.Title>
      <WhiteBox className={'extra-wide margin-top-24 contract-add__form'}>
        <ContractForm
          loading={loading}
          role={counterParty?.role}
          type={'add'}
          location={location}
          onSave={onSave}
          onCancel={goBack}
          match={match}
          contractTypes={contractTypes}
        />
      </WhiteBox>
    </div>
  ) : null;
};

export default connect((state) => ({
  dictionaries: state.dictionaries,
}))(React.memo(ContractAdd));
