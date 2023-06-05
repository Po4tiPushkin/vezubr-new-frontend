import React from 'react';
import './index.scss';

const LoaderFullScreen = (props) => {
  const { text } = props;

  return (
    <div className={'loadingFullScreen'} id="loader">
      <div className="text">{text || 'Загрузка...'}</div>
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
    </div>
  );
};

export default LoaderFullScreen;
