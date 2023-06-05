import React from 'react';
import { showError, Modal, Loader, Ant, IconDeprecated } from '@vezubr/elements';
const Driver = (props) => {
  const { data = {}, onAction, assigned = false, uiStates = [], disabled = false } = props;
  const { photoFile, name, surname, uiState } = data;
  return (
    <div className='flexbox driver-asign-info'>
      <div className={'img-wrapper size-0_5 flexbox justify-left'}>
        {photoFile ? (
          <img
            style={{ width: '52px', height: '52px' }}
            src={`${window.API_CONFIGS[APP].host}${photoFile.downloadUrl.replace('/', '')}`}
          />
        ) : null}
      </div>
      <div className={'driver-asign-info__content size-1 text-left'}>
        <p className={'no-margin'}>
          <span>{`${name} ${surname}`}</span>
          <br />
          <span className={'text-right'}>{uiStates.find(item => item.id == uiState)?.title}</span>
          <br />
        </p>
      </div>
      <div className={`flexbox size-0_5 justify-right driver-asign-info__action ${assigned ? 'driver-asign-info__action-assigned' : ''}`}>
        <Ant.Button
          onClick={() => onAction(data)}
          style={{ width: '44px', height: '44px' }}
          disabled={disabled}
        >
          {assigned ? <IconDeprecated name={'xWhite'} /> : <IconDeprecated name={'chevronRightWhite'} />}
        </Ant.Button>
      </div>
    </div>
  )
}

export default Driver;