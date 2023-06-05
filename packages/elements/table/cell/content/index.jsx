import React from 'react';
import cn from 'classnames';

function Content(props) {
  const { children, className } = props;

  return <div className={cn('cell-content', className)}>{children}</div>;
}

export default Content;
