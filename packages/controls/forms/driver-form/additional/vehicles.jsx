import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { AssignTransportNew } from '@vezubr/components';
import { Ant, VzForm, IconDeprecated } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import t from '@vezubr/common/localization';
const VehiclesAdditional = (props) => {
  const { linkedVehicles = [], setLinkedVehicles } = props;
  const [showAddTransport, setShowAddTransport] = useState(false);
  const user = useSelector((state) => state.user);

  const openAddTransport = useCallback(() => {
    setShowAddTransport(true);
  }, []);

  const closeAddTransport = useCallback(() => {
    setShowAddTransport(false);
  }, []);

  const removeTransport = useCallback(
    (id) => {
      setLinkedVehicles(linkedVehicles.filter((el) => el.id !== id));
    },
    [linkedVehicles],
  );

  const transportsList = useMemo(() => {
    return linkedVehicles.map((val, key) => {
      return (
        <div className={`size-1 align-center flexbox margin-bottom-12 ${key > 0 ? 'margin-left-8' : ''}`} key={key}>
          <div className={'empty-attach-input'}>
            <img
              style={{ width: '52px', height: '52px' }}
              src={`${window.API_CONFIGS[APP].host}${val?.photoFile?.downloadUrl.replace('/', '')}`}
            />
          </div>
          <div className={'flexbox column align-left justify-center margin-left-16'}>
            <span>{val.plateNumber}</span>
            <br />
            <span>{val.markAndModel}</span>
          </div>
          <div className={'flexbox size-1 justify-right center'}>
            <IconDeprecated className={'pointer'} onClick={() => removeTransport(val.id)} name={'trashBinOrange'} />
          </div>
        </div>
      );
    });
  }, [linkedVehicles]);

  return (
    <div className={'area'}>
      <p className={'area-title margin-bottom-12'}>{'Прикрепленные ТС (опционально)'}</p>
      <div className={'flexbox'} style={{ flexWrap: 'wrap' }}>
        {transportsList}
      </div>
      <div className={'flexbox'}>
        <div className={'empty-attach-input'} onClick={() => openAddTransport()}>
          <IconDeprecated name={'plusOrange'} />
        </div>
        <div className={'flexbox column align-left justify-center margin-left-16'}>
          <a onClick={() => openAddTransport()}>{'Добавить ТС'}</a>
          <div className={'support-format'}> {t.order('selectFromList')}</div>
        </div>
      </div>
      {showAddTransport && (
        <AssignTransportNew
          showModal={showAddTransport}
          userId={user?.id}
          onClose={() => closeAddTransport()}
          assignedTransports={linkedVehicles}
          className={''}
          onSelect={(e) => setLinkedVehicles(e)}
        />
      )}
    </div>
  );
};

export default VehiclesAdditional;
