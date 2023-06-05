import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import StatusNotification from '../../statusNotificationNew';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Utils } from '@vezubr/common/common';
const useStatuses = ({
  cancelRequest,
  cancelRequestAccept,
  cancelRequestCancel,
  acceptExecutorChange,
  extendByMinutes,
  order = {},
  declineExecutorChange,
}) => {
  const statuses = useMemo(() => {
    const { startAtLocal, requestId, vehicle, driver, points, connectedOrder, id, problems, producer } = order;
    const problem = problems?.find((problem) => (problem.type === 2 || problem.type === 23) && problem.status === 1) || problems?.[0];
    const cProblem = connectedOrder ? connectedOrder.problem : null;
    const currentOrderId = problem ? (cProblem ? connectedOrder.id : id) : cProblem ? connectedOrder.id : null;
    const statuses = [];
    const actions = {
      1: [
        {
          title: t.buttons('extend30Minutes'),
          method: () => extendByMinutes(currentOrderId),
          icon: 'checkWhite',
        },
        {
          title: t.buttons('cancelOrder'),
          method: () => cancelRequest(requestId),
          theme: 'danger',
          icon: 'xWhite',
        },
        {
          title: t.buttons('cancelBothOrders'),
          method: () => cancelRequest(requestId),
          theme: 'danger',
          icon: 'xWhite',
        },
      ],
      2: [
        {
          title: t.buttons('Подтвердить замену ТС'),
          method: () => acceptExecutorChange(id),
          icon: 'checkWhite',
        },
        {
          title: connectedOrder && connectedOrder.problem ? t.buttons('cancelBothOrders') : t.buttons('cancelOrder'),
          method: () => cancelRequest(requestId),
          theme: 'danger',
          icon: 'xWhite',
        },
      ],
      4: [
        {
          title: t.buttons('continueSearchingExecutor'),
          method: () => cancelRequestAccept(id),
          icon: 'checkWhite',
        },
        {
          title: t.buttons('cancelOrder'),
          method: () => cancelRequestCancel(requestId),
          theme: 'danger',
          icon: 'xWhite',
        },
      ],
      16: [
        {
          title: t.buttons('acceptExecutorChange'),
          method: () => cancelRequestChangeExecutor(id),
          icon: 'checkWhite',
        },
      ],
      23: [
        {
          title: t.buttons('Подтвердить замену специалистов'),
          method: () => acceptExecutorChange(id),
          icon: 'checkWhite',
        },
        {
          title: connectedOrder && connectedOrder.problem ? t.buttons('cancelBothOrders') : t.buttons('cancelOrder'),
          method: () => declineExecutorChange(id),
          theme: 'danger',
          icon: 'xWhite',
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
      startAt: Utils.formatDate(startAtLocal, 'DD MMMM, YYYY HH:mm:ss'),
      address: points['0']?.addressString,
      deliverAddress: points[points.length - 1]?.addressString,
      vehicleType: problem?.data?.vehicleTypeTitle,
      plateNumber: problem?.data?.vehiclePlateNumber,
      phone: problem?.data?.contactPhone || '',
      driverName:
        order?.type !== 2
          ? problem?.data?.driverName
            ? `${problem?.data?.driverName || ''} ${problem?.data?.driverSurname || ''}` || ''
            : ''
          : problem?.data?.brigadierName
            ? `${problem?.data?.brigadierName || ''} ${problem?.data?.brigadierSurname || ''}` || ''
            : '',
      producer: producer?.title || producer?.inn,
      driverPhone: problem?.data?.contactPhone || '',
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
              Рейс № {id} от &nbsp;{moment(startAtLocal).format('ll').toUpperCase()}
            </p>
          </Link>
        }
      />,
    );
    if (connectedOrder) {
      Object.assign(connectedOrderData, {
        startAt: Utils.formatDate(startAtLocal, 'DD MMMM, YYYY HH:mm:ss'),
        address: connectedOrder.points['1']?.address || connectedOrder?.point?.address,
        deliverAddress: connectedOrder.points[Object.keys(points).length]?.address,
        vehicleType: connectedOrder?.vehicle_type?.name,
        driverName: connectedOrder.brigadier
          ? `${connectedOrder?.brigadier?.name} ${connectedOrder?.brigadier?.surname}` || ''
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
                Рейс № {connectedOrder.id} от &nbsp;{moment(startAtLocal).format('ll').toUpperCase()}
              </p>
            </Link>
          }
        />,
      );
    }
    return statuses;
  }, [
    cancelRequest,
    cancelRequestAccept,
    cancelRequestCancel,
    acceptExecutorChange,
    extendByMinutes,
    order,
    declineExecutorChange,
  ]);
  return statuses;
};

export default useStatuses;
