import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import MonitorActionLink from '../monitor-action-link';

function MonitorLink(props) {
  const { className: classNameInput, onAction, children, item, title, prefix, suffix, href, target } = props;

  const className = cn('monitor-link', classNameInput);

  return (
    <MonitorActionLink item={item} title={children} className={className} onAction={onAction} target={target} href={href}>
      {prefix && <span className={'monitor-link__prefix'}>{prefix}</span>}
      <span className={'monitor-link__text'}>{children}</span>
      {suffix && <span className={'monitor-link__suffix'}>{suffix}</span>}
    </MonitorActionLink>
  );
}

MonitorLink.propTypes = {
  item: PropTypes.any,
  onAction: PropTypes.func,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  href: PropTypes.string,
  target: PropTypes.string,
};

export default MonitorLink;
