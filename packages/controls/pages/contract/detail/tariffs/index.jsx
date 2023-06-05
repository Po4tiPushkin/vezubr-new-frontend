import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { Contracts as ContractsService } from '@vezubr/services';
import PropTypes from 'prop-types';
import { ButtonDeprecated, FilterButton, Page, VzTable, WhiteBox, showError, showAlert } from '@vezubr/elements';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from '@vezubr/components/DEPRECATED/modal/modal';
import { Ant } from '@vezubr/elements';
import TariffChooseTariffsForm from '@vezubr/tariff/forms/tariff-choose-tariffs-form';
import loaderTariffList from '@vezubr/tariff/loaders/loaderTariffList';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import _cloneDeep from 'lodash/cloneDeep';
import useParamsState from '@vezubr/common/hooks/useParamsState';

const Tariffs = (props) => {
  const {
    setShowTariffs,
    showTariffs,
    handleAssignTariff,
    handleNewTariff,
    id,
    contractorId,
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
      width={'55vw'}
      footer={[]}
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
          customButton={
            <Ant.Button
              onClick={() => handleNewTariff(showTariffs)}
              className={'semi-wide margin-left-16'}
              theme={'primary'}
            >
              Добавить новый тариф
            </Ant.Button>
          }
        />
      </div>
    </Ant.Modal>
  )
}

export default Tariffs;