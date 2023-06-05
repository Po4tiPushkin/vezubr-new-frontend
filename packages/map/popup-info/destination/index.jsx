import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

function DestinationPopUpInfo(props) {
  const { state, enteredAtLocal, pointNumber } = props;
  const status = state === 100 ? 'Прибытие' : 'Получение документов';

  return (
    <div className="destination-info-popup">
      Пункт, {pointNumber}. {moment(enteredAtLocal).format('DD/MM/YYYY')}
      <br />
      {status} в {moment(enteredAtLocal).format('HH:mm')}
    </div>
  );
}

DestinationPopUpInfo.propTypes = {
  state: PropTypes.number.isRequired,
  pointNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  enteredAtLocal: PropTypes.string.isRequired,
};

export default DestinationPopUpInfo;
