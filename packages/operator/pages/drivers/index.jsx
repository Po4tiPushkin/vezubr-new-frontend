import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';
import { showError } from '@vezubr/elements';
import { Drivers as DriversService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';

import useColumns from './hooks/useColumns';
import useRowClassName from './hooks/useRowClassName';
import useFiltersActions from './hooks/useFiltersActions';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

function Drivers(props) {

  const { dictionaries, location, history } = props;

  const [params, pushParams] = useParams({ history, location });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const columns = useColumns({ dictionaries });

  const filtersActions = useFiltersActions({ dictionaries, setUseExport });

  const { itemsPerPage } = QUERY_DEFAULT;

  const getParamsQuery = useCallback(
    (params) => {
      const paramsQuery = {
        ...params,
      };

      const multiValueFields = ['filterSystemStates'];

      for (const fieldName of multiValueFields) {
        if (paramsQuery[fieldName]) {
          paramsQuery[fieldName] = paramsQuery[fieldName].split(',').map((idString) => ~~idString);
        }
      }
  
      return paramsQuery;
    },
    [dictionaries?.employeesStageToStateMap],
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);

      const paramsQuery = getParamsQuery(params);

      try {
        const response = await DriversService.list({ ...QUERY_DEFAULT, ...paramsQuery });

        const dataSource = response?.data?.drivers || [];
        const total = response?.data?.driversCount || dataSource.length;

        setData({ dataSource, total });
      } catch (e) {
        console.error(e);
        showError(e);
      }
      setLoadingData(false);
    };

    fetchData();
  }, [params]);

  const rowClassName = useRowClassName();

  return (
    <div className="drivers-table-container">
      <Filters
        {...{
          params,
          pushParams,
          filterSetName: 'drivers',
          filtersActions,
          title: 'Водители',
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
          scroll: { x: 2300, y: 500 },
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

const mapStateToProps = (state, ownProps) => {
  let { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(Drivers);
