import React, { useCallback } from 'react';
import * as Monitor from '../../../../..';
import { Ant } from '@vezubr/elements';
import { useObserver } from 'mobx-react';

export default function ActionLinkRemove(props) {
  const { item } = props;
  const { deleteOrder } = React.useContext(Monitor.Context);

  const onAction = useCallback(
    (order) => {
      Ant.Modal.confirm({
        title: `Вы точно хотите удалить рейс № ${order.id}?`,
        content: 'Так же будут удалены связанные рейсы',
        onOk: async () => {
          await deleteOrder(order);
        },
      });
    },
    [deleteOrder],
  );

  return useObserver(() => {
    if (!Monitor.MONITOR_ORDER_STATES_SELECTION.includes(item.uiState?.state)) {
      return null;
    }

    return (
      <Monitor.Element.ActionLink
        item={item}
        onAction={onAction}
        title={'Отмена публикации в контуре'}
      >
        <Ant.Icon type={'close'} />
      </Monitor.Element.ActionLink>
    );
  });
}
