import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Utils from '@vezubr/common/common/utils'
import { connect } from "react-redux";
import { Common as CommonService, Contractor as ContractorService } from "@vezubr/services";
import { showError, showAlert } from "@vezubr/elements";
import useParams from "@vezubr/common/hooks/useParams";
import { history } from "../../infrastructure";
import useColumns from "./hooks/useColumns";
import useColumnsGenerator from "@vezubr/components/tableConfig/hooks/useColumnsGenerator";
import useFiltersActions from "./hooks/useFiltersActions";
import { Filters } from "@vezubr/components/tableFiltered";
import { VzTableFiltered } from "@vezubr/components";
import ExportCSV from "@vezubr/components/export/CSV";
import TableConfig from '@vezubr/components/tableConfig';
import t from '@vezubr/common/localization';
import useRowClassName from './hooks/useRowClassName';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = `producers-${APP}`;

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
  const { dictionaries, location, user } = props;

  const [params, pushParams] = useParams({
    history,
    location,
    paramsDefault: {},
  });

  const [useExport, setUseExport] = useState(false);

  const [loadingData, setLoadingData] = useState(false);

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

  const { dataSource, total } = data;

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const response = await ContractorService.producerList({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.data, paramsQuery?.page)
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

  const oldColumns = useColumns({ dictionaries, countersHash, fetchData, clientId });
  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);

  useEffect(() => {
    fetchData();
  }, [params]);

  const getDataFuncForExport = useCallback(async () => {
    const paramsQuery = getParamsQuery(params);
    await Utils.exportList(ContractorService, {
      ...QUERY_DEFAULT,
      ...paramsQuery,
      ...{ itemsPerPage: 100, page: 1 },
      listType: 'list_producers',
    })

    return () => { };
  }, [columns, params]);

  const filtersActions = useFiltersActions({
    setUseExport,
    history
  });

  const rowClassName = useRowClassName();

  return (
    <div className="orders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: `counterparties-${APP}`,
          filtersActions,
          title: 'Список контрагентов',
        }}
      />
      <VzTableFiltered.TableFiltered
        {...{
          params,
          pushParams,
          rowClassName,
          loading: loadingData,
          columns,
          dataSource,
          tableKey,
          rowKey: 'id',
          scroll: { x: width, y: 550 },
          paramKeys,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
      <ExportCSV
        useExport={useExport}
        onFinishFunc={() => setUseExport(false)}
        setLoadingStatusFunc={setLoadingData}
        title={'Список контрагентов'}
        getDataFunc={getDataFuncForExport}
        filename={'Список контрагентов'}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
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