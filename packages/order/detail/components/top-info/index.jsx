import { useSelector } from "react-redux";
import React, { useMemo, useContext } from 'react';
import t from '@vezubr/common/localization';
import Utils from '@vezubr/common/common/utils';
import _get from 'lodash/get';
import PublishContourInfo from '@vezubr/components/contour/publishContourInfo';
import { ORDER_REQUIREMENTS } from '@vezubr/common/constants/constants';
import { useHistory } from "react-router";
import { OrderSidebarInfos } from '@vezubr/components';
import OrderViewContext from '../../context';
const OrderViewTopInfo = (props) => {
  const { order } = useContext(OrderViewContext);
  const history = useHistory();
  const dictionaries = useSelector(state => state.dictionaries);
  const upperCaseApp = Utils.toFirstLetterUpperCase(APP);
  const topInfo = useMemo(
    () => [
      {
        title: 'Заказчик',
        value: APP !== 'client' && order?.client?.title,
      },
      {
        title: 'Номер рейса заказчика',
        value: APP !== 'client' && order?.clientOrderNr,
      },
      {
        title: 'Тип публикации',
        value: <PublishContourInfo
          republishStrategyType={APP === 'dispatcher' && order?.republishStrategyType}
          strategyType={order?.strategyType}
          contourIds={order?.requiredContourIds}
        />,
      },
      {
        title: 'Статус',
        value: (order?.orderUiState?.state === 400 && APP !== 'dispatcher') ?
          dictionaries?.[`performerUiStateFor${upperCaseApp}`].find(el => el.id === order?.[`uiStateFor${upperCaseApp}`]?.state)?.title
          :
          dictionaries?.orderUiState.find(el => el.id === order?.orderUiState?.state)?.title
      },
      ...[
        order?.orderUiState?.state === 400 && APP === 'dispatcher' &&
        {
          title: 'Статус клиента',
          value: dictionaries?.performerUiStateForClient.find(el => el.id === order?.uiStateForClient?.state)?.title,

        }
      ],
      ...[
        order?.orderUiState?.state === 400 && APP === 'dispatcher' &&
        {
          title: 'Статус подрядчика',
          value: dictionaries?.performerUiStateForProducer.find(el => el.id === order?.uiStateForProducer?.state)?.title,
        }
      ],

      {
        title: t.order('orderAndDeliverDate'),
        value: `${Utils.formatDate(order?.startAtLocal, 'DD MMMM, YYYY HH:mm') || ''} ${order?.toStartAtTime || ''}`,
      },
      {
        title: t.order('deliverAddress'),
        value: order?.points?.[order?.pontis?.length - 1]?.addressString || '',
      },
      {
        title: 'Тип автоперевозки',
        value: order.type === 2
          ? null
          : dictionaries?.vehicleTypeCategories?.find(item => item.id == _get(order, 'category'))?.title
      },
      {
        title: order.type === 2 ? t.order('Кол-во Специалистов') : t.order('vehicleType'),
        value:
          order.type === 2
            ? _get(order, 'loadersCount') || '-'
            : dictionaries?.vehicleTypes?.find(item => item.id == _get(order, 'requiredVehicleTypeId'))?.name || '-',
      },
      ...[
        order?.orderUiState?.state > 102 && 
        {
          title: t.order('vehicleNumbers'),
          value: order?.type !== 2
            ? `${order?.vehicle?.plateNumber || ''}${order?.vehicle?.trailerPlateNumber ? ` / ${order?.vehicle?.trailerPlateNumber}` : ''} `
            : false,
        },
      ],
      ...[
        [102, 201].includes(order?.orderUiState?.state) && ORDER_REQUIREMENTS.some(el => !!order?.[el]) &&
        {
          title: 'Есть доп. требования',
          value: <button className='order-value-button' onClick={() => history.replace({
            pathname: `/orders/${order?.id}/general`,
            search: `?goTo=additional`,
          })}>Перейти в доп. параметры</button>,
        }
      ],

    ], [order]);
  return (
    <OrderSidebarInfos data={topInfo.filter(el => el && el.value)} />
  )
}

export default OrderViewTopInfo;