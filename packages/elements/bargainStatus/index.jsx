import React from 'react';
import './styles.scss';

const BargainStatus = (props) => {
  const { text, bargainStatus, bargainStatuses, classNames = '', br = false } = props;

  return (
    <>
      { bargainStatus && bargainStatuses && (
      <span className={classNames}>{text}
        {br && <br/>}
        <span className={`bargain-status-${bargainStatus}`}>
          { bargainStatuses.find(el => el.id === bargainStatus)?.title }
        </span>
      </span>
      )}
    </>
  )
}


export default BargainStatus;