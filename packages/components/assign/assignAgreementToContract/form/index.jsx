import React from 'react';
import { Ant, showError, Loader, ButtonDeprecated } from '@vezubr/elements';
import { Contracts as ContractsService } from '@vezubr/services';
import moment from 'moment';

function AssignAgreementToContractForm(props) {
  const { contractorId, assignToContract: assignToContractInput } = props;

  const [loading, setLoading] = React.useState(true);
  const [contracts, setContracts] = React.useState([]);

  React.useEffect(() => {
    if (contractorId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const contracts = await ContractsService.contourList({ contractor: contractorId, isActive: 1 });
          setContracts(contracts);
        } catch (e) {
          console.error(e);
          showError(e);
        }

        setLoading(false);
      };

      fetchData();
    }
  }, [contractorId]);

  const [value, setValue] = React.useState(undefined);
  const onChange = React.useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const assignToContract = React.useCallback(() => {
    if (assignToContractInput) {
      assignToContractInput(value)
    }
  }, [assignToContractInput, value])

  return (
    <div style={{
      [loading ? "height" : "minHeight"]: 500
    }}>
      {
        !loading ? (
          <>
            <div className="flexbox choose-additional-filters column size-1" style={{maxHeight: 500, overflowY: 'scroll'}}>
              <Ant.Radio.Group onChange={onChange} value={value}>
                {contracts?.map((contract) => (
                  <div className={'flexbox additional-input'} key={contract?.id}>
                    <Ant.Radio style={{ display: 'block', whiteSpace: 'normal' }} value={contract?.id}>
                      {`${contract?.id} Договор №${contract?.contractNumber} от ${moment(contract?.signedAt).format('DD.MM.YYYY') || '-'}`}
                    </Ant.Radio>
                  </div>
                ))}
              </Ant.Radio.Group>
            </div>
            <div className={'flexbox'}>
              <div className={'area full-width'}>
                <div className={'flexbox align-right justify-right full-width'}>
                  <ButtonDeprecated className={'margin-left-15'} theme={'primary'} onClick={assignToContract}>
                    {'Применить'}
                  </ButtonDeprecated>
                </div>
              </div>
            </div>
          </>
        ) : (
          
            <Loader />
          // {/* </div> */}
          // {/* <div className="flexbox align-center justify-center"> */}
          
         )
      }
    </div>
  );
}

export default AssignAgreementToContractForm;
