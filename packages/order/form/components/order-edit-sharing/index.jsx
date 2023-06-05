import React from 'react'
import ActionEditSharingRate from './rate'
import ActionEditSharingTariff from './tariff'
import ActionEditSharingBargain from './bargain'
import './styles.scss';
import { useHistory } from 'react-router-dom';
function ActionEditSharing(props) {
  const { order, closeModal, showModal = false } = props;
  const history = useHistory();
  if (!order?.republishStrategyType && order?.id) {
    history.push(`/republish-order/${order?.id}`)
  }

  switch (order?.republishStrategyType) {
    case ('rate'): {
      return <ActionEditSharingRate order={order} history={history} closeModal={closeModal} showModal={showModal} />
    }
    case ('tariff'): {
      return <ActionEditSharingTariff order={order} history={history} closeModal={closeModal} showModal={showModal} />
    }
    case ('bargain'): {
      return <ActionEditSharingBargain order={order} history={history} closeModal={closeModal} showModal={showModal} />
    }
    default: {
      return null
    }
  }

}

export default ActionEditSharing;