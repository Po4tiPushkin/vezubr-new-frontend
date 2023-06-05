import React from 'react';
import { CircleMarker as CircleMarkerLeaflet, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import useGetPosition from '../../hooks/useGetPosition';

function CircleMarker(props) {
  const { value, children, popupText, ...otherProps } = props;
  const center = useGetPosition(value);
  return (
    <CircleMarkerLeaflet {...otherProps} center={center}>
      {popupText && <Popup minWidth={90}>{popupText}</Popup>}
      {children}
    </CircleMarkerLeaflet>
  );
}

CircleMarker.propTypes = {
  value: PropTypes.object.isRequired,
  popupText: PropTypes.any,
};

export default CircleMarker;
