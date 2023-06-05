import React, { useCallback, useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { Ant, VzForm } from '@vezubr/elements';
import { TariffContext } from '../../context';

const TariffAddressesView = (props) => {
  const { store } = useContext(TariffContext);

  const { addresses } = store;

  const getDescAddress = useCallback(
    (index) => {
      if (index === 0) {
        return 'Адрес подачи';
      } else if (index === addresses.length - 1) {
        return 'Адрес доставки';
      }
      return 'Промежуточный адрес';
    },
    [addresses],
  );

  const renderAddresses = useMemo(() => {
    return addresses.map((el, index) => (
      <VzForm.Col key={el.id} span={24}>
        <VzForm.Item label={getDescAddress(index)}>
          <Ant.Select disabled={true} value={el.id}>
            <Ant.Select.Option value={el.id}>
              {`${el.id} / ${el.title}`}
            </Ant.Select.Option>
          </Ant.Select>
        </VzForm.Item>
      </VzForm.Col>
    ))
  }, [addresses])
  return (
    <VzForm.Row>
      {renderAddresses}
    </VzForm.Row>
  )
}

export default TariffAddressesView;