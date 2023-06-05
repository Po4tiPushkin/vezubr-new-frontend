import React from 'react';
import { Ant } from '@vezubr/elements';

export default function AddressBadgeLabel(props) {
  const { className: classNameInput,...otherProps } = props;
  const className = `address-badge address-badge--${classNameInput}`;

  return <Ant.Badge {...otherProps} className={className} />;
}
