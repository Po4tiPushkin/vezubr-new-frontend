import { Ant } from "@vezubr/elements";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as Sharing_IconComponent } from '@vezubr/common/assets/img/icons/republishArrow.svg';
import OrderViewContext from '../../context';
import { IconDeprecated } from "@vezubr/elements";
import t from '@vezubr/common/localization';
const OrderActions = (props) => {
  const { order, actions, modal: { setShowModal } } = useContext(OrderViewContext);
  const dictionaries = useSelector(state => state.dictionaries);
  const isBargain = order?.strategyType === 'bargain';
  const isBargainMyAccepted = order?.bargainOfferMy?.offer?.status === 'accepted';

  if (APP === 'client') {
    return <></>
  }
  return (
    <>
      {APP === 'dispatcher' && order?.orderUiState?.state === 102 && (
        <Ant.Button
          onClick={() => setShowModal('republish')}
          type={'secondary'}
          className={'filter-button default rounded box-shadow republish-button'}
          id={'order-republish'}
        >
          <span className="icon-content">
            <Ant.Icon className={'republish-icon'} component={Sharing_IconComponent} />
            <p className="padding-right-12 padding-left-10 no-margin">{t.buttons('republishOrder')}</p>
          </span>
        </Ant.Button>
      )}
      {order?.id &&
        order?.orderUiState?.state === 102 &&
        !order?.isTaken &&
        order?.type !== 2 &&
        (!isBargain || (isBargain && isBargainMyAccepted)) && (
          <Ant.Button
            onClick={() => actions.take()}
            id={'order-take'}
            type={'secondary'}
            className={'take-button'}
          >
            <span className="icon-auction">
              <IconDeprecated name={'auctionBlue'} />
              <p className="padding-right-12 no-margin">Принять Обязательства</p>
            </span>
          </Ant.Button>
        )}
      {order?.orderUiState &&
        dictionaries.orderStageToStateMap[10].indexOf(order?.orderUiState?.state) > -1 &&
        order?.orderUiState?.state !== 201 &&
        (!isBargain || (isBargain && isBargainMyAccepted)) && (
          <Ant.Button
            type={'primary'}
            onClick={() => {
              setShowModal('assign');
            }}
            id={'order-accept'}
            className={'rounded margin-left-12 margin-right-12 semi-wide'}
          >
            {t.buttons('Принять рейс')}
          </Ant.Button>
        )}
    </>
  )
}

export default OrderActions;