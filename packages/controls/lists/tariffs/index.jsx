import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import { VzTableFiltered } from '@vezubr/components';
import { showError } from '@vezubr/elements';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import useParams from '@vezubr/common/hooks/useParams';
import * as Tariff from '@vezubr/tariff';
import { connect, useSelector } from 'react-redux';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import { Tariff as TariffService } from '@vezubr/services';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import TableConfig from '@vezubr/components/tableConfig';

import { history } from '../../infrastructure';
import { Utils } from '@vezubr/common/common';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = `tariffs-${APP}`;

const validateParams = (params) => {
  const paramsVal = {};
  if (params.page) {
    paramsVal.page = +params.page;
  }

  if (params.status) {
    paramsVal.status = +params.status;
  }

  return { ...params, ...paramsVal }
}

function TariffList(props) {
  const { dictionaries, location } = props;
  const user = useSelector((state) => state.user);
  const [params, pushParams] = useParams({ history, location, paramsDefault: { status: '1' } });

  const [loadingData, setLoadingData] = useState(false);
  const { territories } = dictionaries;

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const oldColumns = useColumns({ territories });

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns)

  const filtersActions = useFiltersActions({ dictionaries, setUseExport, history });

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);

    try {
      const valParams = validateParams(params);
      const response = await TariffService.list({ ...QUERY_DEFAULT, ...valParams });
      const dataSource = Utils.getIncrementingId(response?.tariffs, valParams?.page)

      const total = response?.itemsCount;

      setData({ dataSource, total });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const getDataFuncForExport = useCallback(async () => {
      const valParams = validateParams(params);
      const response = await TariffService.list({
      ...QUERY_DEFAULT,
      ...valParams,
      ...{ itemsPerPage: 100000, page: 1 },
    });

    const dataSource = response?.tariffs || response?.data?.tariffs || response || [];

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  return (
    <div className="tariff-list-table-container">
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          filterSetName: 'tariffs',
          filtersActions,
          title: 'Тарифы',
        }}
      />
      <VzTableFiltered.TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          expandedRowRender: (record) => {
            if (record.orderType === 'loaders_order') {
              return <Tariff.TableLoadersExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
            }
            else if (record.type === 1) {
              return <Tariff.TableHourlyExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
            } else if (record.type === 3) {
              return <Tariff.TableFixedExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
            } else if (record.type === 4) {
              return <Tariff.TableMileageExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
            }
            return null;
          },
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
        title={'Тарифы'}
        getDataFunc={getDataFuncForExport}
        filename={'Тарифы'}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}

TariffList.propTypes = {
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

export default connect(mapStateToProps)(TariffList);
