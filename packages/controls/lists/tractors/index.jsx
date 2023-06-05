import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';
import { Tractor as TractorService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';
import ImportTractorsAction from './actions/import-tractors-action';
import useColumns from './hooks/useColumns';
//import useRowClassName from './hooks/useRowClassName';
import useFiltersActions from './hooks/useFiltersActions';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import { showError } from '@vezubr/elements';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import TableConfig from '@vezubr/components/tableConfig';
import { useHistory } from 'react-router-dom';
import { Utils } from '@vezubr/common/common';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderDirection: 'orderDirection',
  orderBy: 'orderBy',

};

const tableKey = `tractors-${APP}`

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };
  const multiValueFields = [];

  for (const fieldName of multiValueFields) {
    if (paramsQuery[fieldName]) {
      paramsQuery[fieldName] = paramsQuery[fieldName].split(',').map((idString) => ~~idString);
    }
  }

  if (paramsQuery.plateNumber && paramsQuery.plateNumber.length < 2) {
    delete paramsQuery.plateNumber;
  }

  if (params.page) {
    paramsQuery.page = +paramsQuery.page;
  }

  return paramsQuery;
};

const Tractors = (props) => {
  const history = useHistory();
  const { location } = history
  const { dictionaries } = props;

  const [params, pushParams] = useParams({ history, location, paramsName: 'tractors', });
  const [loadStamp, setLoadStamp] = useState(Date.now());

  const reloadData = useCallback(() => {
    setLoadStamp(Date.now());
  }, [setLoadStamp]);

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const oldColumns = useColumns({ dictionaries });

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns)
  const filtersActions = useFiltersActions({ dictionaries, setUseExport, history });
  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const response = await TractorService.list({ ...QUERY_DEFAULT, ...paramsQuery });
      const { data, count } = response;
      const dataSource = Utils.getIncrementingId(response?.data, paramsQuery?.page)
      setData({ dataSource, total: count });
      setLoadingData(false);
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        showError(e);
        setLoadingData(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [params, loadStamp]);

  const getDataFuncForExport = useCallback(async () => {
    const paramsQuery = getParamsQuery(params);
    const response = await TractorService.list({
      ...QUERY_DEFAULT,
      ...paramsQuery,
    });

    const dataSource = response.data || [];

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  return (
    <div className="orders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'tractors',
          filtersActions,
          title: 'Тягачи',
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
        title={'Список Тягачей'}
        getDataFunc={getDataFuncForExport}
        filename={'Список Тягачей'}
      />

      <ImportTractorsAction onOk={reloadData} />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}

const mapStateToProps = (state) => {
  const { dictionaries, user } = state;
  return {
    user,
    dictionaries
  };
};

export default connect(mapStateToProps)(Tractors);