import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { VzTableFiltered } from '@vezubr/components';
import { connect } from 'react-redux';

import { Bargains as BargainsService } from '@vezubr/services';

import useParams from '@vezubr/common/hooks/useParams';

import useColumnsCalc from './hooks/useColumnsCalc';
import useRowClassName from './hooks/useRowClassName';
import useFiltersActions from './hooks/useFiltersActions';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';

import { useHistory } from 'react-router-dom';
import { showError } from '@vezubr/elements';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
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

const tableKey = `auctions-${APP}`

const getParamsQuery = (params) => {
  const paramsQuery = { ...params };

  if (paramsQuery.bargainStatuses) {
    paramsQuery.bargainStatuses = paramsQuery.bargainStatuses.split(',').map((idString) => ~~idString);
  }

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page;
  }

  if (paramsQuery.orderId) {
    paramsQuery.orderId = +paramsQuery.orderId;
  }

  if (paramsQuery.orderType) {
    paramsQuery.orderType = +paramsQuery.orderType;
  }

  return paramsQuery;
};

function Auctions(props) {
  const history = useHistory();
  const { location } = history;
  const { dictionaries: dictionariesInput, user } = props;

  const [params, pushParams] = useParams({ history, location, paramsName: 'auctions', });

  const dictionaries = useConvertDictionaries({ dictionaries: dictionariesInput });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const oldColumns = useColumnsCalc({ dictionaries, user });

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns)

  const filtersActions = useFiltersActions({ dictionaries, setUseExport });

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);

    const paramsQuery = getParamsQuery(params);

    try {
      const response = await BargainsService.orderList({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.data, paramsQuery?.page)
      const total = response?.count || dataSource.length;

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
  }, [params]);

  const getDataFuncForExport = useCallback(async () => {
    const paramsQuery = getParamsQuery(params);

    const response = await BargainsService.orderList({
      ...QUERY_DEFAULT,
      ...paramsQuery,
      ...{ itemsPerPage: 100000, page: 1 },
    });

    const dataSource = Utils.getIncrementingId(response?.data, paramsQuery?.page)

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  const rowClassName = useRowClassName();

  return (
    <div className="auctions-table-container">
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'auctions',
          filtersActions,
          title: 'Торги',
        }}
      />
      <VzTableFiltered.TableFiltered
        {...{
          tableKey,
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
      <ExportCSV
        useExport={useExport}
        onFinishFunc={() => setUseExport(false)}
        setLoadingStatusFunc={setLoadingData}
        title={'Торги'}
        getDataFunc={getDataFuncForExport}
        filename={'Торги'}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}

Auctions.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  dictionaries: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  let { dictionaries, user } = state;

  return {
    dictionaries,
    user
  };
};

export default connect(mapStateToProps)(Auctions);
