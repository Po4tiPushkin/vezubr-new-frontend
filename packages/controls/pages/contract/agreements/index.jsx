import useParamsState from '@vezubr/common/hooks/useParamsState';
import AssignTariffToAgreement from '@vezubr/components/assign/assignTariffToAgreement';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { showAlert, showConfirm, showError } from '@vezubr/elements';
import { Contracts as ContractsService } from '@vezubr/services';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import useRowClassName from './hooks/useRowClassName';

const paramKeys = {
  page: 'page',
};

const Agreements = (props) => {
  const { match, dictionaries, user, values, reload } = props;
  const [params, pushParams] = useParamsState({ paramsDefault: { active: 'active' } });
  const [contract, setContract] = useState(values);
  const [showTariffs, setShowTariffs] = useState(false);
  const id = match.params.id;
  const history = useHistory();
  const [editable, setEditable] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);

  const handleNewTariff = async (contractId) => {
    history.push(`/tariffs/add?contractId=${id}&agreementId=${+contractId}`);
  };

  const onDelete = useCallback(async (id) => {
    try {
      showConfirm({
        title: 'Вы уверены?',
        onOk: async () => {
          await ContractsService.deleteAgreement({ id });
          await reload();
        },
      });
    } catch (e) {
      let mesg = null;
      if (e.code === 403) {
        mesg = 'У вас нет прав на удаление ДУ';
      }
      showError(e);
      console.error(e);
    }
  }, []);

  const onAddAgreement = useCallback(() => {
    history.push(`/contract/${id}/agreement/add`);
  }, [history, id]);

  const handleAssignTariff = React.useCallback(
    async (contractId, tariffId) => {
      try {
        await ContractsService.assignTariff({
          id: +contractId,
          tariff: tariffId,
        });
        showAlert({
          content: 'Тариф был успешно привязан',
          onOk: () => {
            window.location.reload();
          }
        })
      } catch (e) {
        console.error(e);
        showError(e);
      } finally {
        setShowTariffs(false);
      }
    },
    [ContractsService],
  );

  const handleAssignLater = React.useCallback(() => {
    setShowTariffs(false);
  }, []);

  const onAddTariff = React.useCallback((id) => {
    setShowTariffs(id);
  }, []);

  const columns = useColumns({
    onDelete,
    onAddTariff,
    dictionaries,
    disabled: !editable || !contract?.active,
    contractorId: contract?.clientId == user?.id ? contract?.producerId : contract?.clientId,
  });

  useEffect(() => {
    if (values) {
      setContract({ ...values });
      setEditable(values.createdContractorId === user?.id);
      setDataSource(values?.additionalAgreements || []);
      setFilteredDataSource(values?.additionalAgreements || []);
    }
  }, [values, user]);

  useEffect(() => {
    const { active } = params || {};
    switch (active) {
      case 'deleted':
        setFilteredDataSource(dataSource.filter((el) => el.deleted));
        break;
      case 'active':
        setFilteredDataSource(dataSource.filter((el) => el.active));
        break;
      case 'all':
        setFilteredDataSource(dataSource);
        break;
      default:
        setFilteredDataSource(dataSource);
    }
  }, [params, dataSource]);

  const filtersActions = useFiltersActions({ onAddAgreement, editable: editable && contract?.active });
  const rowClassName = useRowClassName();

  if (!contract.id) {
    return null;
  }
  return (
    <>
      <div className="contract-card__agreements">
        <Filters
          {...{
            showArrow: false,
            filtersActions,
            classNames: 'contract-card__agreements-filters',
            title: 'Дополнительные условия по тарификации',
            params,
            pushParams,
            paramKeys,
          }}
        />
        <TableFiltered
          params={params}
          pushParams={pushParams}
          dataSource={filteredDataSource}
          columns={columns}
          paramKeys={paramKeys}
          rowKey="id"
          rowClassName={rowClassName}
          scroll={{
            x: columns.reduce((acc, cur) => acc + cur.width || 0, 0),
            y: '100%',
          }}
          paginatorConfig={{
            total: filteredDataSource?.length,
            itemsPerPage: 10,
          }}
          responsive={false}
        />
      </div>
      <AssignTariffToAgreement
        showTariffs={showTariffs}
        setShowTariffs={setShowTariffs}
        handleNewTariff={handleNewTariff}
        contractorId={contract?.createdContractorId}
        id={contract?.id}
        handleAssignTariff={handleAssignTariff}
        handleAssignLater={handleAssignLater}
      />
    </>
  );
};
export default connect((state) => ({
  dictionaries: state.dictionaries,
  user: state.user,
}))(React.memo(Agreements));
