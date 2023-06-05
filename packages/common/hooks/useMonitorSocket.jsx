import React from 'react';
import * as Monitor from '@vezubr/monitor';
import { monitorEventHandlers } from '../common/utils';
import { reaction } from 'mobx';
import centrifugo from '@vezubr/services/socket/centrifuge';
import { useSelector } from 'react-redux';

export default function useMonitorSocket() {
  const { store, replaceData } = React.useContext(Monitor.Context);

  const loadingData = React.useRef(false);
  const { id: userId } = useSelector((state) => state.user)

  React.useEffect(() => {
    const centrifugeChannel = centrifugo().subscribe(`$contractor-${userId}`, (d) => {
      if (d?.data) {
        const { type, data } = d?.data;
        if (monitorEventHandlers[type]) {
          monitorEventHandlers[type]({data, store, replaceData, loadingData})
        } else {
          console.error(`Handler for event ${type} is not defined`)
        }
      }
    })

    const disposerReaction = reaction(
      () => ({
        orders: store.getItemsFiltered('order', Monitor.Utils.filterOrderEmpty, Monitor.Utils.sortEmpty),
      }),
      ({ orders: ordersInput }) => {
        ordersInput.forEach((order) => {
          centrifugeChannel.subscribe(`$order-${order.id}`, async (d) => {
            if (d?.data) {
              const { type, data } = d?.data;
              if (monitorEventHandlers[type]) {
                monitorEventHandlers[type]({data, store, replaceData, loadingData})
              } else {
                console.error(`Handler for event ${type} is not defined`)
              }
            }
          })
        })
      },
    );

    return () => {
      centrifugeChannel.leave();
      disposerReaction();
    };
  }, [store]);
}
