import { VzDescriptions, WhiteBox } from '@vezubr/elements';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useContext } from 'react';
import CargoAdressesForm from '../../../../../forms/cargo-place/cargo-addresses-form';
import { CargoContextView } from '../../context';
function dateFormatter(date) {
  return date && moment(date).format('DD-MM-YYYY');
}

function CargoViewInfo() {
  const { store, mode, setMode, cargoAddresses, addressesForm, setAddressesForm } = useContext(CargoContextView);
  const { data } = store;

  return (
    <WhiteBox style={{ paddingTop: 1 }} className={'cargo-view-main-info'} scroll={{ x: 550, y: 500 }}>
      <VzDescriptions
        title={'Ответственный за доставку'}
        theme={'bordered-underline'}
        bordered={true}
        size={'small'}
        column={1}
        colon={false}
        className={'title-bold'}
      >
        <VzDescriptions.Item label={'ИНН организатора'} className={'width'}>
          {data.deliveryResponsibleInn}
        </VzDescriptions.Item>
        <VzDescriptions.Item label={''} className={'width'}>
          {' '}
        </VzDescriptions.Item>
      </VzDescriptions>
      <CargoAdressesForm
        values={data}
        setAddressesForm={setAddressesForm}
        wrappedComponentRef={(form) => setAddressesForm(form)}
        disabled={mode === 'view'}
        mode={mode}
        cargoAddresses={cargoAddresses}
      />
    </WhiteBox>
  );
}

export default observer(CargoViewInfo);
