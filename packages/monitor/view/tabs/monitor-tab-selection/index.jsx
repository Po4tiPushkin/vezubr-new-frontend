import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as Monitor from '../../..';
import { Ant, showError } from '@vezubr/elements';
import { STORE_MONITOR_PARAMS, STORE_VAR_LOADING, STORE_VAR_WAITING, STORE_VAR_FETCHED_SELECTED_ORDERS } from '../../constants';
import { history } from '@vezubr/controls/infrastructure';
import { ReactComponent as Eye_IconComponent } from '@vezubr/common/assets/img/icons/eye.svg';
import { ReactComponent as rpArrow } from '@vezubr/common/assets/img/icons/republishArrow.svg';
import { connect } from 'react-redux';
import getMarkerIcon from '../../data/getMarkerIcon';
import { Orders as OrdersService, Vehicle as VehicleService } from '@vezubr/services';
import ListItem from '../../components/list/list-item';
import ListItemStatus from '../../components/list/list-item-status';
import ListItemIconSelection from '../../components/list/list-item-icon-selection';
import ListItemTimeAtArrival from '../../components/list/list-item-time-at-arrival';
import ListItemCost from '../../components/list/list-item-cost';
import ActionLinkComment from '../../components/action/link/action-link-comment';
import ActionLinkBargain from '../../components/action/link/action-link-bargain';
import ActionLinkRemove from '../../components/action/link/action-link-remove';
import ActionLinkEditSharing from '../../components/action/link/action-link-edit-sharing';
import ActionLinkPin from '../../components/action/link/action-link-pin';
import ActionLinkAssign from '../../components/action/link/action-link-assign';
import MapPopupContent from '../../components/map/map-popup-content';

import useList from '../../hooks/useList';
import useVehicleList from '../../hooks/useVehicleList';
import ContentBox from '@vezubr/controls/layout/contentBox/contentBox';

const { useGetNavWithBackByItem, useGetVar } = Monitor;

function MonitorTabSelection(props) {
  const { store } = useContext(Monitor.Context);

  const { monitorDates, currentTab, user } = props;
  const {
    orderSelectionList,
    orderSelectionListPositions,
    orderExecutionListPositions,
    orderPaperCheckListPositions,
    orderBargainListPositions,
  } = useList();
  const params = useGetVar(STORE_MONITOR_PARAMS);
  const loading = useGetVar(STORE_VAR_LOADING);
  const waiting = useGetVar(STORE_VAR_WAITING);
  const isFetched = useGetVar(STORE_VAR_FETCHED_SELECTED_ORDERS);

  const currentParams = useMemo(() => {
    if (!currentTab || !monitorDates || !monitorDates[currentTab] || currentTab !== 'selection') {
      return null
    }
    const { toStartAtDateFrom, toStartAtDateTill } = monitorDates[currentTab].date
    return {
      toStartAtDateFrom: toStartAtDateFrom ? `${toStartAtDateFrom} 00:00:00` : toStartAtDateFrom,
      toStartAtDateTill: toStartAtDateTill ? `${toStartAtDateTill} 23:59:59` : toStartAtDateFrom
    }

  }, [currentTab, monitorDates]);

  const fetchData = useCallback(async () => {
    const dynamicParams = store.dynamicParams();
    store.setVar(STORE_VAR_LOADING, true);
    try {
      const responseOrders = await OrdersService.monitoringSelecting({ ...dynamicParams, ...params, ...currentParams });
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

  const fetchVehicles = useCallback(async () => {
    const responseVehicles = await VehicleService.getListForDashboard();
    store.setDirtyData(responseVehicles, 'vehicle');
  }, [])

  useEffect(() => {
    if (APP !== 'client') {
      fetchVehicles();
    }
  }, [])

  const viewAction = useGetNavWithBackByItem(
    useCallback((order) => `/orders/${order.id}`, []),
    location,
    history,
  );

  const { vehicleListPositions } = useVehicleList();

  const listCluster = useMemo(
    () => {
      const data = {
        selection: {
          checked: true,
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
          checked: false,
          name: 'Рейсы в торгах',
          data: orderBargainListPositions,
        },
      }
      if (APP !== 'client') {
        data.vehicleFree = {
          checked: true,
          name: 'Свободные ТС',
          data: vehicleListPositions,
        }
      }
      return data;
    },
    [orderSelectionListPositions, orderExecutionListPositions, orderPaperCheckListPositions, orderBargainListPositions, vehicleListPositions],
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
    fetchData()
  }, [currentParams, params]);

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

  const listProps = React.useMemo(
    () => {
      const data = {
        empty,
        list: orderSelectionList,
        ItemComponent: ListItem,
        itemComponentProps: {
          CostComponent: ListItemCost,
          StatusComponent: ListItemStatus,
          IconComponent: ListItemIconSelection,
          viewAction,
          actions: {
            comment: ActionLinkComment,
            // edit: ActionLinkEditSharing,
            // assign: ActionLinkAssign,
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
      }
      if (APP === 'client') {
        data.itemComponentProps.actions.delete = ActionLinkRemove
      }
      return data;
    },
    [orderSelectionList, empty],
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

export default connect(mapStateToProps)(MonitorTabSelection);
