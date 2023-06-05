import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Ant } from '@vezubr/elements';

function MonitorBadge(props) {
  const { className: classNameInput, ...otherProps } = props;

  const className = cn('monitor-badge', classNameInput);

  return <Ant.Badge {...otherProps} className={className} />;
}

MonitorBadge.propTypes = Ant.Badge.propTypes;

export default MonitorBadge;
