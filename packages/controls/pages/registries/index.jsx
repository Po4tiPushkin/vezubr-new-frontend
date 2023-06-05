import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';

import { Registries as RegistriesService } from '@vezubr/services';
import { showError } from '@vezubr/elements';
import useParams from '@vezubr/common/hooks/useParams';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import preparingData from './data/preparingData';
import useRowClassName from './hooks/useRowClassName';
import setModalError from '@vezubr/components/DEPRECATED/setModalError';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import TableConfig from '@vezubr/components/tableConfig';
import { useHistory } from 'react-router-dom';
const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = 'registries-producer';

function Registries(props) {
  const history = useHistory();

  const { dictionaries, location, user } = props;

  const [params, pushParams] = useParams({ history, location });

  const [useExport, setUseExport] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [loadingData, setLoadingData] = useState(false);

  const oldColumns = useColumns(dictionaries, user);

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);

  const filtersActions = useFiltersActions({ dictionaries, setUseExport });

  const { itemsPerPage } = QUERY_DEFAULT;

  const validateParams = (params) => {
    const paramsVal = {};
    if (params.page) {
      paramsVal.page = +params.page;
    }
    if (params.orderId) {
      paramsVal.orderId = +params.orderId;
    }
    if (params.paymentState) {
      paramsVal.paymentState = +params.paymentState;
    }
    if (params.registrySumFrom) {
      paramsVal.registrySumFrom = +params.registrySumFrom * 100;
    }
    if (params.registrySumTill) {
      paramsVal.registrySumTill = +params.registrySumTill * 100;
    }
    return { ...params, ...paramsVal };
  };

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const paramsVal = validateParams(params);
      const response = await RegistriesService.getRegistries({ ...QUERY_DEFAULT, ...paramsVal });

      const dataSource = preparingData(response?.registries || []);
      const total = response?.itemsCount || dataSource.length;

      setData({ dataSource, total });
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        showError(e);
      }
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const getDataFuncForExport = useCallback(async () => {
    const response = await RegistriesService.getRegistries({
      ...QUERY_DEFAULT,
      ...params,
      ...{ itemsPerPage: 100000, page: 1 },
    });

    const dataSource = response?.registries || [];

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  const rowClassName = useRowClassName();

  return (
    <div className="registries-table-container">
      <Filters
        {...{
          params,
          pushParams,
          filterSetName: 'Registries',
          filtersActions,
          title: 'Реестры',
        }}
      />

      <TableFiltered
        {...{
          theme: 'white',
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowKey: 'id',
          scroll: { x: width, y: '50vh' },
          paramKeys,
          width,
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
  journalTypes: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  let { dictionaries, user } = state;

  return {
    dictionaries,
    user,
  };
};

export default connect(mapStateToProps)(Registries);
