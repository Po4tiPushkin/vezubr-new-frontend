import React, { useCallback } from 'react';
import { Ant, Modal, Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import { Contractor as ContractorService } from '@vezubr/services'
import CounterpartyCreateChildForm from '../../../forms/counterparty-form/child';
const CounterpartyCreateChild = (props) => {
  const { history } = props;
  const onSave = useCallback(async (form) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);
    if (errors) {
      return;
    }
    if (!values.kpp) {
      delete values.kpp;
    }
    try {
      const response = await ContractorService.createChild(values);
      showAlert({
        content: "Контрагент был успешно создан",
        onOk: () => history.push(`/counterparty/${response.id}`)
      })
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [])
  return (
    <WhiteBox className="counterparty-child-add">
      <Page.Title onBack={() => {
        history.goBack();
      }}>
        Добавление Внутреннего Контрагента
      </Page.Title>

      <CounterpartyCreateChildForm onSave={onSave} />
    </WhiteBox>
  )
}

export default CounterpartyCreateChild;