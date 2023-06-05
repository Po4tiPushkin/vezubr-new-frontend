import React, { useState } from 'react';
import * as Monitor from '../../../../..';
import { Ant } from '@vezubr/elements';
import { useObserver } from 'mobx-react';
import { ReactComponent as Sharing_IconComponent } from '@vezubr/common/assets/img/icons/republishArrow.svg';
import useEditSharingAction from '../../../../hooks/actions/useEditSharingAction';

export default function ActionLinkEditSharing(props) {
  const { item } = props;

  const onAction = useEditSharingAction();

  return useObserver(() => {
    if (item?.uiState?.state > 200) {
      return null;
    }

    const title = 'Редактирование Шаринга для Подрядчиков';

    return (
      <Monitor.Element.ActionLink item={item} onAction={onAction} title={title}>
        <Ant.Icon component={Sharing_IconComponent} />
      </Monitor.Element.ActionLink>
    );

  });
}
