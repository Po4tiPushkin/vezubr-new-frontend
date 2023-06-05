import React from 'react';
import * as Bargain from '@vezubr/bargain';
import * as Monitor from '../../../..';
import useGetStatus from '../../../../hooks/useGetStatus';
import { Ant } from '@vezubr/elements';
import { useObserver } from 'mobx-react';
import ActionBargainRenderProps from '../../action/action-bargain-render-props';
import { history } from '@vezubr/controls/infrastructure';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import PopupVehicleContent from '../vehicle-popup-content';
const {
  useOrderLoadersInfo,
  useVehicleInfo,
  useOrderStartAddressDateTimeInfo,
  useDriverNamePhoneInfo,
  useClientNameInfo,
  useProducerNameInfo,
  useStatusInfo,
  useOrderLastUpdatedInfo,
  useOrderRequirements,
} = Monitor.AlteringData;

function Footer(props) {
  const { item: order } = props;

  const { bargain_status } = useObserver(() => {
    const { bargain_status } = order.data;
    return { bargain_status };
  });

  const status = useGetStatus(order);

  const isActiveBargain = Bargain.BARGAIN_ACTIVE_STATUSES.includes(bargain_status);

  const bargainAction = isActiveBargain
    ? {
      ['popup-info-bargain']: {
        items: {
          [`popup-info-bargain__action`]: {
            value: (
              <ActionBargainRenderProps order={order}>
                {({ openModal }) => (
                  <Ant.Button onClick={openModal} className={'popup-info-bargain__button'} type={'primary'}>
                    Посмотреть торги
                  </Ant.Button>
                )}
              </ActionBargainRenderProps>
            ),
          },
        },
      },
    }
    : {};

  const footerList = {
    ...bargainAction,
    ...useStatusInfo(status),
    ...useOrderLastUpdatedInfo(order),
  };

  return <Monitor.Layout.AlteringList alteringData={footerList} />;
}

function MapPopupContent(props) {
  const { viewAction, item: order } = props;
  const dictionaries = useSelector(state => state.dictionaries);
  const { paramOptions = 'selection' } = useParams();

  const { type, orderNr, uiState, requestNr } = useObserver(() => {
    const { type } = order;
    const { orderNr, uiState, requestNr } = order.data;
    return { type, orderNr, uiState, requestNr };
  });

  const vehicleInfo = useVehicleInfo(order?.data?.vehicle, order?.data?.requiredVehicleType, order?.data?.requiredBodyTypes);
  const clientInfo = useClientNameInfo(order?.data.client, history, (paramOptions === 'selection' || paramOptions === 'auctions'));
  const producerInfo = useProducerNameInfo(order?.data?.producer, history, (paramOptions === 'execution' || paramOptions === 'paper-check'));
  const driverInfo = useDriverNamePhoneInfo(order?.data?.vehicle?.driver, history, (paramOptions === 'execution' || paramOptions === 'paper-check'));
  const addressInfo = useOrderStartAddressDateTimeInfo(order);
  const loadersInfo = useOrderLoadersInfo(order, dictionaries);
  const requirementsInfo = useOrderRequirements(order);
  const bodyList = {
    ...vehicleInfo,
    ...loadersInfo,
    ...requirementsInfo,
    ...addressInfo,
    ...clientInfo,
    ...producerInfo,
    ...driverInfo,
  };

  if (type === 'vehicle') {
    return <PopupVehicleContent {...props} />;
  }

  return (
    <Monitor.Layout.PopupInfo
      header={
        <Monitor.Element.Link item={order} onAction={viewAction} suffix={<Ant.Icon type={'right'} />}>
          {`Рейс № ${uiState?.state === 102 ? requestNr : orderNr}`}
        </Monitor.Element.Link>
      }
      body={<Monitor.Layout.AlteringList alteringData={bodyList} />}
      footer={<Footer {...props} />}
    />
  );
}

export default MapPopupContent;
