import moment from 'moment';
import React from 'react';
import { useObserver } from 'mobx-react';
import useUpdateByTimer from '@vezubr/common/hooks/useUpdateByTimer';
import { MonitorContext } from '../context'
import * as Utils from '../utils'

export default function useGetStatus(order) {
  const { dictionaries } = React.useContext(MonitorContext);

  useUpdateByTimer(60000);

  return useObserver(() => {
    const { orderUiState } = dictionaries;

    const {
      uiState: { state, enteredAt } = {},
      isTaken,
      vehicle,
      activeOrderPoint,
      type
    } = order.data;
    const ago = enteredAt && Utils.formatDuration(moment(enteredAt).fromNow());

    return {
      name: orderUiState.find(el => el.id === (state))?.title + ((isTaken && !vehicle && state < 200) ? ` (ожидание назначения ${type !== 2 ? 'ТС' : 'специалистов'})` : ''),
      ago,
      position: activeOrderPoint && activeOrderPoint?.position,
      uiState: state,
    };
  });
}
