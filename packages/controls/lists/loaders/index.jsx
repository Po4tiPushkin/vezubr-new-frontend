import useParams from '@vezubr/common/hooks/useParams';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import TableConfig from '@vezubr/components/tableConfig';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { showError } from '@vezubr/elements';
import { Loaders as LoadersService } from '@vezubr/services';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import { Utils } from '@vezubr/common/common';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  itemsPerPage: 'itemsPerPage',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = 'loaders-producer';

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  if (paramsQuery.specialities) {
    paramsQuery.specialities = paramsQuery.specialities.split(',');
  }

  if (paramsQuery.filterSystemStates) {
    paramsQuery.filterSystemStates = paramsQuery.filterSystemStates.split(',').map((idString) => ~~idString);
  }

  if (paramsQuery.orderBy == 'problematicOrdersCount') {
    paramsQuery.orderBy = 'problemsCount'
  }

  return paramsQuery;
};

function LoadersList(props) {

  const dictionaries = useSelector(state => state.dictionaries);

  const history = useHistory();
  const { location } = history;

  const [params, pushParams] = useParams({ history, location });

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

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);

  const filtersActions = useFiltersActions({ dictionaries, setUseExport, history, reloadData });

  const itemsPerPage = 100;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const response = await LoadersService.list({ ...QUERY_DEFAULT, ...paramsQuery, page: +paramsQuery.page || 1 });
      const dataSource = Utils.getIncrementingId(response?.loaders, paramsQuery?.page)
      const total = response?.itemsCount || dataSource.length;
      setData({ dataSource, total });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, [params, loadStamp]);

  const getDataFuncForExport = useCallback(async () => {
    const paramsQuery = getParamsQuery(params);

    const response = await LoadersService.list({
      ...QUERY_DEFAULT,
      ...paramsQuery,
    });

    const dataSource = response?.loaders || [];

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  return (
    <div className="loaders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'loaders',
          filtersActions,
          title: 'Специалисты',
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
        title={'Список специалистов'}
        getDataFunc={getDataFuncForExport}
        filename={'Список специалистов'}
      />

      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}


export default LoadersList;
