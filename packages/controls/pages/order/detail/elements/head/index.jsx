import React, { useMemo, useState } from "react";
import Utils from '@vezubr/common/common/utils';
import {
  FilterButton,
} from '@vezubr/elements';
import t from '@vezubr/common/localization';
import {
  StatusNotificationNew,
} from '@vezubr/components';
import moment from 'moment';
const OrderViewHead = (props) => {

  const { menuOptions, data = {}, loading, setShowMenuOptions, actions, goBackRender, setProblemModal, history } = props;
  const { history: orderHistory } = data;
  const goBack = () => {
    history.goBack();
  }

  const problem = useMemo(() => {
    const problem = data?.problems?.find(problem => (problem.type === 2 || problem.type === 23) && problem.status === 1) || data?.problems?.[0];
    if (!problem) {
      return null;
    }
    if (problem?.type === 22) {
      problem.type = `${problem.type}-${data?.type}`
    }
    if (problem?.type === 9 && APP !== 'client') {
      problem.description = t.problems(`producer[${9}]`).description;
      problem.description =
        problem?.description?.replace("<comment>", `${problem?.data?.startupMessage ? 'по причине "' + problem?.data?.startupMessage + '"' : ""}`)
    }
    else if (APP === 'dispatcher') {
      if (problem.type === 2 && (!data?.delegateManageDriverAndVehicle || !data?.clientDelegateManagement)) {
        problem.description = t.problems(`dispatcher[${problem.type}]`)?.description;
      }
      else {
        problem.description = t.problems(`client[${problem.type}]`)?.description;
      }
    } else {
      problem.description = t.problems(`[${APP}[${problem.type}]`)?.description;
    }

    return problem
  }, [data])

  return (
    <>
      <div className="order-view-head">
        <div className="order-view-head-top">
          {goBackRender}
          <div className="order-view-title margin-left-12">
            <span className={'view-id'}>
              {'Рейс № ' + `${data?.orderNr ? `${data?.orderNr} (${data?.requestNr})` : data?.requestNr}  `}
            </span>
            <span>
              {'от ' + (data?.createdAt ?
                moment.unix(data.createdAt).format('DD MMMM, YYYY') :
                Utils.formatDate(data?.startAtLocal))}
            </span>
          </div>
          <div className="order-view-head-actions">
            {actions && (
              <div className="flexbox">
                {actions}
              </div>
            )}
            <FilterButton
              icon={'dotsBlue'}
              onClick={() => setShowMenuOptions(prev => !prev)}
              onClose={() => setShowMenuOptions(false)}
              className={'circle box-shadow margin-left-12'}
              withMenu={true}
              id={'order-menu'}
              menuOptions={menuOptions}
            />
          </div>
        </div>
        <div className="order-view-head-problem">
          {problem ? (
            <StatusNotificationNew
              type={'info'}
              actions={
                APP !== 'producer'
                  ?
                  problem?.type === 1 ||
                    (
                      problem?.type === 2 &&
                      (
                        APP === 'client' ||
                        data?.delegateManageDriverAndVehicle !== false && data?.clientDelegateManagement !== false
                      )
                    ) ||
                    problem?.type === 4 ||
                    problem?.type === 23
                    ? [
                      {
                        title: t.buttons('setAction'),
                        method: () => setProblemModal(true),
                      },
                    ]
                    : false
                  :
                  false
              }
              title={
                APP === 'dispatcher'
                  ?
                  problem?.type === 2 && (!data?.delegateManageDriverAndVehicle || !data?.clientDelegateManagement) ?
                    t.problems(`dispatcher[${problem?.type}]`)?.title
                    :
                    t.problems(`client[${problem?.type}]`)?.title
                  :
                  t.problems(`[${APP}][${problem?.type}]`)?.title
              }
              color={'red'}
              description={problem?.description}
            />
          ) : null}
        </div>

      </div>
    </>
  )
}

export default OrderViewHead;