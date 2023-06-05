import React from 'react';
import { Marker as MarkerLeaflet, Popup } from 'react-leaflet';
import { pinDivIcon } from '../../icons';
import PropTypes from 'prop-types';
import useGetPosition from '../../hooks/useGetPosition';

function Marker(props, ref) {
  const markerRef = React.useRef(null);

  const { value, children, icon: iconInput, pinName = 'pinNoNumberBlue', pinText, popupText, ...otherProps } = props;

  const position = useGetPosition(value);

  const icon = iconInput || pinDivIcon({ pinName, text: pinText });

  React.useImperativeHandle(ref, () => markerRef.current, [markerRef.current]);

  return (
    <MarkerLeaflet position={position} icon={icon} {...otherProps} ref={markerRef}>
      {popupText && <Popup minWidth={90}>{popupText}</Popup>}
      {children}
    </MarkerLeaflet>
  );
}


export default React.forwardRef(Marker);
