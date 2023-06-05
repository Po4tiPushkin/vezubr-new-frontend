import React from 'react';
import { showError, Modal, Ant, IconDeprecated } from '@vezubr/elements';
import { useSelector } from 'react-redux'
const Loader = (props) => {
  const { data = {}, onAction, assigned = false, uiStates = [], isBrigadier = false } = props;
  const { photoFile, name, surname, uiState, producerTitle, specialities = [] } = data;
  
  const {loaderSpecialities} = useSelector((state) => state.dictionaries)
  return (
    <div className='flexbox loader-asign-info'>
      <div className={'loader-asign-info__content size-1 text-left'}>
        <p className={'no-margin'}>
          <span>{`${name} ${surname}`}</span>
          <br />
          <span className='text-small'>
            {specialities.map(el => loaderSpecialities.find(item => item.id == el)?.title).join(', ')}
          </span>
          <br/>
          {APP === 'dispatcher' && (
            <span className='text-small'>{producerTitle}</span>
          )}
          <br/>
          <span className={'text-right'}>{uiStates.find(item => item.id == uiState)?.title}</span>
          <br />
        </p>
      </div>
      <div className={`flexbox size-0_5 justify-right loader-asign-info__action ${assigned ? 'loader-asign-info__action-assigned' : ''}`}>
        <Ant.Button
          onClick={() => onAction(data)}
          style={{ width: '44px', height: '44px' }}
        >
          {assigned ? <IconDeprecated name={'xWhite'} /> : <IconDeprecated name={'chevronRightWhite'} />}
        </Ant.Button>
      </div>
    </div>
  )
}

export default Loader;