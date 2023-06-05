import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';

import { Orders as OrdersService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';
import { useHistory } from 'react-router-dom';
import useColumns from './hooks/useColumns';
import useRowClassName from './hooks/useRowClassName';
import useFiltersActions from './hooks/useFiltersActions';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import moment from 'moment';
import { showError } from '@vezubr/elements';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import ActionConfigTable from '@vezubr/components/tableConfig';
import { camelCaseToSnakeCase } from "@vezubr/common/utils"
import { Utils } from '@vezubr/common/common';

// const QUERY_DEFAULT = {
//   // itemsPerPage: 100,
// };

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  if (paramsQuery.id) {
    paramsQuery.id = +paramsQuery.id;
  }

  if (paramsQuery.orderType) {
    paramsQuery.orderType = +paramsQuery.orderType;
  }

  if (paramsQuery.orderBy) paramsQuery.orderBy = camelCaseToSnakeCase(paramsQuery.orderBy);

  if (paramsQuery.active) {
    paramsQuery.active === 'true' ? paramsQuery.active = true : paramsQuery.active = false
  }

  return paramsQuery;
};

const tableKey = `regular-orders-${APP}`;

function RegularOrdersList(props) {

  const history = useHistory();
  const { location } = history

  const { dictionaries } = props;

  const [params, pushParams] = useParams({
    history,
    location,
    paramsName: 'regular',
    paramsDefault: {
      active: 'true',
    }
  });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const oldColumns = useColumns({ dictionaries });
  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);
  const [canRefreshFilters, setCanRefreshFilters] = useState(false);

  const filtersActions = useFiltersActions({ dictionaries, setUseExport, pushParams, setCanRefreshFilters, history });

  // const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const response = await OrdersService.regularOrderList({ ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response, paramsQuery?.page)
      const total = response?.itemsCount || dataSource.length;
      setData({ dataSource, total });
      setLoadingData(false);
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        setLoadingData(false);
        showError(e);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const getDataFuncForExport = useCallback(async () => {
    const paramsQuery = getParamsQuery(params);

    const response = await OrdersService.regularOrderList({
      ...paramsQuery,
      ...{ itemsPerPage: 100000, page: 1 },
    });

    const dataSource = response || [];

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  const rowClassName = useRowClassName();

  return (
    <div>
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'regular',
          filtersActions,
          title: 'Регулярные рейсы',
        }}
      />
      <TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowClassName,
          rowKey: 'id',
          scroll: { x: width, y: 550 },
          paramKeys,
          // paginatorConfig: {
          //   total,
          //   itemsPerPage,
          // },
        }}
      />
      <ExportCSV
        useExport={useExport}
        onFinishFunc={() => setUseExport(false)}
        setLoadingStatusFunc={setLoadingData}
        title={'Список Рейсов'}
        getDataFunc={getDataFuncForExport}
        filename={'Рейсы'}
      />
      <ActionConfigTable
        tableKey={tableKey}
        onSave={fetchData}
      />
    </div>
  );
}

RegularOrdersList.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  journalTypes: PropTypes.object,
  dictionaries: PropTypes.object,
};

RegularOrdersList.contextTypes = {
  history: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  let { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(RegularOrdersList);
