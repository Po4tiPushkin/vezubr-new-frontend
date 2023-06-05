import React from 'react';
import { useObserver } from 'mobx-react';
import * as Monitor from '../../../../..';
import { Ant, IconDeprecated } from '@vezubr/elements';
import { ReactComponent as Assign_IconComponent } from '@vezubr/common/assets/img/trucks/body-type-3.svg';
import useAssignAction from '../../../../hooks/actions/useAssignAction';

export default function ActionLinkAssign(props) {
  const { item } = props;

  return useObserver(() => {
    const { type } = item;
    const { vehicle, strategyType, isTaken, type: orderType, uiState } = item.data;
    const onAction = useAssignAction(orderType);

    if ((type !== 'order') || (strategyType == 'bargain' && !isTaken)) {
      return null;
    }
    if (orderType !== 2) {
      const title = 'Назначить ТС';
      if (!vehicle) {
        return (
          <Monitor.Element.ActionLink item={item} onAction={onAction} title={title}>
            <Ant.Icon component={Assign_IconComponent} />
          </Monitor.Element.ActionLink>
        );
      }
    } else {
      const title = 'Назначить специалистов'
      if (uiState.state < 200) {
        return (
          <Monitor.Element.ActionLink item={item} onAction={onAction} title={title}>
            <IconDeprecated name={'truckLoaderBlack2'} />
          </Monitor.Element.ActionLink>
        );
      }
    }
    return null;
  });
}
