import React from 'react';
import { showError, Modal, Loader, Ant, IconDeprecated } from '@vezubr/elements';
const Vehicle = (props) => {
  const { data = {}, onAction, assigned = false } = props;
  const { plateNumber, markAndModel } = data;
  return (
    <div className='flexbox transport-asign-info'>
      <div className={' transport-asign-info__content text-left'}>
        <p className={'no-margin'}>
          <strong>{plateNumber}</strong>
          <br />
          <span className={'text-right'}>{markAndModel}</span>
          <br />
        </p>
      </div>
      <div className={`transport-asign-info__action ${assigned ? 'transport-asign-info__action-assigned' : ''}`}>
        <Ant.Button
          onClick={() => onAction(data)}
          style={{ width: '44px', height: '44px' }}
        >
          {assigned ? <IconDeprecated name={ 'xWhite'} /> : <IconDeprecated name={ 'chevronRightWhite'} />}
        </Ant.Button>
      </div>
    </div>
  )
}

export default Vehicle