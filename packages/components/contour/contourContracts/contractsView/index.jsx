import React from 'react';
import { GeoZones as GeoPassess } from '@vezubr/elements';
import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/constants';
import InputField from '../../../inputField/inputField';
import t from '@vezubr/common/localization';

function ContractsView(props) {
  const { contracts, removeContract, contractorContract, changeContractType } = props;
  return contracts.map((val, key) => {
    return (
      <div key={key} className={`flexbox center ${key > 0 ? 'margin-top-8' : ''}`}>
        <GeoPassess
          className={'size-1'}
          detail={contractorContract[val.type]}
          name={`gz_${key}`}
          placeholder={'Выберите тип договора'}
          title={'Тип договора'}
          onRemove={(e) => removeContract(key, val.contourId)}
          data={{}}
        />
        {val.contourId === CONTOUR_MAIN_ID && (
          <InputField
            style={{ height: '64px' }}
            className={'size-0_3 margin-left-8'}
            title={t.common('Плата за ПО %')}
            type={'text'}
            name={'contractType'}
            onlyNum={true}
            allowDot={true}
            allowNull={true}
            value={val.rate || 0}
            onChange={(e) => changeContractType(key, e, val.contourId)}
          />
        )}
      </div>
    );
  });
}

export default ContractsView;
