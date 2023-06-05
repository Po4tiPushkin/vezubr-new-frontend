import useParams from '@vezubr/common/hooks/useParams';
import t from '@vezubr/common/localization';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import TableConfig from '@vezubr/components/tableConfig';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { showError } from '@vezubr/elements';
import { Drivers as DriversService } from '@vezubr/services';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ImportDriversAction from './actions/import-drivers-action';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import useRowClassName from './hooks/useRowClassName';
import './styles.scss';
import { useHistory } from 'react-router-dom';
import { Utils } from '@vezubr/common/common';
import TableSchedule from '@vezubr/components/tableSchedule';
import { SCHEDULE_ENTITIES } from '@vezubr/common/constants/constants';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  itemsPerPage: 'itemsPerPage',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = `drivers-${APP}`;

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  if (paramsQuery.filterSystemStates) {
    paramsQuery.filterSystemStates = paramsQuery.filterSystemStates.split(',').map((idString) => ~~idString);
  }

  if (paramsQuery.filterId) {
    paramsQuery.filterId = +paramsQuery.filterId
  }

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page;
  }

  return paramsQuery;
};

function DriversList(props) {
  const history = useHistory();
  const { location } = history;
  const { dictionaries } = props;

  const [params, pushParams] = useParams({ history, location, paramsName: 'drivers', });

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
      const response = await DriversService.list({ ...QUERY_DEFAULT, ...paramsQuery, page: +paramsQuery.page || 1 });
      const dataSource = Utils.getIncrementingId(response?.drivers, paramsQuery?.page)
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

    const response = await DriversService.list({
      ...QUERY_DEFAULT,
      ...paramsQuery,
    });

    const dataSource = response?.drivers || [];

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  const rowClassName = useRowClassName();

  return (
    <div className="drivers-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'drivers',
          filtersActions,
          title: t.driver('title'),
        }}
      />
      <TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          rowClassName,
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
        title={'Список водителей'}
        getDataFunc={getDataFuncForExport}
        filename={'Список водителей'}
      />

      <ImportDriversAction onOk={reloadData} />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
      <TableSchedule onSave={fetchData} entity={SCHEDULE_ENTITIES.drivers}/>
    </div>
  );
}

const mapStateToProps = (state) => {
  let { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(DriversList);
