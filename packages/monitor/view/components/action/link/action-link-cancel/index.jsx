import React, { useCallback } from 'react';
import * as Monitor from '../../../../..';
import { Ant, showError } from '@vezubr/elements';
import { Orders as OrdersService } from '@vezubr/services';
import { useObserver } from 'mobx-react';

export default function ActionLinkCancel(props) {
  const { item } = props;
  const { replaceData } = React.useContext(Monitor.Context);

  const onAction = useCallback(
    (order) => {
      Ant.Modal.confirm({
        title: `Отменить машину на рейсе № ${order.id}?`,
        onOk: async () => {
          try {
            await OrdersService.refuseWaiting({ orderId: order.id });
            Ant.message.success('Рейс аннулирован');
          } catch (e) {
            console.error(e);
            showError(e);
          }
        },
      });
    },
    [replaceData],
  );

  return useObserver(() => {
    if (!Monitor.MONITOR_ORDER_STATES_SELECTION.includes(item.uiState?.state) || !item.data?.vehicle) {
      return null;
    }

    return (
      <Monitor.Element.ActionLink item={item} onAction={onAction} title={'Отменить машину'}>
        <Ant.Icon type={'stop'} />
      </Monitor.Element.ActionLink>
    );
  });
}
