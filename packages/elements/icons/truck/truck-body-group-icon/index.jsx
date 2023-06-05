import React from 'react';
import PropTypes from 'prop-types';
import { Ant } from '../../../index';

import { ReactComponent as BodyType1_IconComponent } from '@vezubr/common/assets/img/trucks/body-type-1.svg';
import { ReactComponent as BodyType4_IconComponent } from '@vezubr/common/assets/img/trucks/body-type-4.svg';
import { ReactComponent as BodyType8_IconComponent } from '@vezubr/common/assets/img/trucks/body-type-8.svg';

const truckBodyGroupIcons = {
  1: BodyType8_IconComponent,
  2: BodyType1_IconComponent,
  3: BodyType4_IconComponent,
};

function TruckBodyGroupIcon(props) {
  const { bodyGroupId, ...otherProps } = props;

  if (!truckBodyGroupIcons[bodyGroupId]) {
    return null;
  }

  return <Ant.Icon component={truckBodyGroupIcons[bodyGroupId]} {...otherProps} />;
}

TruckBodyGroupIcon.propTypes = {
  bodyGroupId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default TruckBodyGroupIcon;
