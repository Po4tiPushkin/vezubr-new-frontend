import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, VzForm } from '@vezubr/elements';
import { BARGAIN_STRATEGY_TYPES } from '../../../constants';
import * as Order from '../../../..';
import t from '@vezubr/common/localization';
import OrderContourTreeSelectDispatcher from '../../form-components/order-contour-tree-select-dispatcher';
import OrderContourTreeSelectClient from '../../form-components/order-contour-tree-select-client';
import moment from 'moment';
import { useSelector } from 'react-redux';
import OrderAutoRepublishSelect from '../../form-components/order-auto-republish-select';

const STRATEGY_TYPES_IDS = Object.keys(BARGAIN_STRATEGY_TYPES).map((idStrategyString) => ~~idStrategyString);

const CLS_COMPONENT = 'order-intercity-bargain-form';

const tradingPlatforms = [
  {
    title: 'Torgtrans',
    value: 1,
    key: 1,
  },
  {
    title: 'ATI.SU',
    value: 2,
    key: 2,
  },
];

const BargainEndDate = observer(() => {
  const { store } = React.useContext(Order.Context.OrderContext);

  const { pickedDate } = store.data;

  const disabledDate = React.useCallback(
    (date) => {
      return date.isBefore(moment(), 'date') || date.isAfter(pickedDate, 'date');
    },
    [pickedDate],
  );

  return <Order.FormFields.Date
    changeAddress={false}
    name={'bargainsEndDate'}
    label={'Дата окончания'}
    disabledDate={disabledDate}
  />;
});

function OrderBargainPublishForm(props) {
  const {
    onSubmit,
    onCancel,
    inn,
    producers,
    republishing,
    employees = [],
    edit = true,
    regular = false,
    disabledFields = [],
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
  //

  React.useEffect(() => {
    if (!STRATEGY_TYPES_IDS.includes(store.getDataItemNoComputed('selectingStrategy'))) {
      store.setDataItem('selectingStrategy', 2);
    }
    store.setDataItem('useBidStep', true)
    return () => {
      if (republishing) {
        store.setDataItem('responsibleEmployees', []);
      }
      store.setDataItem('useBidStep', false)
    };
  }, []);

  React.useEffect(() => {
    if (user?.costWithVat && store.data.clientRatePlaceholder) {
      const clientRateVatPlaceholder = (store.data.clientRatePlaceholder + (store.data.clientRatePlaceholder * parseInt(user?.vatRate) / 100))
      store.setDataItem('clientRateVatPlaceholder', clientRateVatPlaceholder)
    }
  }, [user])

  return (
    <div className={`${CLS_COMPONENT}`}>
      <VzForm.Group title={'Выбор подрядчиков'}>
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
      {(APP === 'dispatcher' && !store.data.regular && !republishing) && (
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
              <OrderAutoRepublishSelect inn={inn} user={user} />
            )}
          </VzForm.Row>
        </VzForm.Group>
      )}

      <VzForm.Group title={'Тип и начальная стоимость Торгов'}>
        <VzForm.Row>
          <VzForm.Col span={user?.costWithVat ? 12 : 8}>
            <Order.FormFields.Currency
              disabled={disabledFields.includes('clientRate')}
              label={'Желаемая стоимость, руб. (Без НДС)'}
              name={'clientRate'}
              placestep={500}
              precision={2}
              min={0}
              id={'order-clientrate'}
            />
          </VzForm.Col>

          {user?.costWithVat ? (
            <VzForm.Col span={12}>
              <Order.FormFields.Currency
                disabled={disabledFields.includes('clientRateVat')}
                label={'Желаемая стоимость, руб. (С НДС)'}
                name={'clientRateVat'}
                step={500}
                precision={2}
                min={0}
                id={'order-clientratevat'}
              />
            </VzForm.Col>
          ) : null}

          <VzForm.Col span={8}>
            <Order.FormFields.Currency
              disabled={disabledFields.includes('bidStep')}
              label={'Шаг торгов, руб. (Без НДС)'}
              name={'bidStep'}
              step={500}
              min={0}
              precision={2}
            />
          </VzForm.Col>

          {user?.costWithVat ? (
            <VzForm.Col span={8}>
              <Order.FormFields.Currency disabled={disabledFields.includes('bidStepVat')} label={'Шаг торгов, руб. (С НДС)'} name={'bidStepVat'} step={500} precision={2} min={0} />
            </VzForm.Col>
          ) : (
            null
          )}

          <VzForm.Col span={8}>
            <Order.FormFields.Select
              name={'selectingStrategy'}
              allowClear={false}
              edit={!disabledFields.includes('selectingStrategy')}
              objectList={BARGAIN_STRATEGY_TYPES}
              label={'Тип торгов'}
              placeholder={'Выберите тип торга'}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group title={'Дата и время окончания торга (в вашем часовом поясе)'}>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <BargainEndDate />
          </VzForm.Col>

          <VzForm.Col span={12}>
            <Order.FormFields.Time
              format={'HH:mm:ss'}
              minuteStep={1}
              name={'bargainsEndTime'}
              disabled={disabledFields.includes('bargainsEndTime')}
              label={'Время окончания'}
              changeAddress={false}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group title={'Торговые площадки'}>
        <Order.FormFields.TreeSelect
          style={{ height: 34 }}
          name={'tradingPlatforms'}
          maxTagCount={3}
          treeNodeFilterProp={'title'}
          treeData={tradingPlatforms}
          allowClear={false}
          treeCheckable={true}
          showCheckedStrategy={Ant.TreeSelect.SHOW_CHILD}
          searchPlaceholder={'Выберите площадки'}
          placeholder={'Выберите площадки'}
          label={'Внешнии торговые площадки'}
          disabled={disabledFields.includes('tradingPlatforms')}
        />
      </VzForm.Group>
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
              titleText={''}
              wrapped={false}
              edit={!disabledFields.includes('responsibleEmployees')}
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

        <Ant.Button id={'order-publish'} type={'primary'} disabled={loading} onClick={handleSave}>
          Отправить в торги
        </Ant.Button>
      </VzForm.Actions>
    </div>
  );
}

export default observer(OrderBargainPublishForm);
