import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button';

function CustomBox({ children, className, style, ...others }) {
  let classNames = (className || '').split(' ');
  classNames.push('alert-box');
  classNames = classNames.join(' ');
  others.buttons = others.buttons || [];
  const buttons = others.buttons.map((button, key) => {
    return (
      <Button
        key={key}
        loading={button.loading}
        theme={button.theme}
        className={`mid ${key > 0 ? 'margin-left-12' : ''}`}
        onClick={(e) => button.event(e)}
      >
        {button.text}
      </Button>
    );
  });

  return (
    <div className={classNames} style={style}>
      <div className="alert-box-container custom-box">
        {others.content}
        {buttons.length ? <div className={'flexbox buttons-wrapper align-right justify-right'}>{buttons}</div> : null}
      </div>
    </div>
  );
}

CustomBox.propTypes = {
  buttons: PropTypes.array,
  content: PropTypes.node.isRequired,
};

export default CustomBox;
