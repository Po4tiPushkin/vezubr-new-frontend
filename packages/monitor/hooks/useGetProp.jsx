import React from 'react';
import { useObserver } from 'mobx-react';
import { MonitorContext } from '../context';

export default function (propName) {
  const { store } = React.useContext(MonitorContext);

  return useObserver(() => {
    return store.getProp(propName);
  });
}
