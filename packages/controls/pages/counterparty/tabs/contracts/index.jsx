import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';

import { Contracts as ContractsService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';

import useColumns from './hooks/useColumns';
import useRowClassName from './hooks/useRowClassName';
import useFiltersActions from './hooks/useFiltersActions';
import { showError } from '@vezubr/elements';
import Agreements from '../agreements';
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
    paramsQuery.isActive =  Boolean(~~paramsQuery.isActive);
  }

  return paramsQuery;
};

function Contracts(props) {
  const history = useHistory();
  const { location } = history;
  const { dictionaries, id, info, user, isManager = false } = props;

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

  const columns = useColumns({ dictionaries, history, user, contractorId: id, isManager });

  const filtersActions = useFiltersActions({ history, id, dictionaries, info });

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      const paramsQuery = getParamsQuery(params);
      try {
        const contracts = await ContractsService.contourList({...paramsQuery, contractor: id });
        const agreementsWithoutContracts = await ContractsService.agreementsWithoutContractList({contractor: parseInt(id)})

        const dataSource = [...agreementsWithoutContracts, ...contracts] || [];
        const total = dataSource.length;
        setData({ dataSource, total });
      } catch (e) {
        console.error(e);
        showError(e);
      }
      setLoadingData(false);
    };

    fetchData();
  }, [params, id]);

  const rowClassName = useRowClassName();

  return (
    <div className="contracts-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'orders',
          filtersActions,
        }}
      />
      <TableFiltered
        {...{
          params,
          pushParams,
          loading: loadingData,
          columns,
          expandedRowRender: (column) => {
            return <Agreements dictionaries={dictionaries} agreements={column.additionalAgreements} />;
          },
          dataSource,
          rowClassName,
          rowKey: 'id',
          scroll: { x: true, y: 550 },
          paramKeys,
          responsive: false,
        }}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  let { dictionaries, user } = state;

  return {
    dictionaries,
    user,
  };
};

export default connect(mapStateToProps)(Contracts);
