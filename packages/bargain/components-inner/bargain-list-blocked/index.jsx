import React from 'react';
import { observer } from 'mobx-react';
import { BargainListContext } from '../../context';

function BargainListBlocked(props) {
  const { store } = React.useContext(BargainListContext);
  const { isItemProcessing, isLoading } = store;

  if (!isItemProcessing && !isLoading) {
    return null;
  }

  return <div className={'bargain-list-blocked'} />;
}

export default observer(BargainListBlocked);
