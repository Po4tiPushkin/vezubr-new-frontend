import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/icon';
import ButtonIcon from '../buttonIcon/buttonIcon';
import ReactTooltip from 'react-tooltip';

function Address({ className, ...props }) {
  const { title, fullAddress, onClick, onRemove, onEdit, index, value, error, name, placeholder, style = {} } = props;

  let classNames = (className || '').split(' ');
  classNames.push('vz-address');

  if (error) {
    classNames.push('error');
  }

  classNames = classNames.join(' ');
  return (
    <div
      value={JSON.stringify(value)}
      style={style}
      className={classNames}
      onClick={(e) => (onClick ? onClick(e) : null)}
    >
      <div className={'icon-wrap'} onClick={(e) => (onEdit ? onEdit(e) : null)}>
        <Icon name={fullAddress ? 'editBlue' : 'plusBlue'} />
      </div>
      <div className={'address-data'}>
        <p className={'vz-address-title'}>{title}</p>
        <p className={`vz-address-details ${!fullAddress ? 'placeholder' : ''}`}>{fullAddress || placeholder}</p>
      </div>
      {onRemove && index > 0 ? (
        <div className={'bottom-right'}>
          <ButtonIcon default={true} onClick={(e) => (onRemove ? onRemove(e) : null)} svgIcon={'xSmall'} />
        </div>
      ) : null}
      {error ? (
        <div data-tip="React-tooltip" data-for={name || `rt-addr`} className={`bottom-right`}>
          <Icon name={'danger'} />
          <ReactTooltip id={name || `rt-addr`} className={'vz-tooltip'} place="bottom" type="dark" effect="solid">
            <span>{error}</span>
          </ReactTooltip>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

Address.propTypes = {
  title: PropTypes.string,
  fullAddress: PropTypes.string,
  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default Address;
