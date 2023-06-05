import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, VzForm } from '@vezubr/elements';
import * as Order from '../../../..';
import t from '@vezubr/common/localization';
import OrderContourTreeSelectDispatcher from '../../form-components/order-contour-tree-select-dispatcher';
import OrderContourTreeSelectClient from '../../form-components/order-contour-tree-select-client';
import OrderAutoRepublishSelect from '../../form-components/order-auto-republish-select';
import { useSelector } from 'react-redux';
const CLS_COMPONENT = 'order-tariff-publish-form';

function OrderTariffPublishForm(props) {
  const {
    onSubmit,
    onCancel,
    cargoTypes,
    republishing = false,
    inn,
    employees = [],
    regular = false,
    edit = true,
    disabledFields = [],
    loading = false
  } = props;
  const user = useSelector((state) => state.user)
  const { store } = React.useContext(Order.Context.OrderContext);

  const handleSave = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(store);
      }
    },
    [onSubmit],
  );

  const handleCancel = React.useCallback(() => {
    // store.setDataItem('selectedTariffs', []);
    if (onCancel) {
      onCancel(store);
    }
  }, [onCancel]);

  React.useEffect(() => {
    store.setDataItem('selectingStrategy', 1)
    return () => {
      store.setDataItem('selectedTariffs', []);
      if (republishing) {
        store.setDataItem('responsibleEmployees', [])
      }
    };
  }, [])

  return (
    <div className={`${CLS_COMPONENT}`}>
      <VzForm.Group title={'Выбор подрядчиков'}>
        {APP === 'dispatcher' ?
          <OrderContourTreeSelectDispatcher
            disabled={disabledFields.includes('contourTree')}
            user={user}
            republishing={republishing}
            inn={inn}
            isTariff={true}
          />
          :
          <OrderContourTreeSelectClient isTariff={true} disabled={disabledFields.includes('contourTree')} />
        }
      </VzForm.Group>

      {(APP === 'dispatcher' && !republishing) && (
        <VzForm.Group title={'Автоматическая перепубликация'}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <Order.FormFields.Switch
                label={'Автоматически перепубликовывать рейс'}
                name={'autoRepublish'}
                disabled={disabledFields.includes('autoRepublish')}
                checkedTitle={'Да'}
                unCheckedTitle={'Нет'}
              />
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            {store.data.autoRepublish && (
              <OrderAutoRepublishSelect inn={inn} user={user} isTariff={true} />
            )}
          </VzForm.Row>


        </VzForm.Group>
      )}
      {
        store.getDataItem('orderType') !== 2 && (
          <Order.FormComponents.AdvancedCargoInfo
            insuranceAmount={store.getDataItem('insuranceAmount')}
            insured={store.getDataItem('insurance')}
            republish={republishing}
            isInsuranceRequired={store.getDataItem("isInsuranceRequired")}
            isClientInsurance={store.getDataItem('isClientInsurance')}
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
        <Ant.Button id={'order-cancel'} type={'ghost'} onClick={handleCancel}>
          {t.order('cancel')}
        </Ant.Button>

        <Ant.Button id={'order-publish'} htmlType="submit" disabled={loading} onClick={handleSave} type={'primary'}>
          Опубликовать
        </Ant.Button>
      </VzForm.Actions>
    </div>
  );
}

OrderTariffPublishForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  republishing: PropTypes.bool
};

export default observer(OrderTariffPublishForm);
