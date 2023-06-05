import React, { useState, useMemo } from 'react';
import DriversList from '../../lists/driversList';
import { ButtonDeprecated, IconDeprecated } from '@vezubr/elements';
import Utils from '@vezubr/common/common/utils';
import cn from 'classnames';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
const getPhoneNumber = (phone) => {
  let parsedPhone = phone;

  if (!parsedPhone) {
    return null;
  }

  if (parsedPhone[0] === '8') {
    parsedPhone = '7' + parsedPhone.slice(1);
  }

  if (parsedPhone[0] === '9') {
    parsedPhone = '7' + parsedPhone;
  }
  return (
    <span className="phone">
      {parsedPhone &&
        parsePhoneNumberFromString(`+${parsedPhone}`) &&
        parsePhoneNumberFromString(`+${parsedPhone}`).format('INTERNATIONAL')}
    </span>
  );
}

const Driver = (props) => {
  const {
    showDriversList,
    toggleDriversList,
    onDriverSelect,
    showPhone,
    drivers,
    newApi,
    onClose,
    driver,
    data,
    tractor,
    isAvailableForTractor,
  } = props;

  const renderDriverElement = useMemo(() => {
    const willBePhone = !!(showPhone && driver?.driver?.contactPhone);
    const photoDriver = driver?.driver?.photoFile?.imageFilesPreviewModel[1];
    return (
      <div className={'flexbox center empty-driver'}>
        <div className="icon-container">
          {driver?.driver?.photoFile ? (
            <img
              src={`${window.API_CONFIGS[APP].host}${photoDriver?.downloadUrl.replace(
                '/',
                '',
              )}`}
            />
          ) : (
            <IconDeprecated name={'driverGrey'} />
          )}
        </div>
        <div className={cn('flexbox margin-left-10 flex-1 column')} style={{ width: '100%' }}>
          <span className={'flexbox narrow grey'}>
            {driver?.driver ? `${driver.driver.name} ${driver.driver.surname}` : 'Выбрать Водителя'}
          </span>
          {driver?.driver && (
            <span className={cn('status', { 'with-phone': willBePhone })}>{Utils.driverStatus(driver)}</span>
          )}
          {driver?.driver && getPhoneNumber(driver.driver.contactPhone)}
        </div>
        {data?.availibility !== 2 && drivers?.length ? (
          <span className={'flexbox'} onClick={() => { if (!showDriversList) { toggleDriversList() } }}>
            <IconDeprecated name={'chevronDownBlue'} />
          </span>
        ) : <div style={{ width: '44px', height: '44px' }}></div>}
      </div>
    );
  }, [driver, showPhone, data, showDriversList, tractor]);

  const renderDrivers = useMemo(() => {
    return (
      <div
        className={`driver-selection flexbox vertical-line margin-left-10 ${isAvailableForTractor && !tractor ? 'disabled' : ''}`}
      >
        {renderDriverElement}
        {showDriversList ? (
          <DriversList
            onSelect={onDriverSelect}
            onClose={() => toggleDriversList()}
            showPhone={showPhone}
            drivers={drivers}
            newApi={newApi}
            tractor={tractor}
          />
        ) : null}
      </div>
    );
  }, [showDriversList, drivers, renderDriverElement, isAvailableForTractor, tractor])

  return (
    <>
      {renderDrivers}
    </>
  )
}

export default Driver;