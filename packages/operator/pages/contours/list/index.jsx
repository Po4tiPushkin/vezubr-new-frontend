import React, { useCallback, useEffect, useState } from 'react';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';

import { Contour as ContourService } from '@vezubr/services/index.operator';
import useParams from '@vezubr/common/hooks/useParams';

import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import { showError } from '@vezubr/elements';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  if (paramsQuery.filterSystemStates) {
    paramsQuery.filterSystemStates = paramsQuery.filterSystemStates.split(',').map((n) => parseInt(n, 10));
  }

  return paramsQuery;
};

function Contours(props) {

  const { location, history } = props;

  const [params, pushParams] = useParams({ history, location });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const columns = useColumns();

  const filtersActions = useFiltersActions({ history });

  const { itemsPerPage } = QUERY_DEFAULT;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);

      const paramsQuery = getParamsQuery(params);

      try {
        const response = await ContourService.list({ ...QUERY_DEFAULT, ...paramsQuery });

        const dataSource = response?.data?.contours || [];
        const total = response?.data?.contoursCount || dataSource.length;

        setData({ dataSource, total });
      } catch (e) {
        console.error(e);
        showError(e);
      }
      setLoadingData(false);
    };

    fetchData();
  }, [params]);

  return (
    <div className="contours-table-container">
      <Filters
        {...{
          params,
          pushParams,
          filterSetName: 'contours',
          filtersActions,
          title: 'Контуры',
        }}
      />
      <TableFiltered
        {...{
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowKey: 'id',
          scroll: { x: 1600, y: 550 },
          paramKeys,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
    </div>
  );
}

export default Contours;
