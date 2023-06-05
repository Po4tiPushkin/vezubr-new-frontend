import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Utils from '@vezubr/common/common/utils'
import { useSelector } from "react-redux";
import { Common as CommonService, Contractor as ContractorService } from "@vezubr/services";
import { showError, Ant } from "@vezubr/elements";
import useParamsState from "@vezubr/common/hooks/useParamsState";
import useColumns from "./hooks/useColumns";
import useColumnsGenerator from "@vezubr/components/tableConfig/hooks/useColumnsGenerator";
import useFiltersActions from "./hooks/useFiltersActions";
import { Filters } from "@vezubr/components/tableFiltered";
import { VzTableFiltered } from "@vezubr/components";
import { useHistory } from 'react-router-dom';
const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = `producers-${APP}-private`;

const getParamsQuery = (params) => {
  if (params.page) {
    params.page = +params.page
  }
  if (params.id) {
    params.id = +params.id
  }
  if (params.role) {
    params.role = +params.role
  }
  return params;
};

function CounterPartiesPage(props) {
  const { onSave, onCancel } = props
  const { dictionaries } = useSelector(state => state);

  const history = useHistory();
  const { location } = history;
  const [params, pushParams] = useParamsState({
    history,
    location,
    paramsDefault: {
      isPrivate: true
    },
  });


  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const [selectedRows, setSelectedRows] = useState([]);

  const { dataSource, total } = data;

  const { itemsPerPage } = QUERY_DEFAULT;

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave((dataSource.find(el => el.id === selectedRows?.[0]) || null))
    }
  }, [selectedRows, dataSource]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel()
    }
  }, [])

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const response = await ContractorService.producerList({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.data, paramsQuery?.page);
      setData({ dataSource, total: response?.count });
      setLoadingData(false);
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        showError(e);
        setLoadingData(false);
      }
    }
  };

  const oldColumns = useColumns({ dictionaries });
  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);

  useEffect(() => {
    fetchData();
  }, [params]);

  const rowSelection = {
    selectedRowKeys: selectedRows,
    type: 'radio',
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  const filtersActions = useFiltersActions();
  return (
    <div className="orders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filtersActions,
          title: 'Список контрагентов',
        }}
      />
      <VzTableFiltered.TableFiltered
        {...{
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          tableKey,
          rowKey: 'id',
          scroll: { x: width, y: 550 },
          paramKeys,
          rowSelection,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
      <div className="flexbox" style={{"justifyContent": "end"}}>
        <Ant.Button onClick={handleCancel}>
          Отмена
        </Ant.Button>
        <Ant.Button
          onClick={() => handleSave()}
          type={"primary"}
          disabled={!selectedRows.length}
          className="margin-left-15"
        >
          Выбрать контрагента
        </Ant.Button>
      </div>
    </div>
  );
}

export default CounterPartiesPage;