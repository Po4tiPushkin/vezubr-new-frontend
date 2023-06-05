import React, { useEffect, useState } from 'react';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';

import { Insurers as InsurersService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';

import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import { showError } from '@vezubr/elements';
import { useHistory } from 'react-router-dom';

const QUERY_DEFAULT = {
  orderBy: 'id',
  orderDirection: 'DESC',
};

const paramKeys = {
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  if (paramsQuery.isActive) {
    paramsQuery.isActive = Boolean(~~paramsQuery.isActive);
  }

  return paramsQuery;
};

const InsurerContracts = (props) => {
  const history = useHistory();
  const { location } = history;
  const { id } = props;

  const [params, pushParams] = useParams({
    history,
    location,
    paramsDefault: { isActive: '1' },
  });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [columns, width] = useColumns();

  const filtersActions = useFiltersActions({ history, id });

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const contracts = await InsurersService.contracts(id);
      const dataSource = contracts;
      const total = dataSource.length;
      setData({ dataSource, total });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, [params, id]);

  // const rowClassName = useRowClassName();

  return (
    <div className="insurer-contracts-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'insurer-contracts',
          filtersActions,
        }}
      />
      <TableFiltered
        {...{
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          // rowClassName,
          rowKey: 'id',
          scroll: { x: width, y: 550 },
          paramKeys,
          responsive: false,
        }}
      />
    </div>
  );
}

export default (InsurerContracts);
