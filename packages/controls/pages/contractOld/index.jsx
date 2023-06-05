import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonDeprecated, FilterButton, Page, VzTable, WhiteBox, showError } from '@vezubr/elements';

import moment from 'moment';
import { useColumns } from './columns';
import { useHistory, useParams as useRouterParams } from 'react-router';
import ContractForm from '../../forms/contract-form';
import { connect } from 'react-redux';
import Modal from '@vezubr/components/DEPRECATED/modal/modal';
import { Ant } from '@vezubr/elements';
import Utils from '@vezubr/common/common/utils';
import TariffChooseTariffsForm from '@vezubr/tariff/forms/tariff-choose-tariffs-form';
import loaderTariffList from '@vezubr/tariff/loaders/loaderTariffList';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import { Tariff as TariffService, Contracts as ContractsService } from '@vezubr/services';
const { Divider, Table } = Ant;

const Contract = ({ api, dictionaries, mode, user }) => {
  const [contract, setContract] = useState();
  const [profile, setProfile] = useState();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { id } = useRouterParams();
  const history = useHistory();
  const [tariffs, setTariffs] = useState([]);
  const [showTariffs, setShowTariffs] = useState(false);
  const [editable, setEditable] = useState(true);
  const dict = useConvertDictionaries({ dictionaries });

  const getContract = useCallback(async () => {
    try {
      const response = await ContractsService.getContract(id);
      setEditable(response.createdContractorId === user?.id);
      if (response.createdContractorId === user?.id) {
        const responseTariffs = await ContractsService.tariffsForAssign(id);
        setTariffs(responseTariffs || responseTariffs.tariffs || responseTariffs.data || responseTariffs.data?.tariffs || []);
      }
      setContract(response);
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [id, user]);

  const onDelete = useCallback(
    async (id) => {
      try {
        await api.deleteAgreement({ id });
        getContract();
      } catch (e) {
        console.error(e);
        let mesg = null;
        if (e.code === 403) {
          mesg = 'У вас нет прав на удаление ДУ';
        }
        showError(mesg || e);
      }
    },
    [api, getContract],
  );

  const onAddAgreement = useCallback(() => {
    history.push(`/contract/${id}/agreement/add`);
  }, [history, id]);

  const onContractEdit = useCallback(() => {
    history.push(`/contract/${id}/edit`);
  }, [history, id]);

  useEffect(() => {
    getContract();
  }, []);

  const onContractEnd = useCallback(async () => {
    try {
      const response = await ContractsService.endContract(id);
      await getContract();
    } catch (e) {
      console.error(e);
      let mesg = null;
      if (e.code === 403) {
        mesg = 'У вас нет прав на прекращение договора';
      }
      showError(mesg || e);
    }
  }, [id]);

  useEffect(() => {
    contract &&
      api.getProfile(mode === 'client' ? contract.producerId : contract.clientId).then((res) => {
        setProfile(res);
      });
  }, [api, contract, id, mode]);

  const columns = useColumns({
    onDelete,
    onAddTariff: (id) => setShowTariffs(id),
    dictionaries,
    disabled: !editable || !contract?.active,
  });

  const contractTypes = React.useMemo(() => {
    return dictionaries?.contourContractContractTypes?.map(({ id, title }) => {
      return {
        label: title,
        value: id,
      };
    });
  }, [dictionaries?.contourContractContractTypes]);

  const handleAssignTariff = React.useCallback(
    async (contractId, tariffId) => {
      await api.assignTariff({
        id: +contractId,
        tariff: tariffId,
      });
      setShowTariffs(false);
      getContract();
    },
    [api],
  );

  return contract && profile ? (
    <WhiteBox className={'stretch margin-top-24 contract-card'}>
      <div className="contract-card__header">
        <Page.Title onBack={() => history.goBack()}>
          ID:{' '}
          {mode === 'client' ? `${contract.producerId} / ${profile.name}` : `${contract.clientId} / ${profile.name}`} /
          Карточка договора
        </Page.Title>
        <div className="contract-card-filter">
          <FilterButton
            icon={'dotsBlue'}
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={'circle box-shadow margin-left-12'}
            withMenu={true}
            menuOptions={{
              show: showFilterDropdown,
              arrowPosition: 'right',
              list: [
                {
                  disabled: !contract?.active,
                  title: 'Договор прекращен',
                  icon: <Ant.Icon name={'backArrowOrange'} />,
                  onAction: () => onContractEnd(),
                },
              ],
            }}
          />
        </div>
      </div>
      <ContractForm
        values={{
          ...contract,
          signedAt: moment(contract.signedAt),
          expiresAt: contract.expiresAt ? moment(contract.expiresAt) : null,
        }}
        contractTypes={contractTypes}
        disabled={true}
        notActive={!editable || !contract?.active}
      />
      {
        <div className="contract-card__buttons">
          <ButtonDeprecated
            className={'semi-wide'}
            theme={'primary'}
            onClick={onContractEdit}
            disabled={!editable || !contract?.active}
          >
            Редактировать
          </ButtonDeprecated>
          <ButtonDeprecated disabled={!editable || !contract?.active} onClick={onAddAgreement} className={'semi-wide'} theme={'primary'}>
            Добавить ДУ
          </ButtonDeprecated>
        </div>
      }
      <Divider />
      {/* <h2 className="contract-card__agreements-title bold">Настройки по формированию Реестров для договора</h2>
      <PeriodRegistersForm
        values={{
          ...contract,
          signedAt: contract.signedAt ? moment(Utils.secToMs(contract.signedAt)) : null,
          expiresAt: contract.expiresAt ? moment(Utils.secToMs(contract.expiresAt)) : null,
        }}
        contractTypes={contractTypes}
        disabled={true} />

      <div className="contract-card__buttons">
        <ButtonDeprecated
          className={'semi-wide'}
          theme={'primary'}
          onClick={() => history.push(`/contract/${id}/editPeriodRegisters`)}
        >
          Редактировать
        </ButtonDeprecated>
      </div>
      <Divider /> */}
      <h2 className="contract-card__agreements-title bold">Дополнительные условия по тарификации</h2>
      <div className="contract-card__agreements">
        <VzTable.Table
          dataSource={contract?.additionalAgreements?.filter((agreement) => !agreement?.deleted)}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </div>
      <Modal
        title={{ text: 'Список тарифов' }}
        options={{
          showClose: true,
          showModal: showTariffs,
        }}
        size={'large'}
        onClose={() => setShowTariffs(false)}
        noPadding={true}
        animation={false}
        content={
          <div className="contract-card__modal">
            <TariffChooseTariffsForm
              dictionaries={dict}
              tariffs={[]}
              dataSource={tariffs}
              loading={false}
              saving={false}
              onSave={(data) => {
                handleAssignTariff(showTariffs, data[0]);
                setShowTariffs(false);
              }}
              saveText={'Назначить тариф'}
              selectionType="radio"
              customButton={
                <Ant.Button
                  onClick={() => history.push(`/tariffs/add?contractId=${id}&agreementId=${showTariffs}`)}
                  className={'semi-wide margin-left-16'}
                  theme={'primary'}
                >
                  Добавить новый тариф
                </Ant.Button>
              }
            />
          </div>
        }
      />
    </WhiteBox>
  ) : null;
};

Contract.propTypes = {
  api: PropTypes.object,
  dictionaries: PropTypes.object,
  mode: PropTypes.string,
  user: PropTypes.object,
};

export default connect((state) => ({
  dictionaries: state.dictionaries,
  user: state.user,
}))(React.memo(Contract));
