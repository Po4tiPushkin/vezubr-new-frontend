import React from 'react';
import PropTypes from 'prop-types';
import { formatDateTime } from '../../utils';

function MonitorDateTime(props) {
  const { startAtLocal } = props;

  const date = formatDateTime(startAtLocal);

  return (
    <span className={'monitor-date-time'}>
      {date.date}, {date.time}
    </span>
  );
}

MonitorDateTime.propTypes = {
  startAtLocal: PropTypes.string.isRequired,
};

export default MonitorDateTime;
