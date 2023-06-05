import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, VzForm } from '@vezubr/elements';
import * as Order from '../../../..';
import t from '@vezubr/common/localization';
import Animate from 'rc-animate';
import OrderAutoRepublishSelect from '../../form-components/order-auto-republish-select';
import OrderContourTreeSelectDispatcher from '../../form-components/order-contour-tree-select-dispatcher';
import OrderContourTreeSelectClient from '../../form-components/order-contour-tree-select-client';
import { useSelector } from 'react-redux';
const CLS_COMPONENT = 'order-rate-publish-form';

function OrderRatePublishForm(props) {
  const {
    onSubmit,
    onCancel,
    cargoTypes,
    republishing = false,
    inn,
    producers,
    disabledFields = [],
    employees = [],
    edit = true,
    regular = false,
    loading = false,
  } = props;

  const user = useSelector((state) => state.user);

  const { store } = React.useContext(Order.Context.OrderContext);

  const handleSave = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(store, { ...e.target.dataset });
      }
    },
    [onSubmit],
  );

  React.useEffect(() => {
    store.setDataItem('selectingStrategy', 1);
    store.setDataItem('useClientRate', 1);

    if (republishing) {
      store.setDataItem('republishing', true);
      if (!store.data.clientRatePlaceholder) {
        store.setDataItem('clientRatePlaceholder', store.data.clientRate);
      }
      store.setDataItem('clientRate', store.getDataItem('preliminaryRate'));
    }
    return () => {
      if (!disabledFields.includes('clientRate')) {
        store.setDataItem('clientRate', null);
      }
      if (republishing) {
        store.setDataItem('responsibleEmployees', []);
      }
    };
  }, []);

  useEffect(() => {
    if (user?.costWithVat && store.data.clientRatePlaceholder) {
      const clientRateVatPlaceholder =
        store.data.clientRatePlaceholder + (store.data.clientRatePlaceholder * parseInt(user?.vatRate)) / 100;
      store.setDataItem('clientRateVatPlaceholder', clientRateVatPlaceholder);
    }
  }, [user]);

  return (
    <div className={`${CLS_COMPONENT}`}>
      <VzForm.Group title={`Выбор подрядчиков ${(!republishing && APP === 'dispatcher') ? 'ГВ' : ''}`}>
        {APP === 'dispatcher' ?
          <OrderContourTreeSelectDispatcher
            disabled={disabledFields.includes('contourTree')}
            user={user}
            producers={producers}
            republishing={republishing}
            inn={inn}
          />
          :
          <OrderContourTreeSelectClient disabled={disabledFields.includes('contourTree')} producers={producers} />
        }
      </VzForm.Group>

      {(APP === 'dispatcher' && !republishing) && (
        <VzForm.Group title={'Автоматическая перепубликация'}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <Order.FormFields.Switch
                label={'Автоматически перепубликовывать рейс'}
                name={'autoRepublish'}
                checkedTitle={'Да'}
                unCheckedTitle={'Нет'}
                disabled={disabledFields.includes('autoRepublish')}
              />
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            {store.data.autoRepublish && (
              <VzForm.Col span={24}>
                <OrderAutoRepublishSelect inn={inn} user={user} />
              </VzForm.Col>
            )}
          </VzForm.Row>
        </VzForm.Group>
      )}

      <VzForm.Group title={'Ваша ставка'}>
        <VzForm.Row>
          <Animate transitionLeave={false} transitionName="fade" component={''} key={'clientRate'}>
            {store.data.useClientRate || republishing ? (
              <VzForm.Col span={12}>
                <Order.FormFields.Currency
                  label={'Ставка для публикации, руб. (Без НДС)'}
                  name={'clientRate'}
                  precision={2}
                  step={500}
                  min={0}
                  disabled={disabledFields.includes('clientRate')}
                  id={'order-clientrate'}
                />
              </VzForm.Col>
            ) : null}
          </Animate>
          {user?.costWithVat ? (
            <Animate transitionLeave={false} transitionName="fade" component={''} key={'clientRateVat'}>
              {store.data.useClientRate || republishing ? (
                <VzForm.Col span={12}>
                  <Order.FormFields.Currency
                    label={'Ставка для публикации, руб. (C НДС)'}
                    name={'clientRateVat'}
                    precision={2}
                    step={500}
                    min={0}
                    disabled={disabledFields.includes('clientRate')}
                    id={'order-clientrate'}
                  />
                </VzForm.Col>
              ) : null}
            </Animate>
          ) : null}
          {!republishing && store.data.autoRepublish ? (
            <VzForm.Col span={12}>
              <Order.FormFields.Currency
                label={'Ставка для подрядчиков, руб. (Без НДС)'}
                name={'clientRateProducers'}
                step={500}
                min={0}
                precision={2}
                disabled={disabledFields.includes('clientRateProducers')}
              />
            </VzForm.Col>
          ) : null}
          {!republishing && store.data.autoRepublish && user?.costWithVat ? (
            <VzForm.Col span={12}>
              <Order.FormFields.Currency
                label={'Ставка для подрядчиков, руб. (C НДС)'}
                name={'clientRateProducersVat'}
                step={500}
                min={0}
                precision={2}
                disabled={disabledFields.includes('clientRateProducers')}
              />
            </VzForm.Col>
          ) : null}
          {republishing && store.data.clientRatePlaceholder ? (
            <>
              <VzForm.Col span={12}>
                <Order.FormFields.Currency
                  label={'Ставка, полученная от Заказчика, руб. (Без НДС)'}
                  name={'clientRatePlaceholder'}
                  step={500}
                  min={0}
                  precision={2}
                  disabled={true}
                />
              </VzForm.Col>
              {user?.costWithVat && (
                <VzForm.Col span={12}>
                  <Order.FormFields.Currency
                    label={'Ставка, полученная от Заказчика, руб. (С НДС)'}
                    name={'clientRateVatPlaceholder'}
                    step={500}
                    min={0}
                    precision={2}
                    disabled={true}
                  />
                </VzForm.Col>
              )}
            </>
          ) : null}
        </VzForm.Row>
      </VzForm.Group>

      {
        store.getDataItem('orderType') !== 2 && (
          <Order.FormComponents.AdvancedCargoInfo
            insuranceAmount={store.getDataItem('insuranceAmount')}
            insured={store.getDataItem('insurance')}
            republish={republishing}
            isInsuranceRequired={store.getDataItem("isInsuranceRequired")}
          />
        )
      }
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <Order.FormFields.Employees
              data={employees}
              name={'responsibleEmployees'}
              allowClear={true}
              wrapped={false}
              edit={!disabledFields.includes('responsibleEmployees')}
              titleText={''}
              id={'order-employees'}
              optionId={'order-employee'}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Actions className={`${CLS_COMPONENT}__actions`}>
        <Ant.Button id={'order-cancel'} type={'ghost'} onClick={onCancel}>
          {t.order('cancel')}
        </Ant.Button>

        <Ant.Button id={'order-pusblish'} disabled={loading} type={'primary'} onClick={handleSave}>
          Опубликовать
        </Ant.Button>
      </VzForm.Actions>
    </div>
  );
}

OrderRatePublishForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  republishing: PropTypes.bool,
};

export default observer(OrderRatePublishForm);
