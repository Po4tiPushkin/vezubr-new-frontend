import React from 'react';
import PropTypes from 'prop-types';
import ButtonDeprecated from '../DEPRECATED/button/button';

function Carrier({ ...props }) {
  const { data, onSelect, onRemove, assignBrigadier, indx, uiState = {} } = props;
  return (
    <div className={`driver-single padding-5 ${indx > 0 ? 'margin-top-12' : ''}`}>
      <div className={'flexbox'}>
        <div className={'img-wrapper size-0_5 flexbox justify-left'}>
          {data.photoFile ? (
            <img
              style={{ width: '52px', height: '52px' }}
              src={`${window.API_CONFIGS[APP].host}${data.photoFile.downloadUrl.replace('/', '')}`}
            />
          ) : null}
        </div>
        <div className={'size-1 text-left'}>
          <p className={'no-margin'}>
            {data.name} {data.surname}
          </p>
          <p className={'no-margin'}>{data.isAvailable ? 'Доступен' : 'Недоступен'}</p>
        </div>
        <div className={'size-0_5 flexbox justify-right'}>
          {onRemove && (
            <ButtonDeprecated
              icon={data.isBrigadier ? 'favoriteOrangeEnabled' : 'favoriteOrange'}
              className={'square'}
              iconNormal={true}
              onClick={() => (assignBrigadier ? assignBrigadier(data) : null)}
              theme={'danger-secondary'}
              style={{ width: '44px', height: '44px', marginRight: '8px' }}
            />
          )}
          <ButtonDeprecated
            icon={onSelect ? 'chevronRightWhite' : 'xWhite'}
            className={'square'}
            iconNormal={true}
            onClick={() => (onSelect ? onSelect(data) : onRemove ? onRemove(data) : null)}
            theme={onSelect ? 'primary' : 'danger'}
            style={{ width: '44px', height: '44px' }}
          />
        </div>
      </div>
    </div>
  );
}

Carrier.propTypes = {
  data: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
};

export default Carrier;
