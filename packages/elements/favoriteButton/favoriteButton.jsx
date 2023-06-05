import React from 'react';
import PropTypes from 'prop-types';
import { IconDeprecated } from '../index';
function FavoriteButton({ children, className, style, ...props }) {
  let classNames = (className || '').split(' ');
  classNames.push('vz-favorite-button');
  classNames = classNames.join(' ');
  const { active, text, onClick } = props;
  return (
    <div className={classNames} style={style} onClick={(e) => onClick(e)}>
      <div className="vz-favorite-button-container flexbox">
        <IconDeprecated name={active ? 'favoriteOrangeEnabled' : 'favoriteOrange'} />
        <span>{text}</span>
      </div>
    </div>
  );
}

FavoriteButton.propTypes = {
  active: PropTypes.bool,
  text: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default FavoriteButton;
