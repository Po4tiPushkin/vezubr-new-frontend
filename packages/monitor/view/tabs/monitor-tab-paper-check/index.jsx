import React, { useCallback, useEffect, useMemo, useContext } from 'react';
import * as Monitor from '../../..';
import { MONITOR_ORDER_STATES_PAPER_CHECK } from '../../..';
import { Ant, showError } from '@vezubr/elements';
import { history } from '@vezubr/controls/infrastructure';
import { ReactComponent as Eye_IconComponent } from '@vezubr/common/assets/img/icons/eye.svg';
import { connect } from 'react-redux';
import getMarkerIcon from '../../data/getMarkerIcon';
import { Orders as OrdersService } from '@vezubr/services';
import ListItem from '../../components/list/list-item';
import ListItemStatus from '../../components/list/list-item-status';
import ListItemCost from '../../components/list/list-item-cost';
import ListItemIconSelection from '../../components/list/list-item-icon-selection';
import ActionLinkComment from '../../components/action/link/action-link-comment';

import ActionLinkBargain from '../../components/action/link/action-link-bargain';
import ActionLinkPin from '../../components/action/link/action-link-pin';
import ActionLinkEditSharing from '../../components/action/link/action-link-edit-sharing';

import MapPopupContent from '../../components/map/map-popup-content';
import useList from '../../hooks/useList';

import { STORE_MONITOR_PARAMS, STORE_VAR_LOADING, STORE_VAR_WAITING, STORE_VAR_FETCHED_DOCUMENTS_ORDERS } from '../../constants';
import ListItemTimeAtArrival from "../../components/list/list-item-time-at-arrival";
import ContentBox from '@vezubr/controls/layout/contentBox/contentBox';

const { useGetNavWithBackByItem, useGetVar } = Monitor;

function MonitorTabPaperCheck(props) {
  const { store } = useContext(Monitor.Context);
  const { monitorDates, currentTab, user } = props;
  const {
    orderPaperCheckList,
    orderSelectionListPositions,
    orderExecutionListPositions,
    orderPaperCheckListPositions,
    orderBargainListPositions,
  } = useList();

  const currentParams = useMemo(() => {
    if (!currentTab || !monitorDates || !monitorDates[currentTab] || currentTab !== 'paper-check') {
      return null
    }
    const { toStartAtDateFrom, toStartAtDateTill } = monitorDates[currentTab].date
    return {
      toStartAtDateFrom: toStartAtDateFrom ? `${toStartAtDateFrom} 00:00:00` : toStartAtDateFrom,
      toStartAtDateTill: toStartAtDateTill ? `${toStartAtDateTill} 23:59:59` : toStartAtDateFrom
    }
  }, [currentTab, monitorDates]);

  const params = useGetVar(STORE_MONITOR_PARAMS);
  const loading = useGetVar(STORE_VAR_LOADING);
  const waiting = useGetVar(STORE_VAR_WAITING);
  const isFetched = useGetVar(STORE_VAR_FETCHED_DOCUMENTS_ORDERS);

  const viewAction = useGetNavWithBackByItem(
    useCallback((order) => {
      const { uiState } = order;
      let pathName = 'perpetrators';
      if (MONITOR_ORDER_STATES_PAPER_CHECK.includes(uiState?.state)) {
        pathName = APP === 'dispatcher' ? 'documents-order' : 'documents';
      }
      return `/orders/${order.id}/${pathName}`;
    }, []),
    location,
    history,
  );
  const fetchData = useCallback(async () => {
    const loadingOrders = store.getVarNoComputed(STORE_VAR_LOADING);
    const dynamicParams = store.dynamicParams();

    store.setVar(STORE_VAR_LOADING, true);
    try {
      const responseOrders = await OrdersService.monitoringDocuments({ ...dynamicParams, ...params, ...currentParams });
      store.clearData('order');
      store.setDirtyData(responseOrders, 'order');
    } catch (e) {
      console.error(e);
      showError(e);
    }
    finally {
      store.setVar(STORE_VAR_LOADING, false);
    }
  }, [currentParams, params]);

  const listCluster = useMemo(
    () => ({
      selection: {
        checked: false,
        name: 'Рейсы в подборе',
        data: orderSelectionListPositions,
      },

      execution: {
        checked: false,
        name: 'Рейсы в исполнении',
        data: orderExecutionListPositions,
      },

      paperCheck: {
        checked: true,
        name: 'Рейсы на проверке',
        data: orderPaperCheckListPositions,
      },

      bargain: {
        checked: false,
        name: 'Рейсы в торгах',
        data: orderBargainListPositions,
      },
    }),
    [orderSelectionListPositions, orderExecutionListPositions, orderPaperCheckListPositions, orderBargainListPositions],
  );

  const fitBoundsTimestamp = useMemo(() => Date.now(), []);

  const mapProps = useMemo(
    () => ({
      listCluster,
      fitBoundsTimestamp,
      getMarkerIcon,
      PopupContentComponent: MapPopupContent,
      popupContentComponentProps: {
        viewAction,
      },
    }),
    [listCluster, fitBoundsTimestamp],
  );

  useEffect(() => {
    fetchData();
  }, [params, currentParams]);

  const empty = useMemo(
    () => {
      if (APP !== 'client') {
        return (
          <ContentBox
            theme={`monitor`}
            sub={'monitor'}
            history={history}
            isBlocked={!user?.driversAdded || !user?.vehiclesAdded || !user?.profileFilled}
            isEmpty={false}
            user={user}
          />
        )
      } else {
        return null;
      }
    },
    [user],
  );

  const listProps = useMemo(
    () => {
      const data = {
        empty,
        list: orderPaperCheckList,
        ItemComponent: ListItem,
        itemComponentProps: {
          StatusComponent: ListItemStatus,
          IconComponent: ListItemIconSelection,
          CostComponent: ListItemCost,
          viewAction,
          actions: {
            comment: ActionLinkComment,
            // bargain: ActionLinkBargain,
            // edit: ActionLinkEditSharing,
            view: {
              children: <Ant.Icon component={Eye_IconComponent} />,
              onAction: viewAction,
              title: 'Перейти на страницу рейса',
            },
            pin: ActionLinkPin,
          },
        },
      }
      if (APP === 'dispatcher') {
        data.itemComponentProps.actions.edit = ActionLinkEditSharing;
      }
      return data;
    }, [orderPaperCheckList, empty])


  return (
    <Monitor.Content
      {...{
        listProps,
        mapProps,
        loading,
        waiting,
      }}
    />
  );
}

const mapStateToProps = (state) => {
  const { monitorDates, currentTab, user } = state;
  return {
    monitorDates,
    currentTab,
    user
  };
};

export default connect(mapStateToProps)(MonitorTabPaperCheck);

