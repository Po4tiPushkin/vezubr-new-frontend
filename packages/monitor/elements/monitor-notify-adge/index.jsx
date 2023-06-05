import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { Ant } from '@vezubr/elements';

function MonitorNotifyBadge(props) {
  const { count, massage, getPopupContainer: getPopupContainerInput } = props;

  const lastNumeral = count % 10;

  //TODO use plurals system
  let countMessage = 'сообщений';
  switch (lastNumeral) {
    case 1:
      countMessage = 'сообщение';
      break;
    case 2:
    case 3:
    case 4:
      countMessage = 'сообщения';
      break;
  }

  const getPopupContainer =
    getPopupContainerInput ||
    React.useCallback((parentNode) => parentNode.closest('.monitor-list') || document.body, []);

  const renderElem = () => (
    <span className={'monitor-notify-badge'}>
      <span className={'monitor-notify-badge__text'}>
        {count} {countMessage}
      </span>
    </span>
  );

  const renderPopover = (children) => (
    <Ant.Popover
      overlayClassName="monitor-notify-badge__popover"
      placement="top"
      getPopupContainer={getPopupContainer}
      content={massage}
      trigger="hover"
    >
      {children}
    </Ant.Popover>
  );

  return massage ? renderPopover(renderElem()) : renderElem();
}

MonitorNotifyBadge.propTypes = {
  count: PropTypes.number,
  massage: PropTypes.node,
  getPopupContainer: PropTypes.func,
};

export default MonitorNotifyBadge;
