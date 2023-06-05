import React from 'react';


const Vehicle = (props) => {

  const { drivers, isAvailableForTrailer, data } = props;

  const { plateNumber, markAndModel, photoFile } = data;

  return (
    <div className={`flexbox transport-content ${(drivers && isAvailableForTrailer) ? 'vertical-line' : ''}`}>
      <div className={`img-wrapper margin-right-12 flexbox justify-left`}>
        {data?.vehicleData?.photoFile ? (
          <img
            style={{ width: '52px' }}
            src={`${window.API_CONFIGS[APP].host}${data?.vehicleData?.photoFile?.downloadUrl?.replace('/', '')}`}
          />
        ) : null}
      </div>
      <div className={'size-1 flexbox transport-info column justify-center text-left'}>
        <p className={'no-margin'}>
          <strong>{plateNumber}</strong>
          <br />
          <span className={'text-right'}>{markAndModel}</span>
        </p>
      </div>
    </div>
  )
}

export default Vehicle