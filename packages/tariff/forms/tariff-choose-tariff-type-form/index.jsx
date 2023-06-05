import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import { useSelector } from 'react-redux';

const TARIFF_CONFIG_TYPES = [
  {
    id: 1,
    title: 'Почасовой'
  },
  {
    id: 3,
    title: 'Фиксированный'
  },
  {
    id: 4,
    title: 'Пробег'
  }
]

function TariffChooseTariffTypeForm(props) {
  const { onChoose, disabled = false, values } = props;
  const dictionaries = useSelector(state => state.dictionaries);
  const [orderType, setOrderType] = useState(values?.orderType || null);
  const [tariffConfig, setTariffConfig] = useState(values?.type || null);

  const orderTypeOptions = useMemo(() => {
    return dictionaries.tariffOrderTypes.map(el => (
      <Ant.Select.Option value={el.id}>{el.title}</Ant.Select.Option>
    ))
  }, []);

  const tariffConfigOption = useMemo(() => {
    return TARIFF_CONFIG_TYPES.map(el => (
      <Ant.Select.Option value={el.id}>{el.title}</Ant.Select.Option>
    ))
  }, [])

  const onOrderTypeChange = (e) => {
    setOrderType(e);
    if (e === 'loaders_order' || APP === 'producer') {
      setTariffConfig(1)
      return;
    }
    setTariffConfig(null);
  }

  useEffect(() => {
    if (!disabled && orderType && tariffConfig && onChoose) {
      if (orderType === 'loaders_order') {
        onChoose(2)
        return;
      }
      else {
        onChoose(tariffConfig)
      }

    }
    if (!tariffConfig && onChoose) {
      onChoose(null);
    }
  }, [disabled, orderType, tariffConfig])

  return (
    <div className={'tariff-choose-tariff-type-form'}>
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={disabled} label={'Тип Заказа'}>
              <Ant.Select value={orderType} disabled={disabled} onSelect={onOrderTypeChange} placeholder={'Выберите тип Заказа'}>
                {orderTypeOptions}
              </Ant.Select>
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={disabled || !orderType || orderType === 'loaders_order'} label={'Конфигурация тарифа'}>
              <Ant.Select
                disabled={APP === 'producer' || disabled || !orderType || orderType === 'loaders_order'}
                placeholder={'Выберите конфигурацию тарифа'}
                value={tariffConfig}
                onChange={(e) => setTariffConfig(prev => e)}
              >
                {tariffConfigOption}
              </Ant.Select>
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
    </div>
  );
}

export default TariffChooseTariffTypeForm;
