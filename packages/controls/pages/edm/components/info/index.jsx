import React, { useState, useMemo, useEffect, useCallback } from 'react';
import useInfo from '../../hooks/useInfo';

const EdmInfo = (props) => {
  const { order } = props;
  const info = useInfo({ order });

  const renderInfo = useMemo(() => {
    return info.map((el, index) => {
      return (
        <div key={index} className='edm__info-item'>
          <div className='edm__info-title'>
            {el.title}
          </div>
          <div className='edm__info-content'>
            {el.subTitle && <div className='edm__info-subtitle'>{el.subTitle}</div>}
            {el.data.info.map(item =>
              <div className='edm__info-element'>
                <span className='edm__info-name'>{item.title}:</span>
                <span className='edm__info-value'> {item.value}</span>
              </div>
            )}
          </div>
        </div>
      )
    })
  }, [info])
  return (
    <div className='edm__info'>
      {renderInfo}
    </div>
  )
}

export default EdmInfo;