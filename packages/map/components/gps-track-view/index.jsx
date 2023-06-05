import React from 'react';
import PropTypes from 'prop-types';
import MapPolylineAnt from '../../elems/polyline-ant';
import MapPolyline from '../../elems/polyline';
import { Popup } from 'react-leaflet';
import GpsInfoPopUpInfo from '../../popup-info/gps-info';
import { PATH_ANT_MIDDLE, PATH_ANT_QUICKLY, PATH_ANT_SLOW, PATH_ANT_VERY_SLOW } from '../../constants';
import moment from 'moment';

function GpsTrackView(props) {
  const { polylines } = props;

  if (!polylines || !polylines?.length) {
    return null;
  }

  return polylines.map((polylineInfo, index) => {
    const { id, avgSpeed, distance, encoder, polyline } = polylineInfo;

    const start = moment.unix(polylineInfo.timeStart || polylineInfo.time_start);
    const end = moment.unix(polylineInfo.timeEnd || polylineInfo.time_end);

    let mapPathAntProps = PATH_ANT_QUICKLY;

    if (avgSpeed < 4) {
      mapPathAntProps = PATH_ANT_VERY_SLOW;
    } else if (avgSpeed < 16) {
      mapPathAntProps = PATH_ANT_SLOW;
    } else if (avgSpeed < 46) {
      mapPathAntProps = PATH_ANT_MIDDLE;
    }

    const indexKey = id || index;

    return (
      <React.Fragment key={indexKey}>
        <MapPolyline {...mapPathAntProps.bg} value={polyline} encode={encoder} key={indexKey + '-bg'} />
        <MapPolylineAnt {...mapPathAntProps.ant} value={polyline} encode={encoder} key={indexKey + '-ant'}>
          <Popup minWidth={90} maxWidth={220}>
            <GpsInfoPopUpInfo
              averageSpeed={avgSpeed}
              date={start.format('DD.MM.YYYY')}
              time={`${start.format('HH:mm')} - ${end.format('HH:mm')}`}
            />
          </Popup>
        </MapPolylineAnt>
      </React.Fragment>
    );
  });
}

GpsTrackView.propTypes = {
  polylines: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      avgSpeed: PropTypes.number.isRequired,
      encoder: PropTypes.string.isRequired,
      polyline: PropTypes.string.isRequired,
      time_start: PropTypes.number.isRequired,
      time_end: PropTypes.number.isRequired,
    }),
  ),
};

export default GpsTrackView;
