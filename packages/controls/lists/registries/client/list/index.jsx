import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { showError } from '@vezubr/elements';

import { VzTableFiltered } from '@vezubr/components';
import { connect } from 'react-redux';
import { Invoices as InvoicesService } from '@vezubr/services';

import useParams from '@vezubr/common/hooks/useParams';
import { history } from '../../../../infrastructure';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import useRowClassName from './hooks/useRowClassName';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import TableConfig from '@vezubr/components/tableConfig';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = `client-registries-${APP}`

const validateParams = (params) => {
  const paramsVal = {};
  if (params.page) {
    paramsVal.page = +params.page;
  }
  if (params.paymentState) {
    paramsVal.paymentState = +params.paymentState;
  }
  if (params.invoiceSumMin) {
    paramsVal.invoiceSumMin = +params.invoiceSumMin * 100;
  }
  if (params.invoiceSumMax) {
    paramsVal.invoiceSumMax = +params.invoiceSumMax * 100;
  }
  if (params.orderId) {
    paramsVal.orderId = +params.orderId;
  }
  if (params.producerId) {
    paramsVal.producerId = +params.producerId;
  }
  return { ...params, ...paramsVal }
}
function Registries(props) {
  const { location } = history;
  const { dictionaries, user } = props;

  const [params, pushParams] = useParams({ history, location });

  const [useExport, setUseExport] = useState(false);

  const [updated, setUpdated] = useState(Date.now());
  const reload = useCallback(() => {
    setUpdated(Date.now);
  }, []);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [loadingData, setLoadingData] = useState(false);

  const oldColumns = useColumns({ dictionaries, reload, user });

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns)

  const filtersActions = useFiltersActions({ dictionaries, setUseExport });

  const { itemsPerPage } = QUERY_DEFAULT;


  const fetchData = async () => {
    setLoadingData(true);
    try {
      const paramsVal = validateParams(params);
      const response = await InvoicesService.invoices({ ...QUERY_DEFAULT, ...paramsVal });
      const dataSource = response?.invoices || [];
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
  }, [params, updated]);

  const getDataFuncForExport = useCallback(async () => {
    const response = await InvoicesService.invoices({
      ...QUERY_DEFAULT,
      ...params,
      ...{ itemsPerPage: 100000, page: 1 },
    });

    const dataSource = response?.invoices || [];

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  const rowClassName = useRowClassName();

  return (
    <div className="registries-table-container">
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          filterSetName: 'Registries',
          filtersActions,
          title: APP === 'dispatcher' ? 'Реестры от подрядчика' : 'Реестры',
        }}
      />

      <VzTableFiltered.TableFiltered
        {...{
          tableKey,
          theme: 'white',
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowKey: 'id',
          scroll: { x: width, y: '50vh' },
          paramKeys,
          rowClassName,
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
        title={'Реестры'}
        getDataFunc={getDataFuncForExport}
        filename={'Реестры'}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}

Registries.propTypes = {
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

export default connect(mapStateToProps)(Registries);
