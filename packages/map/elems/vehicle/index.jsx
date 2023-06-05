import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { pinDivBgIcon } from '../../icons';
import PropTypes from 'prop-types';
import useGetPosition from '../../hooks/useGetPosition';

function Vehicle(props) {
  const { value, children, icon: iconInput, iconName, bgName, popupText, ...otherProps } = props;

  const position = useGetPosition(value);

  const icon = iconInput || pinDivBgIcon({ iconName, bgName });

  return (
    <Marker position={position} icon={icon} {...otherProps}>
      {popupText && <Popup minWidth={90}>{popupText}</Popup>}

      {children}
    </Marker>
  );
}

Vehicle.propTypes = {
  value: PropTypes.any.isRequired,
  iconName: PropTypes.string.isRequired,
  bgName: PropTypes.any.isRequired,
};

export default Vehicle;
