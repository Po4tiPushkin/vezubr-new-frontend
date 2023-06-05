import React from 'react';
import { observer } from 'mobx-react';
import { Ant, VzForm } from '@vezubr/elements';
import OrderFieldSwitch from '../../../form-fields/order-field-switch';
import OrderFieldSelect from '../../../form-fields/order-field-select';
import { OrderContext } from '../../../context';

function OrderAdvancedRequirementsTransport(props) {
  const { disabled = false, geozones } = props
  const { store } = React.useContext(OrderContext)
  return (
    <Ant.Collapse className={'order-advanced-options'}>
      <Ant.Collapse.Panel id={'order-advancedrequirements'} header="Показать дополнительные требования" key="2">
        <VzForm.Row>
          <VzForm.Col span={6}>
            <OrderFieldSelect
              name={'requiredPasses'}
              list={{
                array: geozones,
                labelKey: 'label',
                valueKey: 'value',
              }}
              allowClear={false}
              label={'Пропуск ТС'}
              placeholder={'Выберите пропуск'}
              disabled={disabled}
              opitonId={'order-requiredpass'}
              id={'order-requiredpasses'}
            />
          </VzForm.Col>
          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Санитарная обработка'}
              name={'sanitaryPassportRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-sanitarypassportrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Медицинская книжка'}
              name={'sanitaryBookRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-sanitarybookrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Нужен гидроборт'}
              name={'hydroliftRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-hydroliftrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Наличие рохлы'}
              name={'palletJackIsRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-palletjackisrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Наличие конников'}
              name={'conicsIsRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-conicsisrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'GPS Мониторинг'}
              name={'isGPSMonitoringRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-isgpsmonitoringrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Нужен термописец'}
              name={'isThermograph'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              id={'order-isthermograph'}
              disabled={!store.getDataItem('bodyTypes').find(el => el === 2)}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Нужны Ремни'}
              name={'isStrapRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-isstraprequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Нужна Цепь'}
              name={'isChainRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-ischainrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Нужен Брезент'}
              name={'isTarpaulinRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-istarpaulinrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Нужны Сети'}
              name={'isNetRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-isnetrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Нужны Башмаки'}
              name={'isWheelChockRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-iswgeelchockrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Угловые стойки'}
              name={'isCornerPillarRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-iscornerpillarrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Допельшток'}
              name={'isDoppelstockRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-isdoppelstockrequired'}
            />
          </VzForm.Col>

          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Деревянный пол'}
              name={'isWoodenFloorRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
              id={'order-iswoodenfloorrequired'}
            />
          </VzForm.Col>
          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Водитель-грузчик'}
              name={'isDriverLoaderRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
            />
          </VzForm.Col>
          <VzForm.Col span={6}>
            <OrderFieldSwitch
              label={'Вывоз упаковки'}
              name={'isTakeOutPackageRequired'}
              checkedTitle={'Да'}
              unCheckedTitle={'Нет'}
              disabled={disabled}
            />
          </VzForm.Col>

        </VzForm.Row>

      </Ant.Collapse.Panel>
    </Ant.Collapse>
  );
}
export default observer(OrderAdvancedRequirementsTransport);
