import React from 'react';
import PropTypes from 'prop-types';

export const pointAddressProps = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  addressString: PropTypes.string.isRequired,
};

function MonitorAddresses(props) {
  const { firstPoint, lastPoint } = props;

  const titleArr = [firstPoint.addressString];
  if (lastPoint?.addressString) {
    titleArr.push(lastPoint?.addressString);
  }

  return (
    <div className={'monitor-addresses'} title={titleArr.join('  —  ')}>
      <span className={'monitor-addresses__first-point'}>{firstPoint.addressString}</span>
      {lastPoint && (
        <>
          <span className={'monitor-addresses__divided'}>&mdash;</span>
          <span className={'monitor-addresses__last-point'}>{lastPoint.addressString}</span>
        </>
      )}
    </div>
  );
}

MonitorAddresses.propTypes = {
  firstPoint: PropTypes.shape(pointAddressProps).isRequired,
  lastPoint: PropTypes.shape(pointAddressProps),
};

export default MonitorAddresses;
