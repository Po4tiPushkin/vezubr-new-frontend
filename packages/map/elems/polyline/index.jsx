import React from 'react';
import { Polyline as PolylineLeaflet, Popup } from 'react-leaflet';
import { decodePolyline } from '../../utils';
import PropTypes from 'prop-types';

function Polyline(props) {
  const { encode, children, value, popupText, ...otherProps } = props;

  const positions = React.useMemo(() => {
    if (typeof value === 'string') {
      return decodePolyline(value, encode);
    }
    return value;
  }, [encode, value]);

  return (
    <PolylineLeaflet positions={positions} {...otherProps}>
      {popupText && <Popup minWidth={90}>{popupText}</Popup>}
      {children}
    </PolylineLeaflet>
  );
}

Polyline.propTypes = {
  value: PropTypes.any,
  encode: PropTypes.string,
  color: PropTypes.string,
};

Polyline.defaultProps = {
  color: 'gray',
};

export default Polyline;
