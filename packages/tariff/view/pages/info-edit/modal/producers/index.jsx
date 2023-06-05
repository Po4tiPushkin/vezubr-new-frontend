import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from "react-redux";
import { Contractor as ContractorServices, Tariff as TariffService } from "@vezubr/services";
import { showError } from "@vezubr/elements";
import useParamsState from "@vezubr/common/hooks/useParamsState";
import { useHistory } from 'react-router-dom';
import useColumns from "./hooks/useColumns";
import useRowClassName from "./hooks/useRowClassName";
import useColumnsGenerator from "@vezubr/components/tableConfig/hooks/useColumnsGenerator";
import { VzTableFiltered } from "@vezubr/components";
import { Filters } from "@vezubr/components/tableFiltered";
import { VzForm, Ant } from '@vezubr/elements';
import useFiltersActions from './hooks/useFiltersActions';
import _uniq from 'lodash/uniq';
const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = 'counterparties-dispatcher';

const getParamsQuery = (params) => {
  if (params.page) {
    params.page = +params.page
  }
  return params;
};

function CounterPartiesPage(props) {
  const { dictionaries, user, onOk, onCancel, tariffId } = props;

  const history = useHistory();
  const { location } = history;

  const [params, pushParams] = useParamsState({
    history,
    location,
    paramsDefault: {},
  });

  const [loadingData, setLoadingData] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const countersHash = useMemo(() => {
    const countersHash = {};
    for (const countor of user.contours) {
      countersHash[countor.id] = countor;
    }
    return countersHash;
  }, [user.contours]);

  const clientId = user.id;

  const { itemsPerPage } = QUERY_DEFAULT;

  const { dataSource, total } = data;

  const [appointedContractorsIds, setAppointedContractorsIds] = useState([]);

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const availableContractors = await TariffService.contractorsForAppoints(tariffId)
      const appointedContractors = _uniq(availableContractors?.filter(item => item?.isAppointed).map(item => item?.contractor));
      setSelectedRowKeys(appointedContractors);
      setAppointedContractorsIds(appointedContractors);
      const producers = await ContractorServices.producerList({ ...QUERY_DEFAULT, ...paramsQuery });;
      let counterparties = []
      for (let counterparty of producers?.data) {
        if (availableContractors.find(item => item?.contractor === counterparty.id)) {
          counterparty.disabled = (availableContractors?.find(item => item?.contractor == counterparty.id)).isAppointed
          counterparties.push(counterparty)
        } else {
          continue
        }
      }


      setData({ dataSource: counterparties || [], total: producers?.count });
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        showError(e);
        setLoadingData(false);
      }
    }
    setLoadingData(false);
  };

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
      },
      selections: [
        {
          key: 'clear-all',
          text: 'Очистить',
          onSelect: () => {
            setSelectedRowKeys([]);
          },
        },
      ],
    }),
    [selectedRowKeys],
  );

  const oldColumns = useColumns({ dictionaries, countersHash, fetchData, clientId });
  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);

  useEffect(() => {
    fetchData();
  }, [params]);

  const filtersActions = useFiltersActions()

  const rowClassName = useRowClassName()

  return (
    <div className="orders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filtersActions,
          title: 'Список контрагентов',
          showArrow: false,
        }}
      />
      <VzTableFiltered.TableFiltered
        {...{
          params,
          pushParams,
          loading: loadingData,
          columns,
          rowClassName,
          dataSource: dataSource,
          rowKey: 'id',
          scroll: { x: width, y: 550 },
          paramKeys,
          rowSelection,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
          responsive: false,
        }}
      />
      <VzForm.Actions>
        <Ant.Button onClick={() => onCancel()}>
          Отмена
        </Ant.Button>
        <Ant.Button
          onClick={
            () => onOk(selectedRowKeys.filter(el => !appointedContractorsIds.includes(el)))
          }
          type={'primary'}
          disabled={!selectedRowKeys.filter(el => !appointedContractorsIds.includes(el)).length}
        >
          Назначить выбранным
        </Ant.Button>
      </VzForm.Actions>
    </div>
  );
}

const mapStateToProps = (state) => {
  const { dictionaries, user } = state;
  return {
    dictionaries,
    user,
  };
};

export default connect(mapStateToProps)(CounterPartiesPage);