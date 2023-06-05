import React, { useCallback, useEffect, useState } from 'react';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { useSelector } from 'react-redux';

import { Documents as DocumentsService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';
import { useHistory } from 'react-router-dom';
import useColumns from './hooks/useColumns';
import useRowClassName from './hooks/useRowClassName';
import useFiltersActions from './hooks/useFiltersActions';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import { showError } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import TableConfig from '@vezubr/components/tableConfig';
import { Utils } from '@vezubr/common/common';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = `documents-${APP}`

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  if (paramsQuery.filterOrderUiStates) {
    paramsQuery.filterOrderUiStates = paramsQuery.filterOrderUiStates.split(',').map((idString) => ~~idString);
  }

  if (paramsQuery.page) paramsQuery.page = +paramsQuery.page
  if (paramsQuery.orderId) paramsQuery.orderId = +paramsQuery.orderId;

  return paramsQuery;
};

function Documents(props) {
  const history = useHistory();
  const { location } = useHistory();
  const dictionaries = useSelector(state => state.dictionaries);

  const [params, pushParams] = useParams({ history, location });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const oldColumns = useColumns({ dictionaries });

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns)

  const filtersActions = useFiltersActions({ dictionaries, setUseExport });

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const response = await DocumentsService.list({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.orders, paramsQuery?.page)
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
  }, [params]);

  const getDataFuncForExport = useCallback(async () => {
    const paramsQuery = getParamsQuery(params);

    const response = await DocumentsService.list({
      ...QUERY_DEFAULT,
      ...paramsQuery,
      ...{ itemsPerPage: 100000, page: 1 },
    });

    const dataSource = response?.orders || [];

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  const rowClassName = useRowClassName();

  return (
    <div className="orders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'documents',
          filtersActions,
          title: t.documents('ordersDocuments'),
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
          rowKey: 'orderId',
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
        title={'Список Рейсов'}
        getDataFunc={getDataFuncForExport}
        filename={'Рейсы'}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}

export default Documents;
