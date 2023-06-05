import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
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

const tableKey = `documents-flow-${APP}`

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };
  if (paramsQuery.page) paramsQuery.page = +paramsQuery.page

  return paramsQuery;
};

function DocumentsFlow(props) {
  const history = useHistory();
  const { location } = useHistory();
  const dictionaries = useSelector(state => state.dictionaries);

  const [params, pushParams] = useParams({
    history,
    location,
    paramsDefault: {
      startDateSince: moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
      startDateTill: moment().endOf('day').format('YYYY-MM-DD'),
    },
  });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;


  const filtersActions = useFiltersActions({ dictionaries });

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const response = await DocumentsService.flowList({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.items, paramsQuery?.page)
      const total = response?.itemCount || dataSource.length;
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

  const oldColumns = useColumns({ dictionaries, reload: () => fetchData() });

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns)


  const rowClassName = useRowClassName();

  return (
    <div className="orders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'documents-flow',
          filtersActions,
          title: 'Перевозочные документы',
        }}
      />
      <TableFiltered
        {...{
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowClassName,
          rowKey: 'id',
          scroll: { x: width, y: 550 },
          paramKeys,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}

export default DocumentsFlow;
