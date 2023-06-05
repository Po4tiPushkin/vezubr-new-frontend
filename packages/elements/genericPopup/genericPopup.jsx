import React from 'react';
import IconDeprecated  from '../DEPRECATED/icon/icon';

function GenericPopup({ children, className, ...other }) {
  let classNames = (className || '').split(' ');
  classNames.unshift('generic-popup flexbox column');
  classNames = classNames.join(' ');

  return (
    <div className={classNames}>
      <div className={'generic-popup-header'}>
        <h3>{other.title}</h3>
      </div>
      <div className={'generic-popup-status'}>
        <div className={'circle medium'}>
          <IconDeprecated className={'wide big'} name={other.success ? 'checkBlue' : 'danger'} />
        </div>
      </div>
      <div className="generic-popup-wrapper">{children}</div>
    </div>
  );
}

/*ContentBox.propTypes = {
    children: PropTypes.node,
	theme:PropTypes.string.isRequired,
	isEmpty:PropTypes.bool
};*/

export default GenericPopup;
