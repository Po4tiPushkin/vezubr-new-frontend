import React from 'react';
import PropTypes from 'prop-types';

import tr1 from '@vezubr/common/assets/img/trucks/1.jpg';
import tr2 from '@vezubr/common/assets/img/trucks/2.jpg';
import tr3 from '@vezubr/common/assets/img/trucks/3.jpg';
import tr4 from '@vezubr/common/assets/img/trucks/4.jpg';
import tr5 from '@vezubr/common/assets/img/trucks/5.jpg';
import tr6 from '@vezubr/common/assets/img/trucks/6.jpg';
import tr7 from '@vezubr/common/assets/img/trucks/7.jpg';
import tr8 from '@vezubr/common/assets/img/trucks/8.jpg';
import tr9 from '@vezubr/common/assets/img/trucks/9.jpg';
import tr10 from '@vezubr/common/assets/img/trucks/10.jpg';
import tr11 from '@vezubr/common/assets/img/trucks/11.jpg';
import tr12 from '@vezubr/common/assets/img/trucks/12.jpg';
import tr13 from '@vezubr/common/assets/img/trucks/13.jpg';
import tr14 from '@vezubr/common/assets/img/trucks/14.jpg';
/*TODO id на проде отличаются от дева, как фикс показываем по ключу*/
const truckTypeImages = {
  1: tr1,
  2: tr2,
  3: tr3,
  4: tr4,
  5: tr5,
  6: tr6,
  7: tr7,
  8: tr8,
  9: tr9,
  10: tr10,
  11: tr11,
  12: tr12,
  13: tr13,
  14: tr14,
};

function TruckTypeImage(props) {
  const { vehicleTypeId, ...otherProps } = props;

  if (!truckTypeImages[vehicleTypeId]) {
    return null;
  }

  return <img {...otherProps} src={truckTypeImages[vehicleTypeId]} />;
}
TruckTypeImage.hasImage = function (vehicleTypeId) {
  return !!truckTypeImages[vehicleTypeId];
};

TruckTypeImage.propTypes = {
  vehicleTypeId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default TruckTypeImage;
