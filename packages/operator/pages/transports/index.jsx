import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';
import { showError } from '@vezubr/elements';

import { Vehicle as VehicleService } from '@vezubr/services';
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

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  ['filterVehicleTypeIds'].forEach((p) => {
    if (paramsQuery[p]) {
      paramsQuery[p] = paramsQuery[p].split(',').map((n) => parseInt(n, 10));
    }
  });

  return paramsQuery;
};

function Transports(props) {

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

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);

      const paramsQuery = getParamsQuery(params);

      try {
        const response = await VehicleService.list({ ...QUERY_DEFAULT, ...paramsQuery });
        const dataSource = response?.data?.vehicles || [];
        const total = response?.data?.vehiclesCount || dataSource.length;

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
    <div className="transports-table-container">
      <Filters
        {...{
          params,
          pushParams,
          filterSetName: 'transports',
          filtersActions,
          title: 'Транспортные средства',
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
          scroll: { x: 2000, y: 500 },
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

export default connect(mapStateToProps)(Transports);
