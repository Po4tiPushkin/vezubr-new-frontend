import React from 'react';
import * as Monitor from '../../../../..';
import { Ant } from '@vezubr/elements';
import { ReactComponent as Handshake_IconComponent } from '@vezubr/common/assets/img/icons/handshake.svg';
import { useObserver } from 'mobx-react';
import ActionBargainRenderProps from '../../action-bargain-render-props';

export default function ActionLinkBargain(props) {
  const { item } = props;

  return useObserver(() => {
    const { bargain_status } = item.data;

    if (item.type !== 'order' || !bargain_status) {
      return null;
    }

    return (
      <ActionBargainRenderProps order={item}>
        {({ openModal }) => (
          <Monitor.Element.ActionLink
            item={item}
            onAction={openModal}
            title={'Посмотреть торги'}
          >
            <Ant.Icon component={Handshake_IconComponent} />
          </Monitor.Element.ActionLink>
        )}
      </ActionBargainRenderProps>
    );
  });
}
