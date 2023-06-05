import React, { useCallback, useEffect, useState } from 'react';
import { Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import ContractEditForm from '../form-edit';
import { Contracts as ContractsService, Common as CommonService } from '@vezubr/services';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import { connect } from 'react-redux';
import moment from 'moment';
import { Utils } from '@vezubr/common/common';
import _cloneDeep from 'lodash/cloneDeep';
const ContractEdit = ({ match, history, location, dictionaries, user }) => {
  const [contract, setContarct] = useState();
  const [counterparty, setCounterParty] = useState(null);
  useEffect(() => {
    const fetch = async () => {
      try {
        const contract = await ContractsService.getContract(match.params.id);
        if (APP === 'client' || (APP === 'dispatcher' && user.id === contract?.clientId)) {
          const response = await ContractsService.getProfile(contract.producerId);
          setCounterParty(response);
        }
        if (APP === 'producer' || (APP === 'dispatcher' && user.id === contract?.producerId)) {
          const response = await ContractsService.getProfile(contract.clientId);
          setCounterParty(response);
        }
        setContarct(contract);
      } catch (e) {
        console.error(e);
        showError(e);
      }
    }

    fetch();
  }, [match.params.id]);

  const goBack = useGoBack({
    location,
    history,
    defaultUrl: `/contract/${match.params.id}`,
  });

  const onSave = useCallback(
    async (form) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);
      if (errors !== null) {
        return;
      }

      const payload = {
        contractNumber: values.contractNumber,
        generatedDocumentsType: values.generatedDocumentsType,
        contractTypes: values.contractTypes,
        signedAt: moment(values.signedAt).format('YYYY-MM-DD'),
        expiresAt: values.expiresAt ? moment(values.expiresAt).format('YYYY-MM-DD') : null,
        paymentDelay: values.paymentDelay ? +values.paymentDelay : null,
        description: '',
        comment: values?.comment,
        file: values.file.fileId ? values.file.fileId.toString() : undefined,
        isDefaultForClientRate: values.defaultForClientRate,
        isDefaultForBargain: values.defaultForBargain,
        isDefaultForTariff: values.defaultForTariff,
        configuration: {
          periodRegisters: {
            type: values.typeAutomaticRegisters !== 0 ? values.periodRegisters : 0,
            value: values.periodRegisters == 0 ? parseInt(values.manualPeriod) : 0
          },
          typeAutomaticRegisters: values.typeAutomaticRegisters || 0,
        }
      };

      try {
        await ContractsService.updateContract({
          id: match.params.id,
          data: payload,
        });
        showAlert({
          content: t.common('Договор был успешно обновлен'),
          onOk: history.push(`/contract/${match.params.id}`),
        });
      } catch (e) {
        console.error(e);
        let mesg = null
        if (e.code === 403) {
          mesg = "У вас нет прав на редактирование договора"
        }
        showError(mesg || e);
      }
    },
    [goBack, match.params.id],
  );

  const onMarginSave = useCallback(async ({ bargain = {}, rate = {}, tariff = {} }) => {
    try {

      const values = _cloneDeep({ bargain, rate, tariff });

      Object.keys(values).forEach(el => {
        if (Object.keys(values[el])?.length === 0) {
          delete values[el];
        }
        else {
          Object.keys(values[el]).forEach(item => {
            if (values[el][item]?.type === 'amount') {
              values[el][item].value *= 100;
            }
          })
        }
      });

      await ContractsService.margin(match.params.id, values);
      showAlert({
        content: t.common('Договор был успешно обновлен'),
        onOk: history.push(`/contract/${match.params.id}`),
      });
    } catch (e) {
      console.error(e);
      let mesg = null
      if (e.code === 403) {
        mesg = "У вас нет прав на редактирование договора"
      }
      showError(mesg || e);
    }


  }, [])

  const contractTypes = React.useMemo(
    () => {
      return dictionaries?.contourContractContractTypes?.map(({ id, title }) => {
        return {
          label: title,
          value: id,
        }
      })
    },
    [dictionaries?.contourContractContractTypes],
  );

  return (
    <div className={'contract-add'}>
      <Page.Title onBack={goBack}>
        ID: {match.params.id}  / {counterparty?.name} / Редактирование договора
      </Page.Title>
      <WhiteBox className={'extra-wide margin-top-24 contract-add__form'}>
        {contract && (
          <ContractEditForm
            values={{
              ...contract,
              signedAt: moment(contract.signedAt) || null,
              expiresAt: contract.expiresAt ? moment(contract.expiresAt) : null,
            }}
            match={match}
            disabled={false}
            onSave={onSave}
            onMarginSave={onMarginSave}
            onCancel={goBack}
            contractTypes={contractTypes}
            role={counterparty?.role}
          />
        )}
      </WhiteBox>
    </div>
  );
};

export default connect((state) => ({
  dictionaries: state.dictionaries,
  user: state.user,
}))(React.memo(ContractEdit));
