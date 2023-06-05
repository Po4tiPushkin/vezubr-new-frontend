import React from 'react';
import * as Monitor from '../../../../..';
import { Ant } from '@vezubr/elements';
import { useObserver } from 'mobx-react';

import { ReactComponent as Pin_IconComponent } from '@vezubr/common/assets/img/icons/pin.svg';

export default function ActionLinkPin(props) {
  const { item } = props;

  const onAction = React.useCallback((item) => item.openPopup(), []);

  return useObserver(() => {
    if (!item.position) {
      return null;
    }
    return (
      <Monitor.Element.ActionLink item={item} onAction={onAction} title={'Найти на карте'}>
        <Ant.Icon component={Pin_IconComponent} />
      </Monitor.Element.ActionLink>
    );
  });
}
