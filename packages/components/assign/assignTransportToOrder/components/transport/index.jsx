import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Driver from './elements/driver';
import Vehicle from './elements/vehicle';
import Tractor from './elements/tractor';
import { Ant, IconDeprecated } from '@vezubr/elements';

const Transport = (props) => {
  const { driver: driverInfo, loading, drivers, showPhone, onSelect, data, indx, onRemove } = props;
  const [driver, setDriver] = useState(null);
  const [tractor, setTractor] = useState((data?.tractorsData || []).find(el => el.id === data?.tractorId));
  const [showDriversList, setShowDriversList] = useState(false);
  const [showTractorsList, setShowTractorsList] = useState(false);

  useEffect(() => {
    setDriver(driverInfo);
  }, [driverInfo]);

  useEffect(() => {
    if (drivers.length == 1) {
      setDriver(drivers[0])
    }
  }, [drivers])

  const toggleDriversList = () => {
    setShowDriversList(prev => !prev);
  }

  const toggleTractorsList = () => {
    setShowTractorsList(prev => !prev);
  }

  const onDriverSelect = (driver) => {
    setDriver(driver);
    toggleDriversList();
  }

  const onTractorSelect = (tractor) => {
    setTractor(tractor);
    setDriver(null)
    toggleTractorsList();
  }

  const disabledButton = useMemo(() => {
    if (loading) {
      return true
    }
    if (!driver || (driver && !Object.keys(driver).length)) {
      return true
    }
    if (data?.vehicleData?.vehicleConstructionType == 2 && (!tractor || (tractor && !Object.keys(tractor).length))) {
      return true
    }
    return false;
  }, [tractor, loading, driver, drivers, data])

  return (
    <div className={`transport-single padding-5 ${indx > 0 ? 'margin-top-12' : ''}`}>
      <div className='flexbox'>
        <div style={{ 'width': '100%' }}>
          <div className='flexbox'>
            <Vehicle
              data={data}
              drivers={data?.vehicleData?.vehicleConstructionType === 2 ? tractor?.linkedDrivers || [] : drivers}
              isAvailableForTractor={data?.vehicleData?.vehicleConstructionType === 2}
            />
            <Tractor
              onTractorSelect={onTractorSelect}
              showTractorsList={showTractorsList}
              data={data}
              toggleTractorsList={toggleTractorsList}
              tractors={data.tractorsData}
              tractor={tractor}
            />
          </div>
          {APP === 'dispatcher' && <span className=' margin-left-12 text-right text-small'>{data?.vehicleData?.producer?.title || data?.vehicleData?.producer?.inn}</span>}
        </div>
        <Driver
          data={data}
          toggleDriversList={toggleDriversList}
          driver={driver}
          showDriversList={showDriversList}
          showPhone={showPhone}
          onDriverSelect={onDriverSelect}
          tractor={tractor?.id}
          drivers={data?.vehicleData?.vehicleConstructionType === 2 ? tractor?.linkedDrivers || [] : drivers}
          isAvailableForTractor={data?.vehicleData?.vehicleConstructionType === 2}
        />
        <div className={'flexbox driver-action justify-right align-center margin-left-8 margin-right-2'}>
          <Ant.Button
            onClick={() =>
              data?.availibility === 2 ? void 1 : onSelect ? onSelect(data, driver, tractor) : onRemove ? onRemove(data) : null
            }
            className={'square'}
            loading={loading === data?.vehicleData?.id}
            disabled={disabledButton}
            type={'primary'}
            style={{ width: '44px', height: '44px' }}
          >
            <IconDeprecated name={data?.availibility === 2 ? 'eyeWhite' : onSelect ? 'chevronRightWhite' : 'xWhite'} />
            </Ant.Button>
        </div>
      </div>
    </div>
  )
}

export default Transport;