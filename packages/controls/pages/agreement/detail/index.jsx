import React, { useEffect, useMemo, useState } from "react";
import { useParams as useRouterParams } from 'react-router';
import { Contracts as ContractsService } from '@vezubr/services';
import moment from "moment";
import { Page, showAlert, showError, VzForm, WhiteBox } from '@vezubr/elements';
import AgreementForm from '../../../forms/agreement-form';
import Utils from '@vezubr/common/common/utils';
import { connect } from 'react-redux';
import { fileGetFileData } from "@vezubr/common/utils";
const AgreementCard = (props) => {
  const { history, user, disabled = true, location, dictionaries } = props;
  const { id } = useRouterParams();
  const params = Utils.getUrlParams(location.search);
  const { contractorId } = params;
  const [loading, setLoading] = useState(false);
  const [agreement, setAgreement] = useState({});
  const [reload, setReload] = useState(Date.now());
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await ContractsService.getContract(id);
      response.file = fileGetFileData(response.file)
      setAgreement(response);
      setLoading(false)
    }
    fetchData();
  }, [id, reload]);

  const onDelete = async () => {
    try {
      await ContractsService.deleteAgreement({ id });
      showAlert({
        content: 'ДУ успешно удалено',
        onOk: history.goBack(),
      });
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }

  const onSave = React.useCallback(
    async (form) => {
      const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

      if (errors !== null) {
        return;
      }

      const payload = {
        ...values,
        contract: agreement.mainContract,
        file: values.file.fileId ? values.file.fileId.toString() : undefined,
      };


      try {
        await ContractsService.editAgreement(id, payload);
        showAlert({
          content: 'ДУ успешно изменено',
          onOk: () => history.goBack(),
        });
      } catch (e) {
        console.error(e);
        let mesg = null
        if (e.code === 403) {
          mesg = "У вас нет прав на редактирование данного ДУ"
        }
        showError(mesg || e);
      }
    },
    [id, agreement],
  );

  const goToTariff = () => {
    history.push(`/tariffs/${agreement?.tariffId}`);
  }

  return !loading ? (
    <div className="agreement-card">
      <Page.Title onBack={history.goBack}>ДУ № {agreement.agreementNumber}</Page.Title>
      <WhiteBox className={'margin-top-24 agreement-card__form'}>
        <AgreementForm
          values={{
            ...agreement,
            signedAt: moment(agreement.signedAt),
            expiresAt: agreement.expiresAt ? moment(agreement.expiresAt) : null,
          }}
          disabled={true}
          type={'info'}
          contract={agreement}
          onSave={onSave}
          onDelete={onDelete}
          goToTariff={goToTariff}
          contractorId={contractorId}
          setReload={setReload}
        />
      </WhiteBox>
    </div>
  ) : null;
}

const mapStateToProps = (state) => {
  let { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(AgreementCard);