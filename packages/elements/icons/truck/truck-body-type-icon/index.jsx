import React from 'react';
import PropTypes from 'prop-types';
import { Ant } from '../../../index';

import { ReactComponent as BodyType1_IconComponent } from '@vezubr/common/assets/img/trucks/body-type-1.svg';
import { ReactComponent as BodyType3_IconComponent } from '@vezubr/common/assets/img/trucks/body-type-3.svg';
import { ReactComponent as BodyType4_IconComponent } from '@vezubr/common/assets/img/trucks/body-type-4.svg';
import { ReactComponent as BodyType7_IconComponent } from '@vezubr/common/assets/img/trucks/body-type-7.svg';
import { ReactComponent as BodyType8_IconComponent } from '@vezubr/common/assets/img/trucks/body-type-8.svg';

const truckBodyTypeIcons = {
  1: BodyType1_IconComponent,
  3: BodyType3_IconComponent,
  4: BodyType4_IconComponent,
  7: BodyType7_IconComponent,
  8: BodyType8_IconComponent,
};

function TruckBodyTypeIcon(props) {
  const { bodyTypeId, ...otherProps } = props;

  if (!truckBodyTypeIcons[bodyTypeId]) {
    return null;
  }

  return <Ant.Icon component={truckBodyTypeIcons[bodyTypeId]} {...otherProps} />;
}

TruckBodyTypeIcon.propTypes = {
  bodyTypeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default TruckBodyTypeIcon;
