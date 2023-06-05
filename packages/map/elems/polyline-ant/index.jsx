import React from 'react';
import PropTypes from 'prop-types';
import { Path, Popup, withLeaflet } from 'react-leaflet';
import pick from 'react-leaflet/lib/utils/pick';
import { PolylineAnt as PolylineAntNative } from './native';
import { decodePolyline } from '../../utils';

const OPTIONS = [
  'stroke',
  'color',
  'weight',
  'opacity',
  'lineCap',
  'lineJoin',
  'dashArray',
  'dashOffset',
  'fill',
  'fillColor',
  'fillOpacity',
  'fillRule',
  'bubblingMouseEvents',
  'renderer',
  'className',
  // Interactive Layer
  'interactive',
  // Layer
  'pane',
  'attribution',

  //antPath
  'reverse',
  'paused',
  'hardwareAcceleration',
  'duration',
];

class PolylineAnimate extends Path {
  createLeafletElement(props) {
    return new PolylineAntNative(props.positions, this.getOptions(props));
  }

  getPathOptions(props) {
    return pick(props, OPTIONS);
  }
  updateLeafletElement(fromProps, toProps) {
    if (toProps.positions !== fromProps.positions) {
      this.leafletElement.setLatLngs(toProps.positions);
    }
    this.setStyleIfChanged(fromProps, toProps);
  }
}

const PolylineAnimateConnected = withLeaflet(PolylineAnimate);

function PolylineAnt(props) {
  const { children, encode, value, popupText, ...otherProps } = props;

  const positions = React.useMemo(() => {
    if (typeof value === 'string') {
      return decodePolyline(value, encode);
    }
    return value;
  }, [encode, value]);

  return (
    <PolylineAnimateConnected {...otherProps} positions={positions}>
      {popupText && <Popup minWidth={90}>{popupText}</Popup>}

      {children}
    </PolylineAnimateConnected>
  );
}

PolylineAnt.propTypes = {
  value: PropTypes.any,
  encode: PropTypes.string,
  duration: PropTypes.number,
  color: PropTypes.string,
};

export default PolylineAnt;
