import useParamsState from '@vezubr/common/hooks/useParamsState';
import { Ant, showError } from '@vezubr/elements';
import { Contracts as ContractsService } from '@vezubr/services';
import TariffChooseTariffsForm from '@vezubr/tariff/forms/tariff-choose-tariffs-form';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const AssignTariffToAgreement = (props) => {
  const {
    setShowTariffs,
    showTariffs,
    handleAssignTariff,
    handleNewTariff,
    id,
    contractorId,
    handleAssignLater
  } = props;

  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const user = useSelector(state => state.user);
  const [params, pushParams] = useParamsState({ history, location: history.location });

  const fetchTariffs = useCallback(async () => {
    try {
      setLoading(true)
      const responseTariffs = await ContractsService.tariffsForAssign(id, { ...params });
      setTariffs(responseTariffs || responseTariffs.tariffs || responseTariffs.data || responseTariffs.data?.tariffs || []);
    } catch (e) {
      console.error(e);
      showError(e)
    }
    finally {
      setLoading(false);
    }

  }, [params]);

  useEffect(() => {
    if (contractorId === user?.id) {
      fetchTariffs()
    }
  }, [id, params]);


  return (
    <Ant.Modal
      onCancel={() => setShowTariffs(false)}
      visible={showTariffs}
      width={'75vw'}
      footer={null}
      bodyStyle={{backgroundColor: '#fff'}}
    >
      <div className="contract-card__modal">
        <TariffChooseTariffsForm
          tariffs={[]}
          dataSource={tariffs}
          loading={loading}
          saving={false}
          params={params}
          pushParams={pushParams}
          onSave={(data) => {
            handleAssignTariff(showTariffs, data[0]);
            setShowTariffs(false);
          }}
          saveText={'Назначить тариф'}
          selectionType="radio"
          customButton={(
            <div className='flexbox'>
              <Ant.Button
                onClick={() => handleNewTariff(showTariffs)}
                className={'semi-wide margin-left-16'}
                theme={'primary'}
              >
                Добавить новый тариф
              </Ant.Button>
              <Ant.Button
                onClick={() => handleAssignLater()}
                className={'semi-wide margin-left-16'}
                theme={'primary'}
              >
                Назначить позже
              </Ant.Button>
            </div>
          )}
        />
      </div>
    </Ant.Modal>
  )
}

export default AssignTariffToAgreement;