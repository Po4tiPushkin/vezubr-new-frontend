import React, { useEffect, useMemo, useState } from "react";
import { useParams as useRouterParams } from 'react-router';
import { Contracts as ContractsService } from '@vezubr/services';
import moment from "moment";
import { Page, showAlert, showError, WhiteBoxDeprecated } from '@vezubr/elements';
import AgreementForm from '../../forms/agreement-form';
import Utils from '@vezubr/common/common/utils';
import { connect } from 'react-redux';
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

  const goToTariff = () => {
    history.push(`/tariffs/${agreement?.tariffId}`);
  }

  const agreementTypes = useMemo(() => {
    return dictionaries?.contourContractAgreementTypes?.map(({id ,title}) => {
      return {
        value: id,
        label: title
      }
    })
  }, [dictionaries?.contourContractAgreementTypes])
  
  return !loading ? (
    <div className="agreement-card">
      <Page.Title onBack={history.goBack}>ДУ № {agreement.agreementNumber}</Page.Title>
        <WhiteBoxDeprecated className={'extra-wide margin-top-24 agreement-card__form'}>
          <AgreementForm
            values={{
              ...agreement,
              signedAt: moment(agreement.signedAt),
              expiresAt: agreement.expiresAt ? moment(agreement.expiresAt) : null, 
            }}
            disabled={true}
            type={'info'}
            contract={agreement}
            onDelete={onDelete}
            goToTariff={goToTariff}
            contractorId={contractorId}
            agreementTypes={agreementTypes}
            setReload={setReload}
          />
        </WhiteBoxDeprecated>
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