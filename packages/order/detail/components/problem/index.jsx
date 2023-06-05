import React, { useContext, useMemo } from "react";
import t from '@vezubr/common/localization';
import {
  StatusNotificationNew,
} from '@vezubr/components';
import OrderViewContext from '../../context';

const getProblemDescription = (problem, order) => {
  let description = '';
  if ((problem?.type === 9 || problem?.type === 25)&& APP !== 'client') {
    description = t.problems(`producer[${9}]`).description;
    description =
      description.replace("<comment>",
        `${problem?.data?.startupMessage ? 'по причине "' + problem?.data?.startupMessage + '"' : ""}`
      )
  }
  else if (APP === 'dispatcher') {
    if (problem.type === 2 && (!order?.delegateManageDriverAndVehicle || !order?.clientDelegateManagement)) {
      description = t.problems(`dispatcher[${problem.type}]`)?.description;
    }
    else {
      description = t.problems(`client[${problem.type}]`)?.description;
    }
  } else {
    description = t.problems(`[${APP}[${problem.type}]`)?.description;
  }
  return description;
}

const getProblemTitle = (problem, order) => {
  let title = '';
  if (APP === 'dispatcher') {
    if (problem?.type === 2 && (!order?.delegateManageDriverAndVehicle || !order?.clientDelegateManagement)) {
      title = t.problems(`dispatcher[${problem?.type}]`)?.title
    } else {
      title = t.problems(`client[${problem?.type}]`)?.title
    }
  } else {
    title = t.problems(`[${APP}][${problem?.type}]`)?.title
  }
  return title;
}

const OrderViewProblem = (props) => {
  const { modal: { setShowModal }, order } = useContext(OrderViewContext);
  const problem = useMemo(() => {
    const problem = order?.problems?.find(problem =>
      (problem.type === 2 || problem.type === 23) && problem.status === 1
    ) || order?.problems?.[0];

    if (!problem) {
      return null;
    }
    if (problem?.type === 22) {
      problem.type = `${problem.type}-${order?.type}`
    }
    problem.description = getProblemDescription(problem, order);
    problem.title = getProblemTitle(problem, order);
    problem.actions = false;
    if (APP !== 'producer') {
      if (
        [1, 4, 23].includes(problem?.type) ||
        (
          problem?.type === 2 &&
          (
            APP === 'client' ||
            order?.delegateManageDriverAndVehicle !== false && order?.clientDelegateManagement !== false
          )
        )
      ) {
        problem.actions = [
          {
            title: t.buttons('setAction'),
            method: () => setShowModal('problem'),
          },
        ]
      }
    }
    return problem
  }, [order])
  return (
    <>
      {problem ? (
        <StatusNotificationNew
          type={'info'}
          actions={problem.actions}
          title={problem?.title}
          color={'red'}
          description={problem?.description}
        />
      ) : null}
    </>
  )
}

export default OrderViewProblem;