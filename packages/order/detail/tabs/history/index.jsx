import React, { useContext, useEffect, useState } from 'react';
import * as TableFiltered from '@vezubr/components/tableFiltered';
import { Orders as OrderService } from '@vezubr/services';
import { showError, VzEmpty } from '@vezubr/elements';
import useFiltersActions from './hooks/useFiltersActions';
import useColumns from './hooks/useColumns';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import { uuid } from '@vezubr/common/utils';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OrderViewContext from '../../context';
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

  return paramsQuery;
};

const OrderViewHistory = (props) => {
  const { order, employees } = useContext(OrderViewContext);
  const history = useHistory();
  const { location } = history
  const dictionaries = useSelector(state => state.dictionaries);
  const [params, pushParams] = useParamsState({
    history,
    location,
    paramsDefault: {
      createdAt: moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
      creationDateTo: moment().endOf('day').format('YYYY-MM-DD'),
    },
  });

  const [loadingData, setLoadingData] = useState(false);

  const [columns, width] = useColumns({ dictionaries, points: order?.points, employees });

  const { itemsPerPage } = QUERY_DEFAULT;

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
    fieldTypesList: []
  });

  const { dataSource, total, fieldTypesList } = data;

  const fetchData = async () => {
    setLoadingData(true);

    try {
      const response = await OrderService.history(order.id, { ...QUERY_DEFAULT, ...getParamsQuery(params) });
      const dataSource = (response?.data || []).map(item => ({ ...item, uuid: uuid() }));

      const total = response.count || 0;

      const fieldTypesList = response?.fieldTypes || [];

      setData({ dataSource, total, fieldTypesList });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (order.id) {
      fetchData();
    }
  }, [params, order]);


  const filtersActions = useFiltersActions({
    dictionaries,
    fieldTypesList,
    history,
  });

  return (
    <div className="order-table-container order-view__tab">
      {dataSource ? (
        <div className='order-table-container__main' >
          <TableFiltered.Filters
            {...{
              params,
              pushParams,
              paramKeys,
              filterSetName: 'order-history',
              filtersActions,
            }}
          />
          <TableFiltered.TableFiltered
            {...{
              params,
              pushParams,
              loading: loadingData,
              columns,
              dataSource,
              rowKey: 'uuid',
              scroll: { x: width, y: 450 },
              paramKeys,
              paginatorConfig: {
                total,
                itemsPerPage,
              },
              responsive: false,
            }}
          />
        </div>
      ) : (
        <div className={'white-container connected-order flexbox column cargo-history__height'}>
          <VzEmpty className={'margin-top-100'} vzImageName={'emptyDocuments'} title={'История заказа'} />
        </div>
      )}
    </div>
  );
}

export default OrderViewHistory;
