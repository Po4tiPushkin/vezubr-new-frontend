import React, { useState, useEffect, useMemo } from 'react';
import { Ant } from '@vezubr/elements/';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import Utils from '@vezubr/common/common/utils';
import { IconDeprecated } from '@vezubr/elements';
import './driversFilter';
const DriversFilter = (props) => {
  const { onSelect, onClose, showPhone, drivers = [], newApi = false } = props;
  const [filteredList, setFilteredList] = useState(drivers);
  const [search, setSearch] = useState('');
  const [id, setId] = useState(Date.now());
  useEffect(() => {
    const id = `df_${Date.now()}`;
    setId(id);
    document.body.addEventListener('click', (e) => {
      const item = document.getElementById(id);
      if (item && !item.contains(e.target)) {
        onClose();
      }
    });
    if (!search) {
      setFilteredList(drivers);
    }
    else {
      const newList = drivers.filter( driver => {
        return (
          driver.driver.name.toLowerCase().includes(search.toLowerCase()) ||
          driver.driver.surname.toLowerCase().includes(search.toLowerCase()) ||
          driver.driver?.patronymic?.toLowerCase().includes(search.toLowerCase())
        )
      })
      setFilteredList(newList);
    }

  }, [search]);

  const renderDrivers = useMemo(() => {
    const driversElement = filteredList.map((driver, key) => {
      const willBePhone = !!(showPhone && driver?.driver?.contactPhone);
      let driverPhoto;
      driverPhoto = driver?.driver?.photoFile?.imageFilesPreviewModel && driver?.driver?.photoFile?.imageFilesPreviewModel[1];
      return (
        <div className={'element'} key={key} onClick={() => onSelect(driver)}>
          <div className={'flexbox'}>
            <div className={'driver-image'}>
                {driver?.driver?.photoFile ? (
                  <img
                    src={`${window.API_CONFIGS[APP].host}${driverPhoto?.downloadUrl.replace(
                      '/',
                      '',
                    )}`}
                    alt=""
                  />
              ) : (
                <IconDeprecated name={'driverGrey'} />
              )}
              
            </div>
          </div>
          <div className={'flexbox column driver-info'}>
            <div className={'bold driver-name'}>
              {driver?.driver?.name} {driver?.driver?.patronymic} {driver?.driver?.surname}
            </div>
            <span className={'driver-status'}>{Utils.driverStatus(driver)}</span>
            {willBePhone && (
              <span className="driver-phone">
                {parsePhoneNumberFromString(`+${driver?.driver?.contactPhone}`)?.format('INTERNATIONAL') || ''}
              </span>
            )}
          </div>
        </div>
      );
    })
    return <div className={'drivers-elements'}>{driversElement}</div>
  }, [filteredList])

  return (
    <div className="drivers-filter" id={id}>
      <Ant.Input
        placeholder={'Поиск по всем водителям'}
        className={'margin-left-8 drivers-filter__search'}
        onChange={(e) => setSearch(e.target.value)}
        suffix={<IconDeprecated name={'searchBlue'} />}
      />
      {renderDrivers}
    </div>
  )
}

export default DriversFilter;