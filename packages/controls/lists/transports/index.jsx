import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.scss';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';

import { Vehicle as VehicleService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';

import ImportTransportsAction from './actions/import-transports-action';
import { useHistory } from 'react-router-dom';
import useColumns from './hooks/useColumns';
import useRowClassName from './hooks/useRowClassName';
import useFiltersActions from './hooks/useFiltersActions';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import { showError } from '@vezubr/elements';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import TableConfig from '@vezubr/components/tableConfig';
import { Utils } from '@vezubr/common/common';
import TableSchedule from '@vezubr/components/tableSchedule';
import { SCHEDULE_ENTITIES } from '@vezubr/common/constants/constants';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderDirection: 'orderDirection',
  orderBy: 'orderBy',

};

const tableKey = `transports-${APP}`

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
    page: +params.page || 1,
  };
  const multiValueFields = ['categories'];

  for (const fieldName of multiValueFields) {
    if (paramsQuery[fieldName]) {
      paramsQuery[fieldName] = paramsQuery[fieldName].split(',').map((idString) => ~~idString);
    }
  }

  if (paramsQuery.uiStates) {
    paramsQuery.uiStates = paramsQuery.uiStates.split(',');
  }

  if (paramsQuery.plateNumber && paramsQuery.plateNumber.length < 2) {
    delete paramsQuery.plateNumber;
  }

  if (paramsQuery.filterId) {
    paramsQuery.filterId = +paramsQuery.filterId
  }

  return paramsQuery;
};

function Orders(props) {
  const history = useHistory();
  const { location } = history;
  const { dictionaries } = props;

  const [params, pushParams] = useParams({ history, location, paramsName: 'transports', });

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
      const response = await VehicleService.list({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.data, paramsQuery?.page)
      const total = response?.itemsCount || dataSource.length;
      setData({ dataSource, total });
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

    const response = await VehicleService.list({
      ...QUERY_DEFAULT,
      ...paramsQuery,
    });

    const dataSource = response?.data || [];

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
          filterSetName: 'transports',
          filtersActions,
          title: 'Транспортные средства',
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
        title={'Список ТС'}
        getDataFunc={getDataFuncForExport}
        filename={'Список ТС'}
      />

      <ImportTransportsAction onOk={reloadData} />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
      <TableSchedule onSave={fetchData} entity={SCHEDULE_ENTITIES.vehicles}/>
    </div>
  );
}

Orders.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  journalTypes: PropTypes.object,
  dictionaries: PropTypes.object,
};

Orders.contextTypes = {
  history: PropTypes.object,
};

const mapStateToProps = (state) => {
  let { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(Orders);
