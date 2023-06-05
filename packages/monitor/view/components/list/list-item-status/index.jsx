import React from 'react';
import useGetStatus from '../../../../hooks/useGetStatus';
import t from '@vezubr/common/localization';

function ListItemStatus(props) {
  const { order } = props;
  const status = useGetStatus(order);
  return (
    <span>
      {status.name}
      {getStatusPosition(status)}
      {status.ago && `, ${status.ago}`}
    </span>
  );
}

function getStatusPosition(status) {
  let result = ''
  if (status.position) {
    if (status.uiState === 304) {
      result = t.order('monitorUITempAddresses.toLocation');
    } else {
      result = t.order('monitorUITempAddresses.inLocation');
    }
    return result.replace('[position]', status.position);
  }
  return null;
}

export default ListItemStatus;
