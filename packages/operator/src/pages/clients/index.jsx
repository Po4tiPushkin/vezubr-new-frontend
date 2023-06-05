import React, { useCallback, useEffect, useState } from 'react';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';

import { Contragents } from '@vezubr/services/index.operator';
import useParams from '@vezubr/common/hooks/useParams';

import useColumns from './hooks/useColumns';
import useRowClassName from './hooks/useRowClassName';
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

  if (paramsQuery.filterStates) {
    paramsQuery.filterStates = paramsQuery.filterStates.split(',').map((n) => parseInt(n, 10));
  }

  return paramsQuery;
};

function Clients(props) {

  const { dictionaries, location, history } = props;

  const [params, pushParams] = useParams({ history, location });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [columns, width] = useColumns({ dictionaries });

  const filtersActions = useFiltersActions({ dictionaries });

  const { itemsPerPage } = QUERY_DEFAULT;

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);

      const paramsQuery = getParamsQuery(params);

      try {
        const response = await Contragents.clients({ ...QUERY_DEFAULT, ...paramsQuery });

        const dataSource = response?.data?.clients || [];
        const total = response?.data?.clientsCount || dataSource.length;

        setData({ dataSource, total });
      } catch (e) {
        if (typeof e?.message !== 'undefined') {
          showError(e);
        }
        console.error(e);
      }
      setLoadingData(false);
    };

    fetchData();
  }, [params]);


  const rowClassName = useRowClassName();

  return (
    <div className="clients-table-container">
      <Filters
        {...{
          params,
          pushParams,
          filterSetName: 'clients',
          filtersActions,
          title: 'Заказчики',
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
          scroll: { x: width, y: '50vh' },
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

export default connect(mapStateToProps)(Clients);
