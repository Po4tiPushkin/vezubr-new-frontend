import * as Order from '@vezubr/order/form';
import React from 'react';
import PropTypes from 'prop-types';
import { useObserver } from 'mobx-react';
import { useSelector } from 'react-redux';

function ListItemIconSelection(props) {
  const { order, icon } = props;
  const { vehicleTypes } = useSelector((state) => state.dictionaries);

  return useObserver(() => {
    const { problems = [], orderType, requiredVehicleType } = order.data;
    const hasProblem = !!problems.find(el => el?.status === 1);
    const orderCategory = vehicleTypes.find(item => item.id == requiredVehicleType)?.category

    if (hasProblem) {
      return icon;
    }

    if (order.uiState?.state === 106 || order.uiState?.state === 107) {
      return Order.Icons.renderBlackBitmapIconTruck(orderType, orderCategory);
    } else {
      return Order.Icons.renderGreyBitmapIconTruck(orderType, orderCategory);
    }
  });
}

export default ListItemIconSelection;
