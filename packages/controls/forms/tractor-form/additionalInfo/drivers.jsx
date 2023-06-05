import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { AssignDriverNew } from '@vezubr/components';
import { Ant, VzForm, IconDeprecated } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import t from '@vezubr/common/localization';
const DriversAdditional = (props) => {
  const { linkedDrivers = [], setLinkedDrivers } = props;
  const [showAddDriver, setShowAddDriver] = useState(false);
  const user = useSelector((state) => state.user);

  const openAddDriver = useCallback(() => {
    setShowAddDriver(true);
  }, []);

  const closeAddDriver = useCallback(() => {
    setShowAddDriver(false);
  }, []);

  const removeDriver = useCallback(
    (id) => {
      setLinkedDrivers(linkedDrivers.filter((el) => el.id !== id));
    },
    [linkedDrivers],
  );

  const driversList = useMemo(() => {
    return linkedDrivers.map((val, key) => {
      return (
        <div className={`size-1 align-center flexbox margin-bottom-12 ${key > 0 ? 'margin-left-8' : ''}`} key={key}>
          <div className={'empty-attach-input'}>
            <img
              style={{ width: '52px', height: '52px' }}
              src={`${window.API_CONFIGS[APP].host}${val?.photoFile?.downloadUrl.replace('/', '')}`}
            />
          </div>
          <div className={'flexbox column align-left justify-center margin-left-16'}>
            <span>
              {val.name} {val.surname}
            </span>
          </div>
          <div className={'flexbox size-1 justify-right center'}>
            <IconDeprecated className={'pointer'} onClick={() => removeDriver(val.id)} name={'trashBinOrange'} />
          </div>
        </div>
      );
    });
  }, [linkedDrivers]);

  return (
    <div className={'area'}>
      <p className={'area-title margin-bottom-12'}>{'Прикрепленные Водители'}</p>
      <div className={'flexbox'} style={{ flexWrap: 'wrap' }}>
        {driversList}
      </div>
      <div className={'flexbox'}>
        <div className={'empty-attach-input'} onClick={() => openAddDriver()}>
          <IconDeprecated name={'plusOrange'} />
        </div>
        <div className={'flexbox column align-left justify-center margin-left-16'}>
          <a onClick={() => openAddDriver()}>{'Добавить Водителя'}</a>
          <div className={'support-format'}> {t.order('selectFromList')}</div>
        </div>
      </div>
      {showAddDriver && (
        <AssignDriverNew
          showModal={showAddDriver}
          userId={user?.id}
          onClose={() => closeAddDriver()}
          assignedDrivers={linkedDrivers}
          className={''}
          onSelect={(e) => setLinkedDrivers(e)}
        />
      )}
    </div>
  );
};

export default DriversAdditional;
