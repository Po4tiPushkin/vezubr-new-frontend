import React from 'react';
import PropTypes from 'prop-types';
import { useObserver } from 'mobx-react';
import cn from 'classnames';
import * as Monitor from '../../../..';
import PublishContourInfo from '@vezubr/components/contour/publishContourInfo';
import { BargainStatus } from '@vezubr/elements/';
import { useSelector } from 'react-redux';
function ListItem(props) {
  const { dictionaries } = React.useContext(Monitor.Context);

  const { id: userId } = useSelector((state) => state.user)
  const { vehicleTypes } = dictionaries;

  const { item: order, viewAction, actions, IconComponent, StatusComponent, CostComponent, TimeAtArrivalComponent } = props;

  const status = StatusComponent && <StatusComponent order={order} />;
  const cost = CostComponent && <CostComponent order={order} />;
  const timeAtArrival = TimeAtArrivalComponent && <TimeAtArrivalComponent order={order} />;

  return useObserver(() => {
    const {
      id,
      firstPoint,
      lastPoint,
      hasProblem,
      vehicleTypeId,
      requiredContourIds,
      loadersCount,
      startAtLocal,
      orderType,
      problems,
      strategyType,
      republishStrategyType,
      executorAppointRequired,
      bargainStatus,
      performers,
      clientOrderNr,
      orderNr,
      requestNr
    } = order.data;

    const { problemTypes } = dictionaries

    const actualProblems = problems?.filter(item => item.status === 1)

    const problemMessage = actualProblems?.find(item => item?.data?.startupMessage)?.data?.startupMessage
    const activeProblem = actualProblems ? actualProblems[0] : null
    const clientTitle = performers?.find(({ producerId }) => producerId === userId)?.clientTitle || '';

    const alteringData = {
      'subject-info': {
        rowClassName: 'free',
        items: {
          'subject-info__contour': {
            value: <PublishContourInfo contourIds={requiredContourIds} strategyType={strategyType} />,
          },
          'subject-info__notify-badge': {
            value: actualProblems?.length > 0 && (
              <Monitor.Element.NotifyBadge
                count={actualProblems?.length}
                massage={problemMessage || problemTypes?.find(item => item.id == activeProblem?.type)?.title || 'Есть проблема'}
              />
            ),
          },
        },
      },
    }

    if (APP !== 'client') {
      alteringData['subject-info'].items['subject-info__client'] = {
        value: clientTitle && <span title={clientTitle}>{clientTitle}</span>
      }
    }
    if (APP === 'dispatcher') {
      alteringData['subject-info'].items['subject-info__contour'] = {
        value:
          <PublishContourInfo contourIds={requiredContourIds} strategyType={strategyType} republishStrategyType={republishStrategyType} />,
      }
    }

    const subjectInfo = (
      <Monitor.Layout.AlteringList
        alteringData={alteringData}
      />
    );

    const bargain = <BargainStatus bargainStatus={bargainStatus} bargainStatuses={dictionaries?.bargainStatuses} />;
    return (
      <Monitor.Layout.ListItem
        className={
          cn('order-type',
            {
              'order-type--has-problem':
                !!actualProblems.length || (APP !== 'client' && strategyType === 'bargain' && executorAppointRequired)
            })
        }
        identifier={
          <Monitor.Element.Link onAction={viewAction} item={order}>
            {requestNr}
          </Monitor.Element.Link>
        }
        bargain={strategyType === 'bargain' || republishStrategyType === 'bargain' ? bargain : ''}
        date={<Monitor.Element.DateTime startAtLocal={startAtLocal} />}
        status={status}
        subject={subjectInfo}
        cost={cost}
        timeAtArrival={timeAtArrival}
        icon={<Monitor.TruckIcon order={order} hasActualProblem={!!actualProblems.length} IconComponent={IconComponent} />}
        addresses={<Monitor.Element.Addresses firstPoint={firstPoint} lastPoint={lastPoint} />}
        actions={<Monitor.Element.Actions actions={actions} item={order} />}
      />
    );
  });
}

export default ListItem;
