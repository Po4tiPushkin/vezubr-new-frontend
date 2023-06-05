import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from "react-redux";
import { Contractor as ContractorServices } from "@vezubr/services";
import { showError, ButtonDeprecated } from "@vezubr/elements";
import useParamsState from "@vezubr/common/hooks/useParamsState";
import useColumns from "./hooks/useColumns";
import useColumnsGenerator from "@vezubr/components/tableConfig/hooks/useColumnsGenerator";
import { VzTableFiltered } from "@vezubr/components";
import { Filters } from "@vezubr/components/tableFiltered";
import { VzForm, Ant } from '@vezubr/elements';
import { useHistory } from 'react-router-dom';
import useFiltersActions from './hooks/useFiltersActions';
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
  const { dictionaries, user, onOk, onCancel } = props;
  const history = useHistory();
  const { location } = history
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

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const dataSource = await ContractorServices.clientList({ ...QUERY_DEFAULT, ...paramsQuery });
      setData({ dataSource: dataSource?.data, total: dataSource?.count });
    } catch (e) {
      console.error(e);
      if (typeof e?.message !== 'undefined') {
        showError(e);
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
      type: 'radio',
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
          dataSource,
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
        <ButtonDeprecated theme={'primary'} style={{ 'min-width': '150px' }} className={'semi-wide margin-left-16 margin-top-10'} onClick={() => onOk(dataSource.find(el => el.id === selectedRowKeys[0]))} disabled={!(selectedRowKeys.length === 1)}>
          Сохранить
        </ButtonDeprecated>
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