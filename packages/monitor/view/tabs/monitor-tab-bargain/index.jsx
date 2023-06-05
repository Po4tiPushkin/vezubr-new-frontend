import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import * as Monitor from '../../..';
import { Ant, showError } from '@vezubr/elements';
import { STORE_MONITOR_PARAMS, STORE_VAR_LOADING, STORE_VAR_WAITING, STORE_VAR_FETCHED_BARGAINS_ORDERS } from '../../constants';
import { ReactComponent as Eye_IconComponent } from '@vezubr/common/assets/img/icons/eye.svg';
import { history } from '@vezubr/controls/infrastructure';
import getMarkerIcon from '../../data/getMarkerIcon';
import { Orders as OrdersService } from '@vezubr/services'
import ListItem from '../../components/list/list-item';
import ListItemStatus from '../../components/list/list-item-status';
import ListItemIconSelection from '../../components/list/list-item-icon-selection';
import ActionLinkComment from '../../components/action/link/action-link-comment';
import ActionLinkBargain from '../../components/action/link/action-link-bargain';
import ActionLinkRemove from '../../components/action/link/action-link-remove';
import ActionLinkPin from '../../components/action/link/action-link-pin';
import ActionLinkEditSharing from '../../components/action/link/action-link-edit-sharing';
import { connect } from 'react-redux';
import useList from '../../hooks/useList';
import MapPopupContent from '../../components/map/map-popup-content';
import ListItemTimeAtArrival from "../../components/list/list-item-time-at-arrival";
import ActionLinkAssign from '../../components/action/link/action-link-assign';
import ActionLinkCancel from '../../components/action/link/action-link-cancel';
import useVehicleList from '../../hooks/useVehicleList';
import ContentBox from '@vezubr/controls/layout/contentBox/contentBox';

const { useGetNavWithBackByItem, useGetVar } = Monitor;

function MonitorTabBargain(props) {
  const { store } = useContext(Monitor.Context);
  const { monitorDates, currentTab, user } = props;
  const {
    orderBargainList,
    orderSelectionListPositions,
    orderExecutionListPositions,
    orderPaperCheckListPositions,
    orderBargainListPositions,
  } = useList();

  const params = useGetVar(STORE_MONITOR_PARAMS);
  const loading = useGetVar(STORE_VAR_LOADING);
  const waiting = useGetVar(STORE_VAR_WAITING);
  const isFetched = useGetVar(STORE_VAR_FETCHED_BARGAINS_ORDERS)

  const viewAction = useGetNavWithBackByItem(
    useCallback((order) => `/orders/${order.id}/auctions`, []),
    location,
    history
  );

  const currentParams = useMemo(() => {
    if (!currentTab || !monitorDates || !monitorDates[currentTab] || currentTab !== 'auctions') {
      return null
    }
    const { toStartAtDateFrom, toStartAtDateTill } = monitorDates[currentTab].date
    return {
      toStartAtDateFrom: toStartAtDateFrom ? `${toStartAtDateFrom} 00:00:00` : toStartAtDateFrom,
      toStartAtDateTill: toStartAtDateTill ? `${toStartAtDateTill} 23:59:59` : toStartAtDateFrom
    }

  }, [currentTab, monitorDates]);

  const fetchData = useCallback(async () => {
    const loadingOrders = store.getVarNoComputed(STORE_VAR_LOADING);
    const dynamicParams = store.dynamicParams();

    store.setVar(STORE_VAR_LOADING, true);
    try {
      const responseOrders = await OrdersService.monitoringBargains({ ...dynamicParams, ...params, ...currentParams });
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

  const listCluster = React.useMemo(
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
        checked: false,
        name: 'Рейсы на проверке',
        data: orderPaperCheckListPositions,
      },

      bargain: {
        checked: true,
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
    [listCluster, fitBoundsTimestamp, viewAction],
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
        list: orderBargainList,
        ItemComponent: ListItem,
        itemComponentProps: {
          tab: 'auctions',
          StatusComponent: ListItemStatus,
          IconComponent: ListItemIconSelection,
          viewAction,
          actions: {
            comment: ActionLinkComment,
            // edit: ActionLinkEditSharing,
            // assign: ActionLinkAssign,
            // cancel: ActionLinkCancel,
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
      if (APP !== 'client') {
        data.itemComponentProps.actions.assign = ActionLinkAssign;
        data.itemComponentProps.actions.cancel = ActionLinkCancel;
      }
      return data;

    },
    [orderBargainList, viewAction, empty],
  );

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

export default connect(mapStateToProps)(MonitorTabBargain)