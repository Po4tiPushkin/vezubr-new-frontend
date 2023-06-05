import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import StatusNotification from '../statusNotification/statusNotification';
import { Orders as OrdersService } from '@vezubr/services';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Utils } from '@vezubr/common/common';

/**
 * @types
 * [info, order,connectedOrder,canceled]
 */
class StatusesModalContent extends PureComponent {
  async extendByMinutes(orderId) {
    const { onModalClose } = this.props;
    await OrdersService.extendSelecting(orderId);
    onModalClose('accept');
  }

  async acceptExecutorChange(orderId) {
    const { onModalClose } = this.props;
    await OrdersService.acceptExecutorChange(orderId);
    onModalClose('accept');
  }

  async cancelRequestAccept(orderId) {
    const { onModalClose } = this.props;
    await OrdersService.cancelRequestAccept(orderId);
    onModalClose('accept');
  }

  async cancelRequestCancel(orderId) {
    const { onModalClose } = this.props;
    await OrdersService.cancelRequest(orderId);
    onModalClose('accept');
  }

  // async cancelRequestChangeExecutor(orderId) {
  //   const { onModalClose } = this.props;
  //   await OrdersService.cancelRequestChangeExecutor(orderId);
  //   onModalClose('accept');
  // }

  async declineExecutorChange(orderId) {
    const { onModalClose } = this.props;
    await OrdersService.declineExecutorChange(orderId);
    onModalClose('accept');
  }

  async cancelOrders(id) {
    const { onModalClose, order } = this.props;
    await OrdersService.cancelRequest(id);
    onModalClose('remove', order);
  }

  async cancelRequest(id) {
    const { onModalClose, order } = this.props;
    await OrdersService.cancelRequest(id);
    onModalClose('remove', order);
  }

  render() {
    const { order } = this.props;
    const { start_at_local, requestId, vehicle, driver, points, connectedOrder, id, problems } = order;
    const problem = problems?.find(problem => problem.type === 2 && problem.status === 1) || order.problem;
    const cProblem = connectedOrder ? connectedOrder.problem : null;
    const currentOrderId = problem ? (cProblem ? connectedOrder.id : id) : cProblem ? connectedOrder.id : null;
    const statuses = [];
    const actions = {
      1: [
        {
          title: t.buttons('extend30Minutes'),
          method: () => this.extendByMinutes(currentOrderId),
          icon: 'checkWhite',
        },
        {
          title: t.buttons('cancelOrder'),
          method: () => this.cancelOrders(requestId),
          theme: 'danger',
          icon: 'xWhite',
        },
        {
          title: t.buttons('cancelBothOrders'),
          method: () => this.cancelRequest(requestId),
          theme: 'danger',
          icon: 'xWhite',
        },
      ],
      2: [
        {
          title: t.buttons('Подтвердить замену ТС'),
          method: () => this.acceptExecutorChange(id),
          icon: 'checkWhite',
        },
        {
          title: connectedOrder && connectedOrder.problem ? t.buttons('cancelBothOrders') : t.buttons('cancelOrder'),
          method: () => this.cancelOrders(requestId),
          theme: 'danger',
          icon: 'xWhite',
        },
      ],
      4: [
        {
          title: t.buttons('continueSearchingExecutor'),
          method: () => this.cancelRequestAccept(id),
          icon: 'checkWhite',
        },
        {
          title: t.buttons('cancelOrder'),
          method: () => this.cancelRequestCancel(requestId),
          theme: 'danger',
          icon: 'xWhite',
        },
      ],
      16: [
        {
          title: t.buttons('acceptExecutorChange'),
          method: () => this.cancelRequestChangeExecutor(id),
          icon: 'checkWhite',
        },
      ],
    };

    const firstProblem = problem || connectedOrder?.problem;
    let availableActions = actions[firstProblem?.type] || [];
    let currentActions;
    if (firstProblem) {
      currentActions =
        problem && connectedOrder?.problem
          ? firstProblem.type === 1
            ? availableActions.filter((el, i) => i !== 1)
            : availableActions
          : [];
      statuses.push(
        <StatusNotification
          color={'red'}
          type={'info'}
          actions={currentActions}
          description={t.problems(`client[${firstProblem?.type}]`)?.description}
          data={{}}
          title={
            <p className={'small-title title-bold status-title no-margin'}>
              {t.problems(`client[${firstProblem?.type}]`)?.title}
            </p>
          }
        />,
      );
    }
    const connectedOrderData = {};
    const data = {
      startAt: Utils.formatDate(start_at_local, 'DD MMMM, YYYY HH:mm:ss'),
      address: points['1']?.address || order?.point?.address,
      deliverAddress: points[Object.keys(points).length]?.address,
      vehicleType: order?.vehicle_type?.name,
      plateNumber: vehicle?.plate_number,
      phone: driver ? driver?.phone : vehicle?.driver.phone,
      driverName: order.brigadier
        ? `${order.brigadier.name || ''} ${order.brigadier.surname || ''}`
        : driver
        ? driver?.phone
        : `${vehicle?.driver.name || ''} ${vehicle?.driver.surname || ''}`,
      producer: order.producer?.company_name,
      driverPhone: order?.brigadier ? order?.brigadier?.contact_phone : vehicle?.driver?.applicationPhone || '',
      brigadier: order?.brigadier,
      type: order?.type,
    };
    availableActions = actions[problem?.type] || [];
    currentActions =
      !connectedOrder || (problem && connectedOrder && !connectedOrder.problem)
        ? problem?.type === 1 && !connectedOrder
          ? availableActions.filter((el, i) => i !== 2)
          : availableActions
        : [];
    statuses.push(
      <StatusNotification
        color={problem ? 'red' : 'blue'}
        link={`/orders/${id}/map`}
        type={'order'}
        actions={currentActions}
        data={data}
        title={
          <Link to={`/orders/${id}/map`}>
            <p className={'small-title title-bold status-title no-margin'}>
              Рейс № {id} от &nbsp;{moment(start_at_local).format('ll').toUpperCase()}
            </p>
          </Link>
        }
      />,
    );
    if (connectedOrder) {
      Object.assign(connectedOrderData, {
        startAt: Utils.formatDate(start_at_local, 'DD MMMM, YYYY HH:mm:ss'),
        address: connectedOrder.points['1']?.address || connectedOrder?.point?.address,
        deliverAddress: connectedOrder.points[Object.keys(points).length]?.address,
        vehicleType: connectedOrder?.vehicle_type?.name,
        driverName: connectedOrder.brigadier
          ? `${connectedOrder.brigadier.name || ''} ${connectedOrder.brigadier.surname || ''}`
          : '',
        producer: connectedOrder.producer?.company_name,
        driverPhone: connectedOrder?.brigadier ? connectedOrder?.brigadier?.contact_phone : '',
        brigadier: connectedOrder?.brigadier,
        type: connectedOrder?.type,
      });

      statuses.push(
        <StatusNotification
          color={connectedOrder.problem ? 'red' : 'blue'}
          type={'connectedOrder'}
          actions={!problem && connectedOrder.problem ? actions[connectedOrder.problem?.type] || [] : []}
          link={`/orders/${id}/map`}
          connectedLink={`/orders/${connectedOrder.id}/map`}
          data={connectedOrderData}
          title={
            <Link to={`/orders/${connectedOrder.id}/map`}>
              <p className={'small-title title-bold status-title no-margin'}>
                Рейс № {connectedOrder.id} от &nbsp;{moment(start_at_local).format('ll').toUpperCase()}
              </p>
            </Link>
          }
        />,
      );
    }
    return statuses.map((value, key) => <div key={key}>{value}</div>);
  }
}

StatusesModalContent.propTypes = {
  dictionaries: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  onModalClose: PropTypes.func.isRequired,
};

export default StatusesModalContent;
