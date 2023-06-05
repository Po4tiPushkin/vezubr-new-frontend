import React, { useState, useCallback, useMemo, useEffect } from 'react';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions'
import { VzTableFiltered } from '@vezubr/components';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import { useSelector } from 'react-redux';
import { Insurers as InsurerServices } from '@vezubr/services';
import { showError } from "@vezubr/elements";
import { history } from '../../../../../infrastructure';
import moment from 'moment';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import { Utils } from '@vezubr/common/common';
import TableConfig from '@vezubr/components/tableConfig';
import ExportCSV from '@vezubr/components/export/CSV';
const paramKeys = {
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
  page: 'page'
};

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const tableKey = `insured-orders-${APP}`;

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  }
  if (paramsQuery.orderNr && paramsQuery.orderNr?.length < 2) {
    delete paramsQuery.orderNr;
  }
  if (paramsQuery.beneficiary && paramsQuery.beneficiary?.length < 2) {
    delete paramsQuery.beneficiary;
  }
  if (paramsQuery.contractNumber && paramsQuery.contractNumber?.length < 2) {
    delete paramsQuery.contractNumber;
  }
  return paramsQuery
}

function InsuredOrders(props) {
  const dictionaries = useSelector((state) => state.dictionaries);
  const { id } = props
  const [params, pushParams] = useParamsState(
    {
      paramsDefault: {
        toStartAtDateFrom: moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
        toStartAtDateTill: moment().endOf('day').format('YYYY-MM-DD'),
      },
    }
  );
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });
  const [useExport, setUseExport] = useState(false);

  const { itemsPerPage } = QUERY_DEFAULT;

  const { dataSource, total } = data;

  const oldColumns = useColumns({ dictionaries, history })
  const [columns, width] = useColumnsGenerator(tableKey, oldColumns)

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params)
    try {
      const response = await InsurerServices.insuredOrders(id, { ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response.orders, paramsQuery.page)
      const total = response.itemsCount;
      setData({ dataSource, total });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  }, [id, params])

  useEffect(() => {
    fetchData();
  }, [params]);

  const filtersActions = useFiltersActions({ dictionaries, setUseExport });

  const getDataFuncForExport = React.useCallback(async (config) => {
    const paramsQuery = getParamsQuery(params, dictionaries);
    await Utils.exportList(InsurerServices, {
      ...QUERY_DEFAULT,
      ...paramsQuery,
      insurerId: id
    },
    config
    );

    return () => { };
  }, [columns, params]);

  return (
    <div className={'center insurer-orders size-1'}>
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          filterSetName: 'insured-orders',
          filtersActions,
          showArrow: false,
          title: 'Рейсы',
        }}
      />
      <div className='insured-order__table'>
        <VzTableFiltered.TableFiltered
          {...{
            params,
            paramKeys,
            loading: loadingData,
            pushParams,
            dataSource,
            columns,
            total,
            responsive: false,
            rowKey: 'number',
            scroll: { x: width, y: 450 },
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
          title={'Застрахованные рейсы'}
          getDataFunc={getDataFuncForExport}
          filename={'Застрахованные рейсы'}
        />
        <TableConfig tableKey={tableKey} onSave={fetchData} onExport={getDataFuncForExport}/>

      </div>

    </div>
  )
}

export default InsuredOrders;
