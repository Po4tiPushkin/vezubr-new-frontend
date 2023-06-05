import React from 'react';
import { Ant, IconDeprecated } from '@vezubr/elements';
const Tractor = (props) => {
  const { data = {}, onAction } = props;
  const { plateNumber, markAndModel, photo } = data;
  return (
    <div className='flexbox transport-asign-info'>
      <div style={{ width: '52px', height: '52px' }} className={'img-wrapper margin-right-10 flexbox justify-left'}>
        {photo && photo.downloadUrl ? (
          <img
            style={{ width: '52px', height: '52px' }}
            src={`${window.API_CONFIGS[APP].host}${photo.downloadUrl.replace('/', '')}`}
          />
        ) : null}
      </div>
      <div className={'transport-asign-info__content text-left'}>
        <p className={'no-margin'}>
          <strong>{plateNumber}</strong>
          <br />
          <span className={'text-right'}>{markAndModel}</span>
          <br />
        </p>
      </div>
      <div className={`transport-asign-info__action`}>
        <Ant.Button
          onClick={() => onAction(data)}
          style={{ width: '44px', height: '44px' }}
        >
          {<IconDeprecated name={'chevronRightWhite'} />}
        </Ant.Button>
      </div>
    </div>
  )
}

export default Tractor;