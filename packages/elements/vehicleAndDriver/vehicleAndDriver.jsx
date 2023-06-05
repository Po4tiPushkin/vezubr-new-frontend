import React from 'react';
import PropTypes from 'prop-types';
import { ButtonDeprecated, DriverSelection } from '../index';
import Utils from '@vezubr/common/common/utils';

function VehicleAndDriver({ ...props }) {
  const { vehicle, onSelect, onSelectDriver, indx } = props;
  const data = vehicle?.vehicle;
  const serial = data?.plateNumber;
  const model = data?.markAndModel;
  const cap = data?.liftingCapacityInKg / 1000;
  const m3 = Utils.calcm3({
    bodyHeightInCm: data?.bodyHeightInCm / 100,
    bodyLengthInCm: data?.bodyLengthInCm / 100,
    bodyWidthInCm: data?.bodyWidthInCm / 100,
  });
  const drivers = vehicle.linkedDrivers; //.map(d=> d.driver);
  return (
    <div className={`driver-single padding-8 ${indx > 0 ? 'margin-top-12' : ''}`}>
      <div className={'flexbox'}>
        <div className={'size-1 flexbox'}>
          <div className={'img-wrapper size-0_2 flexbox justify-left'}>
            {data.photoFile ? (
              <img
                style={{ width: '52px', height: '52px' }}
                src={`${window.API_CONFIGS[APP].host}${data.photoFile.downloadUrl.replace('/', '')}`}
              />
            ) : null}
          </div>
          <div className={'size-1 text-left'}>
            <p className={'no-margin'}>
              <strong>{serial}</strong> {model}
            </p>
            <p className={'no-margin'}>
              {cap}т./{m3}m3/{data?.palletsCapacity} паллет
            </p>
          </div>
        </div>
        <div className={'size-1 padding-left-8'} style={{ borderLeft: '1px solid #DEE3E8' }}>
          <DriverSelection
            selected={vehicle.driver}
            key={indx}
            indx={indx}
            onSelect={(driver) => onSelectDriver(driver)}
            drivers={drivers}
          />
        </div>
        <div
          className={`size-0_1 padding-left-8 flexbox justify-right align-center ${
            vehicle.driver ? 'allowSelect' : ''
          }`}
          style={{ borderLeft: '1px solid #DEE3E8' }}
        >
          <ButtonDeprecated
            icon={'chevronRightWhite'}
            onClick={() => onSelect(vehicle)}
            className={'square'}
            iconNormal={true}
            theme={vehicle.driver ? 'primary' : 'disabled'}
            style={{ width: '44px', height: '44px' }}
          />
        </div>
      </div>
    </div>
  );
}

VehicleAndDriver.propTypes = {
  vehicle: PropTypes.object.isRequired,
  drivers: PropTypes.array,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
};

export default VehicleAndDriver;
