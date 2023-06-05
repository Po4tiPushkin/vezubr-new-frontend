import React from 'react';
import cn from 'classnames';
import { Descriptions as AntDescriptions } from '../antd';

const Descriptions = (props) => {
  const { theme, className: classNameInput, ...otherProps } = props;
  const className = cn('vz-descriptions', `vz-descriptions--theme-${theme}`, classNameInput);
  return <AntDescriptions {...otherProps} className={className} />;
};

Descriptions.Item = AntDescriptions.Item;
Descriptions.defaultProps = {
  theme: 'default',
};

export default Descriptions;