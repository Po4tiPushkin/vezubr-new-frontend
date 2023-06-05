import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { MonitorDateRange } from '@vezubr/components';
import { Filters } from '@vezubr/components/tableFiltered';
import { Tabs } from '@vezubr/controls';
import compose from '@vezubr/common/hoc/compose';
import { Route, Switch } from 'react-router';
import { createRouteWithParams, ROUTE_PARAMS, ROUTES } from '@vezubr/controls/infrastructure';
import { Profile as ProfileService, Vehicle as VehicleService, Orders as OrdersService } from '@vezubr/services';

import * as M from '..';
import './styles.scss'

import MonitorTabSelection from './tabs/monitor-tab-selection';
import MonitorTabExecution from './tabs/monitor-tab-execution';
import MonitorTabPaperCheck from './tabs/monitor-tab-paper-check';
import MonitorTabBargain from './tabs/monitor-tab-bargain';

import ActionAssignTransportToOrder from './components/action/action-assign-transport-to-order';
import ActionAssignLoadersToOrder from './components/action/action-assign-loaders-to-order';
import {
  STORE_MONITOR_PARAMS,
  STORE_VAR_EDIT_SHARING,
} from './constants';
import { ActionEditSharing } from '@vezubr/order/form';
import useMonitorSocket from '@vezubr/common/hooks/useMonitorSocket'
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLocalStorageItem } from '@vezubr/common/common/utils';
const ROUTE_MONITOR_SELECTION = createRouteWithParams(ROUTES.MONITOR, { [ROUTE_PARAMS.paramOptions]: 'selection' });
const ROUTE_MONITOR_EXECUTION = createRouteWithParams(ROUTES.MONITOR, { [ROUTE_PARAMS.paramOptions]: 'execution' });
const ROUTE_MONITOR_PAPER_CHECK = createRouteWithParams(ROUTES.MONITOR, { [ROUTE_PARAMS.paramOptions]: 'paper-check' });
const ROUTE_MONITOR_AUCTIONS = createRouteWithParams(ROUTES.MONITOR, { [ROUTE_PARAMS.paramOptions]: 'auctions' });

const tabs = {
  attrs: {
    className: 'monitor-tabs',
  },
  items: [
    {
      title: (
        <M.LabelProblems type={'order'} filteredFunc={M.Utils.filterOrderSelection}>
          Подбор
        </M.LabelProblems>
      ),
      id: 'monitor-selection',
      route: ROUTE_MONITOR_SELECTION,
      additionalRoutesMatch: [{ route: ROUTES.MONITOR }],
    },
    {
      title: (
        <M.LabelProblems type={'order'} filteredFunc={M.Utils.filterOrderBargain}>
          Торги
        </M.LabelProblems>
      ),
      id: 'monitor-bargains',
      route: ROUTE_MONITOR_AUCTIONS,
    },
    {
      title: (
        <M.LabelProblems type={'order'} filteredFunc={M.Utils.filterOrderExecution}>
          Исполнение
        </M.LabelProblems>
      ),
      id: 'monitor-execution',
      route: ROUTE_MONITOR_EXECUTION,
    },
    {
      title: (
        <M.LabelProblems type={'order'} filteredFunc={M.Utils.filterOrderPaperCheck}>
          Проверка документов
        </M.LabelProblems>
      ),
      id: 'monitor-paper-check',
      route: ROUTE_MONITOR_PAPER_CHECK,
    },
  ],
};


const Monitor = (props) => {
  const { store, match } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const { dictionaries, currentTab, user, userSettings } = useSelector(state => state);

  const thisTab = match?.params?.paramOptions || 'selection';

  if (thisTab !== currentTab) {
    dispatch({ type: 'SET_CURRENT_TAB', payload: thisTab })
  }

  useMonitorSocket();
  const dateRange = useMemo(() => {
    return (
      <MonitorDateRange />
    )
  }, [currentTab])

  const defaultParameters = M.useDefaultParams();

  const params = useMemo(() => ({
    ...defaultParameters,
    ...store.getVar(STORE_MONITOR_PARAMS)
  }), [store.getVar(STORE_MONITOR_PARAMS), defaultParameters])

  const [userName, setUserName] = useState('Я');

  const setParams = useCallback((newParams) => {
    if (newParams && newParams.toStartAtDateFrom && newParams.toStartAtDateTill) {
      setLocalStorageItem('toStartAtDateFromMonitor', newParams.toStartAtDateFrom);
      setLocalStorageItem('toStartAtDateTillMonitor', newParams.toStartAtDateTill);
    }
    else {
      setLocalStorageItem('toStartAtDateFromMonitor', null);
      setLocalStorageItem('toStartAtDateTillMonitor', null);
    }
    store.setVar(STORE_MONITOR_PARAMS, newParams)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const { name, surname, patronymic } = await ProfileService.contractorGetUser(user?.decoded?.userId)
      setUserName(`${surname} ${name ? name[0] + '.' : ''} ${patronymic ? patronymic[0] + '.' : ''}`)
    }
    fetchData()
  }, [])

  const filtersActions = M.useFiltersActions(userName, userSettings.monitorFilter)

  const filters = useMemo(() => {
    return (
      <Filters
        {...{
          params,
          pushParams: setParams,
          filterSetName: 'monitor',
          filtersActions,
          forceUpdate: true
        }}
      />
    )
  }, [filtersActions, setParams, params]);

  const closeModal = useCallback(() => {
    store.deleteVar(STORE_VAR_EDIT_SHARING);
  }, []);

  const orderId = M.useGetVar(STORE_VAR_EDIT_SHARING);

  const order = orderId && store.getItemById(orderId, 'order');
  return (
    <>
      <M.Page tabs={<Tabs {...tabs} />} dateRange={dateRange} filters={filters}>
        <Switch>
          <Route {...ROUTE_MONITOR_EXECUTION} component={MonitorTabExecution} />
          <Route {...ROUTE_MONITOR_PAPER_CHECK} component={MonitorTabPaperCheck} />
          <Route {...ROUTE_MONITOR_AUCTIONS} component={MonitorTabBargain} />
          <Route {...ROUTES.MONITOR} component={MonitorTabSelection} />
        </Switch>
      </M.Page>
      {APP !== 'client' && (
        <>
          <ActionAssignTransportToOrder />
          <ActionAssignLoadersToOrder />
        </>
      )}
      {order &&
        <ActionEditSharing
          closeModal={() => closeModal()}
          showModal={!!orderId}
          order={order}
          history={history}
        />
      }
    </>
  )
}

export default M.withStore((store) => {
  const deleteOrder = async (order) => {
    try {
      await OrdersService.cancelRequest(order.requestId);
      store.deleteGroup(order.groupBy, order.type);
    } catch (e) {
      console.error(e);
      showError(e);
    }
  };
  return {
    deleteOrder
  }
})(Monitor);