import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { Tooltip } from '../../../antd';

function TextOverflow(props) {
  const { children, childrenVisible = true, className, hint: hintInput, placement, ...otherProps } = props;

  const title = hintInput || children;
  const isTitleSimple = typeof title === 'string' || (typeof title === 'number' && !isNaN(title));

  if (!children && childrenVisible) {
    return null;
  }

  const wrapToTooltip = (elems) => (
    <Tooltip placement={placement} title={title}>
      {elems}
    </Tooltip>
  );

  const renderCell = (title) => (
    <div className={cn('cell-text-overflow', className)} {...{ title, ...otherProps }}  >
      <div className="cell-text-overflow-content">{childrenVisible ? children : null}</div>
    </div>
  );

  let cell = renderCell(isTitleSimple ? title : undefined);

  if (!isTitleSimple) {
    cell = wrapToTooltip(cell);
  }

  return cell;
}

TextOverflow.defaultProps = {
  placement: 'top',
};

TextOverflow.propTypes = {
  children: PropTypes.node,
  hint: PropTypes.node,
  placement: PropTypes.oneOf([
    'top',
    'left',
    'right',
    'bottom',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'leftTop',
    'leftBottom',
    'rightTop',
    'rightBottom',
  ]),
  className: PropTypes.string,
};

export default TextOverflow;
