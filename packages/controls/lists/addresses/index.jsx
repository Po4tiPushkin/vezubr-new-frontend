import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { VzTableFiltered, MultiSelect } from '@vezubr/components';

import { showError, showAlert } from '@vezubr/elements';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import useParams from '@vezubr/common/hooks/useParams';
import useRowSelection from '@vezubr/common/hooks/useRowSelection';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import { Address as AddressService } from '@vezubr/services';
import Utils from '@vezubr/common/common/utils'
import { history } from '../../infrastructure';
import useRowClassName from './hooks/useRowClassName';
import t from '@vezubr/common/localization';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';

import TableConfig from '@vezubr/components/tableConfig';
import ImportAdressesAction from './actions/import-addresses-action';
const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const getParamsQuery = (params) => {
  const paramsQuery = { ...params };

  if (paramsQuery.status) {
    paramsQuery.status = paramsQuery.status === 'true' ? true : false;
  }

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page
  }

  if (paramsQuery.regionId) {
    paramsQuery.regionId = ~~paramsQuery.regionId;
  }

  return paramsQuery;
};

const tableKey = `addresses-${APP}`;

function AddressList(props) {
  const { dictionaries: dictionariesInput, location } = props;

  const [params, pushParams] = useParams({ history, location, paramsName: 'addresses' });

  const [loadingData, setLoadingData] = useState(false);

  const dictionaries = useConvertDictionaries({ dictionaries: dictionariesInput });
  const [rowSelection, multiSelect, setMultiSelect] = useRowSelection();
  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const oldColumns = useColumns();
  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);
  const [canRefreshFilters, setCanRefreshFilters] = useState(false);

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);

    const paramsQuery = getParamsQuery(params)

    try {
      const response = await AddressService.list({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.points, paramsQuery?.page)
      const total = response.itemsCount;

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
    await Utils.exportList(AddressService, {
      ...QUERY_DEFAULT,
      ...paramsQuery,
      ...{ itemsPerPage: 100, page: 1 },
    })
    return () => { };
  }, [columns, params]);

  const onGroupEdit = useCallback(async (data) => {
    try {
      await AddressService.groupUpdate({ contractorPointsUpdate: data });
      setMultiSelect(false);
      fetchData();
    } catch (e) {
      console.error(e);
      showError(e)
    }
  }, [])

  const rowClassName = useRowClassName();

  const [cargoRegions, setCargoRegions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataSource = await AddressService.regionsList();

        setCargoRegions(dataSource);
      } catch (e) {
        console.error(e);
        showError(e);
      }
    };
    fetchData();
  }, []);

  const filtersActions = useFiltersActions({
    dictionaries,
    setUseExport,
    history,
    cargoRegions,
    fetchData,
    pushParams,
    setCanRefreshFilters,
    multiSelect,
    setMultiSelect,
  });

  return (
    <div className="orders-table-container">
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          paramKeys,
          canRefreshFilters,
          setCanRefreshFilters,
          visibleSaveButtons: true,
          filterSetName: 'addresses',
          filtersActions,
          title: 'Адреса',
        }}
      />
      {multiSelect &&
        <MultiSelect
          tableName={'addresses'}
          history={history}
          onSave={onGroupEdit}
          location={location}
          selectedRows={rowSelection.selectedRows.map(el => dataSource.find(item => el === item.id))}
        />
      }
      <VzTableFiltered.TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowClassName,
          rowSelection,
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
        title={'Адреса'}
        getDataFunc={getDataFuncForExport}
        filename={'Адреса'}
      />
      <ImportAdressesAction onOk={fetchData} />
      <TableConfig
        tableKey={tableKey}
        onSave={fetchData}
      />
    </div>
  );
}

AddressList.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  dictionaries: PropTypes.object,
};

const mapStateToProps = (state) => {
  let { dictionaries = {} } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(AddressList);
