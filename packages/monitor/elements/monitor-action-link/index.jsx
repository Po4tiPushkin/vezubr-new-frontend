import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function MonitorActionLink(props) {
  const { className: classNameInput, onAction, title, children, item, ...otherProps } = props;

  const onClick = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onAction) {
        onAction(item);
      }
    },
    [onAction, item],
  );

  const className = cn('monitor-action-link', classNameInput);

  return (
    <a onClick={onAction ? onClick : undefined} className={className} title={title} {...otherProps}>
      {children}
    </a>
  );
}

MonitorActionLink.propTypes = {
  className: PropTypes.string,
  item: PropTypes.any,
  onAction: PropTypes.func,
  children: PropTypes.node,
  title: PropTypes.string,
};

export default MonitorActionLink;
