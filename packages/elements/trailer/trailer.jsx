import React from 'react';
import PropTypes from 'prop-types';
import { ButtonDeprecated } from '../index';

function Trailer({ ...props }) {
  const { data, onSelect, onRemove, indx } = props;
  const serial = data?.plateNumber;
  const model = data?.markAndModel;

  return (
    <div
      className={`driver-single padding-5 ${indx > 0 ? 'margin-top-12' : ''}`}
      onClick={() => (onSelect ? onSelect(data) : onRemove ? onRemove(data) : null)}
    >
      <div className={'flexbox'}>
        <div style={{ width: '52px', height: '52px' }} className={'img-wrapper margin-right-10 flexbox justify-left'}>
          {data.photoFile ? (
            <img
              style={{ width: '52px', height: '52px' }}
              src={`${window.API_CONFIGS[APP].host}${data.photoFile.downloadUrl.replace('/', '')}`}
            />
          ) : null}
        </div>
        <div className={'size-1 text-left'}>
        <p className={'no-margin'}>
            <div><strong>{serial}</strong></div>
            <div>{model}</div>
          </p>
        </div>
        <div className={'size-0_5 flexbox justify-right'}>
          <ButtonDeprecated
            icon={onSelect ? 'chevronRightWhite' : 'xWhite'}
            className={'square'}
            iconNormal={true}
            theme={onSelect ? 'primary' : 'danger'}
            style={{ width: '44px', height: '44px' }}
          />
        </div>
      </div>
    </div>
  );
}

Trailer.propTypes = {
  data: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
};

export default Trailer;
