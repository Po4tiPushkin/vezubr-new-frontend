import React from 'react';
import PropTypes from 'prop-types';
import ButtonDeprecated from '../DEPRECATED/button/button';

function Alert({ children, className, style, ...others }) {
  let classNames = (className || '').split(' ');
  classNames.push('alert-box');
  classNames = classNames.join(' ');
  return (
    <div className={classNames} style={style}>
      <div className="alert-box-container">
        {others.title ? <h4>{others.title}</h4> : null}

        {others.html ? (
          <p
            style={{ textAlign: typeof others.html === 'string' ? others.html : 'left' }}
            dangerouslySetInnerHTML={{ __html: others.content }}
          />
        ) : (
          <p>{others.content}</p>
        )}

        {others.button ? (
          <ButtonDeprecated
            className={'margin-top-32'}
            theme={'primary'}
            onClick={(e) => others.button.event(e)}
            wide={true}
          >
            {others.button.text}
          </ButtonDeprecated>
        ) : null}
      </div>
    </div>
  );
}

Alert.propTypes = {
  button: PropTypes.object,
  title: PropTypes.string,
  content: PropTypes.string.isRequired,
};

export default Alert;
