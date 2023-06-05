import React from 'react';
import PropTypes from 'prop-types';
import * as Order from '@vezubr/order/form';
import { useObserver } from 'mobx-react';
import MonitorBadge from '../../elements/monitor-badge';
import { MonitorItemOrder } from '../../store/items';
import { useSelector } from 'react-redux'
import { ReactComponent as InsurerIcon } from '@vezubr/common/assets/img/icons/insurer.svg';
import { ReactComponent as PlusIcon } from '@vezubr/common/assets/img/icons/plus-icon.svg';
import t from '@vezubr/common/localization';

export const pointAddressProps = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  addressString: PropTypes.string.isRequired,
};

function MonitorTruckIcon(props) {
  const { IconComponent, order, hideBadge, hasActualProblem = false } = props;

  const { vehicleTypes } = useSelector((state) => state.dictionaries)

  let { icon, requirements } = useObserver(() => {
    const { orderType, user_notification, data: { requiredVehicleType }, requirements } = order;
    const { category } = vehicleTypes?.find(item => item.id == requiredVehicleType) || {}
    const icon = Order.Icons.renderBitmapIconTruck(orderType, category, hasActualProblem, user_notification);
    return {
      icon,
      requirements,
    };
  });

  if (IconComponent) {
    icon = <IconComponent order={order} icon={icon} />;
  }
  const renderIcon = () => (
    <div className={'monitor-truck-icon'}>
      <div className={'monitor-truck-icon__wrap'}>{icon}</div>
      {
        order?.data?.isInsuranceRequired && (
          <div
            title={order?.data?.isInsurerContractSelected ? `Есть договор страхования с ${APP === 'client' ? 'подрядчиком' : 'заказчиком'}`
              :
              `Не выбраны страховая компания и договор страхования с ${APP === 'client' ? 'подрядчиком' : 'заказчиком'}`
            }
            className={
              `monitor-truck-icon-insurer ${order?.data?.isInsurerContractSelected ? 'monitor-truck-icon-insurer-selected' : ''}`
            }>
            <InsurerIcon />
          </div>
        )
      }
      {
        APP !== 'client' && [102, 201].includes(order?.data?.uiState?.state) && Array.isArray(requirements) && !!requirements.length && (
          <div
            title={`Дополнительные требования: ${requirements.map(el => t.order(`requirements.${el}`)).join(', ')}`}
            className={
              `monitor-truck-icon-requirements`
            }>
            <PlusIcon />
          </div>
        )
      }

    </div>
  );

  return hasActualProblem && !hideBadge ? (
    <MonitorBadge count={'!'} title={'Есть проблемы!'}>
      {renderIcon()}
    </MonitorBadge>
  ) : (
    renderIcon()
  );
}

export default MonitorTruckIcon;
