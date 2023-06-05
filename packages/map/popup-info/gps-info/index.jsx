import React from 'react';
import PropTypes from 'prop-types';

function GpsInfoPopUpInfo(props) {
  const { averageSpeed, date, time, title, children } = props;

  return (
    <div className="gps-info-popup">
      <h2>{title}</h2>
      <div className="gps-info-popup__item">
        <h3>Дата:</h3>
        <p>{date}</p>
      </div>
      <div className="gps-info-popup__item">
        <h3>Время:</h3>
        <p>{time}</p>
      </div>
      <div className="gps-info-popup__item">
        <h3>Средняя скорость:</h3>
        <p>{averageSpeed} км/ч</p>
      </div>
      {children && <div className="gps-info-popup__item">{children}</div>}
    </div>
  );
}

GpsInfoPopUpInfo.propTypes = {
  title: PropTypes.string,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  averageSpeed: PropTypes.number.isRequired,
};

GpsInfoPopUpInfo.defaultProps = {
  title: 'Средние показатели на линии',
};

export default GpsInfoPopUpInfo;
