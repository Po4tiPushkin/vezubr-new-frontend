import React from 'react';
import PropTypes from 'prop-types';
import { IconDeprecated } from '../index';
import ButtonIcon from '../DEPRECATED/buttonIcon/buttonIcon';
import ReactTooltip from 'react-tooltip';

function GeoZones({ className, ...props }) {
  const { title, detail, onClick, onRemove, onEdit, index, value, error, name, placeholder, readOnly = false } = props;

  let classNames = (className || '').split(' ');
  classNames.push('vz-address margin-top-0');

  if (error) {
    classNames.push('error');
  }

  classNames = classNames.join(' ');
  return (
    <div
      style={readOnly ? { background: '#fff' } : {}}
      value={JSON.stringify(value)}
      className={classNames}
      onClick={(e) => (onClick ? onClick(e) : null)}
    >
      <div className={'icon-wrap'} onClick={(e) => (onEdit ? onEdit(e) : null)}>
        <IconDeprecated name={readOnly ? 'editBlack' : detail ? 'editBlue' : 'plusBlue'} />
      </div>
      <div className={'address-data'}>
        <p className={'vz-address-title'}>{title?.name}</p>
        <p className={`vz-address-details ${!detail ? 'placeholder' : ''}`}>{ detail?.name || placeholder}</p>
      </div>
      {onRemove ? (
        <div className={'bottom-right'}>
          <ButtonIcon default={true} onClick={(e) => (onRemove ? onRemove(e) : null)} svgIcon={'xSmall'} />
        </div>
      ) : null}
      {error ? (
        <div data-tip="React-tooltip" data-for={name || `rt-addr`} className={`bottom-right`}>
          <IconDeprecated name={'danger'} />
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

GeoZones.propTypes = {
  title: PropTypes.string,
  fullAddress: PropTypes.string,
  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default GeoZones;
