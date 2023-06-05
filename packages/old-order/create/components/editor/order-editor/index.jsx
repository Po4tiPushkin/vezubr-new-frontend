import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import _uniq from 'lodash/uniq';
import { connect } from 'react-redux';
import {
  Ant,
  IconDeprecated,
  Modal,
  showError,
  WhiteBoxDeprecated,
  WhiteBoxHeaderDeprecated,
} from '@vezubr/elements';
import * as Order from '../../../..';
import Utils from '@vezubr/common/common/utils';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import useModalGroup from '@vezubr/common/hooks/useModalGroup';
import {
  CALCULATION_FIELDS_DISPATCHER,
  CALCULATION_FIELDS,
  ORDER_BARGAIN_PUBLISH_FIELDS,
  ORDER_RATE_PUBLISH_FIELDS,
  ORDER_TARIFF_PUBLISH_FIELDS,
} from '../../../constants';
import useOrderCityIntercityCalc from '../../../hooks/useOrderCityIntercityCalc';
import { Profile as ProfileServices, Orders as OrderService } from '@vezubr/services';
import { CargoPlaceAccountingContext } from '../../../context';
import cn from 'classnames';
import { isEmptyAddresses } from '../../../utils';
import OrderTariffPublishForm from '../../forms/order-tariff-publish-form';
import OrderRatePublishForm from '../../forms/order-rate-publish-form';
import OrderBargainPublishForm from '../../forms/order-bargain-publish-form';

function OrderEditor(props) {
  const {
    dictionaries: dictionariesInput,
    user,
    observer,
    orderType,
    history,
    loading: loadingInput,
    saving: savingInput,
    onPublish: onPublishInput,
    onBargain: onBargainInput,
    onRate: onRateInput,
    onTariff: onTariffInput,
    onCancel,
    onChange,
    title,
    staticData: staticDataInput,
    lazyData: lazyDataInput,
    saveButtonText,
    disabledFields = [],
    additional,
    regular = false,
    arriveAt = null,
    orderIsActive = false,
    onActiveSave,
    republishing = false,
    edit = false,
  } = props;

  const [cargoPlaceAccounting, setCargoPlaceAccounting] = useState(false);
  const [isEmptyCargoPlace, setIsEmptyCargoPlace] = useState(false);

  const dictionaries = useConvertDictionaries({ dictionaries: dictionariesInput });

  const { cargoTypes } = dictionaries;

  const { modalIsVisible, modalToggle, modalSetVisible, modalGetToggleFunc } = useModalGroup();

  const [saving, setSaving] = React.useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchCargoPlaceAccounting = async () => {
    try {
      const { cargoPlaceAccounting } = await ProfileServices.getContractorConfiguration();

      setCargoPlaceAccounting(cargoPlaceAccounting);
    } catch (e) {
      console.error(e);
    }
  };

  const onPreSave = React.useCallback(
    async (store, data) => {
      const { values, hasError } = store.getValidateData({
        excludeFields: _uniq([
          ...ORDER_RATE_PUBLISH_FIELDS,
          ...ORDER_TARIFF_PUBLISH_FIELDS,
          ...ORDER_BARGAIN_PUBLISH_FIELDS,
        ]),
      });

      if (hasError && !orderIsActive && !republishing) {
        await Utils.setDelay(300);
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      const {
        calculation: { status: calcStatus, error: calcError },
      } = store.data;

      if (calcStatus !== 'calculated' && !orderIsActive && !republishing) {
        if (calcStatus === 'error') {
          showError(calcError, {
            title: 'Ошибка калькуляции',
          });
        } else {
          Ant.message.error('Исправьте ошибки в форме и дождитесь калькуляции заказа');
        }

        return;
      }

      const { bargaining, ratepublishing: ratePublishing, tariffpublishing: tariffPublishing } = data;

      if (isEmptyAddresses(values)) {
        setIsEmptyCargoPlace(true);
      } else {
        setIsEmptyCargoPlace(false);
      }

      if (bargaining) {
        modalSetVisible('bargainPublish', true);
      } else if (ratePublishing) {
        modalSetVisible('ratePublish', true);
      } else if (tariffPublishing) {
        modalSetVisible('tariffPublish', true);
      }
    },
    [orderIsActive, republishing],
  );

  const onRate = React.useCallback(
    async (store) => {
      setLoading(true);
      const { hasError } = store.getValidateData({
        onlyFields: ORDER_RATE_PUBLISH_FIELDS,
      });

      if (hasError && !orderIsActive) {
        Ant.message.error('Исправьте ошибки в форме');
        setLoading(false);
        return;
      }

      await onRateInput(store);
      modalSetVisible('ratePublish', false);
      setLoading(false);
    },
    [orderIsActive, onRateInput, republishing],
  );

  const onBargain = React.useCallback(
    async (store) => {
      setLoading(true);
      const { hasError } = store.getValidateData({
        onlyFields: ORDER_BARGAIN_PUBLISH_FIELDS,
      });

      if (hasError && !orderIsActive) {
        Ant.message.error('Исправьте ошибки в форме');
        setLoading(false);
        return;
      }

      await onBargainInput(store);
      modalSetVisible('bargainPublish', false);
      setLoading(false);
    },
    [orderIsActive, onBargainInput, republishing],
  );

  const onTariff = React.useCallback(
    async (store) => {
      setLoading(true);
      const { hasError } = store.getValidateData({
        onlyFields: ORDER_TARIFF_PUBLISH_FIELDS,
      });

      if (hasError && !orderIsActive) {
        Ant.message.error('Исправьте ошибки в форме');
        setLoading(false);
        return;
      }

      await onTariffInput(store);
      modalSetVisible('tariffPublish', false);
      setLoading(false);
    },
    [orderIsActive, onTariffInput, republishing],
  );

  const previewCalc = useCallback(async () => {
    if (!lazyDataInput) return null;
    const response = await OrderService.previewCalculate(lazyDataInput.id);
    const responseHash = Order.Utils.getCalculationHash(Order.Utils.fixCalculate(response));

    return {
      min: responseHash?.minCost?.value,
      max: responseHash?.maxCost?.value,
      value: response,
      hash: responseHash,
    };
  }, [lazyDataInput]);

  const calcFetch = useOrderCityIntercityCalc();

  const { contours } = user;

  const staticData = React.useMemo(
    () => ({
      ...staticDataInput,
      contours,
      transportOrderMaxWorkingDays:
        orderType === 'city '
          ? Order.Constants.ORDER_CITY_MAX_WORKING_DAYS
          : Order.Constants.ORDER_INTERCITY_MAX_WORKING_DAYS,
      orderType: staticData?.type ? staticData?.type : orderType === 'city' ? 1 : 3,
    }),
    [contours, staticDataInput, orderType],
  );

  const lazyData = React.useMemo(
    () => ({
      ...{
        requiredDocumentsCategories: Order.Utils.getOrderDocumentsRequired(dictionaries?.orderDocumentCategories)[
          'city'
        ].values,
      },
      ...lazyDataInput,
      orderType: orderType === 'city' ? 1 : 3,
    }),
    [lazyDataInput, dictionaries?.orderDocumentCategories, orderType],
  );

  const classNameSaveModal = useMemo(() => {
    return {
      'ant-modal--empty-cargo-place': cargoPlaceAccounting && isEmptyCargoPlace,
    };
  }, [cargoPlaceAccounting, isEmptyCargoPlace]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await Utils.fetchAllEmployees();
      setEmployees(response);
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, []);

  React.useEffect(() => {
    fetchCargoPlaceAccounting();
    fetchEmployees();
  }, []);

  const formChildren = useMemo(() => {
    return (
      <>
        {!orderIsActive &&
          (!republishing ? (
            <Order.Calculate
              calculationFields={APP === 'client' ? CALCULATION_FIELDS : CALCULATION_FIELDS_DISPATCHER}
              fetch={calcFetch}
            />
          ) : (
            <Order.CalculateRepublish fetch={previewCalc} />
          ))}

        <Order.Agreement />

        <Modal
          title={'Публикация рейса по фиксированной ставке'}
          subtitle={
            republishing
              ?
              <span style={{ 'fontWeight': 'bold' }}>
                Будет доступна подрядчикам только при наличии действующего Договора
              </span>
              :
              'Будет доступна подрядчикам только при наличии действующего Договора'
          }
          width={700}
          className={cn(classNameSaveModal)}
          maskClosable={false}
          visible={modalIsVisible('ratePublish')}
          centered={false}
          onCancel={modalGetToggleFunc('ratePublish')}
          destroyOnClose={true}
          footer={null}
        >
          <OrderRatePublishForm
            loading={loading}
            disabledFields={disabledFields}
            edit={!disabledFields.includes('responsibleEmployees')}
            regular={regular}
            employees={employees}
            inn={user.inn}
            republishing={republishing}
            producers={lazyData?.producers}
            cargoTypes={cargoTypes}
            onCancel={modalGetToggleFunc('ratePublish')}
            onSubmit={onRate}
          />
        </Modal>

        <Modal
          title={'Публикация рейса по утвержденному тарифу'}
          subtitle={
            republishing
              ?
              <span style={{ 'fontWeight': 'bold' }}>
                Будет доступна подрядчикам только при наличии действующего Договора или ДС с прикрепленным тарифом
              </span>
              :
              'Будет доступна подрядчикам только при наличии действующего Договора или ДС с прикрепленным тарифом'
          }
          width={700}
          className={cn(classNameSaveModal)}
          maskClosable={false}
          visible={modalIsVisible('tariffPublish')}
          centered={false}
          onCancel={modalGetToggleFunc('tariffPublish')}
          destroyOnClose={true}
          footer={null}
        >
          <OrderTariffPublishForm
            loading={loading}
            disabledFields={disabledFields}
            edit={!disabledFields.includes('responsibleEmployees')}
            inn={user.inn}
            republishing={republishing}
            regular={regular}
            employees={employees}
            cargoTypes={cargoTypes}
            onCancel={modalGetToggleFunc('tariffPublish')}
            onSubmit={onTariff}
          />
        </Modal>

        <Modal
          title={'Публикация рейса в торги'}
          subtitle={
            republishing
              ?
              <span style={{ 'fontWeight': 'bold' }}>
                Будет доступна подрядчикам только при наличии действующего Договора
              </span>
              :
              'Будет доступна подрядчикам только при наличии действующего Договора'
          }
          width={700}
          className={cn(classNameSaveModal)}
          maskClosable={false}
          visible={modalIsVisible('bargainPublish')}
          centered={false}
          onCancel={modalGetToggleFunc('bargainPublish')}
          destroyOnClose={true}
          footer={null}
        >
          <OrderBargainPublishForm
            loading={loading}
            disabledFields={disabledFields}
            edit={!disabledFields.includes('responsibleEmployees')}
            regular={regular}
            inn={user.inn}
            republishing={republishing}
            employees={employees}
            producers={lazyData?.producers}
            onCancel={modalGetToggleFunc('bargainPublish')}
            onSubmit={onBargain}
          />
        </Modal>
      </>
    );
  }, [
    loading,
    disabledFields,
    regular,
    lazyData,
    employees,
    classNameSaveModal,
    cargoTypes,
    modalGetToggleFunc,
    modalIsVisible,
  ]);

  return (
    <WhiteBoxDeprecated className={'extra-wide order-editor order-editor-city margin-top-24'}>
      <WhiteBoxHeaderDeprecated
        icon={<IconDeprecated name={orderType === 'city' ? 'orderTypeDeliveryOrange' : 'truckIntercityOrangeNf'} />}
        addon={additional}
      >
        {title || 'Новый городской рейс'}
      </WhiteBoxHeaderDeprecated>

      <CargoPlaceAccountingContext.Provider value={cargoPlaceAccounting}>
        {
          <Order.TransportForm
            onChange={onChange}
            dictionaries={dictionaries}
            validators={Order.Validators.validateOrderCity(regular)}
            loading={loadingInput}
            observer={observer}
            history={history}
            onBargain={onBargainInput ? onPreSave : undefined}
            onRate={onRateInput ? onPreSave : undefined}
            onTariff={onTariffInput ? onPreSave : undefined}
            orderIsActive={orderIsActive}
            onActiveSave={onActiveSave}
            onCancel={onCancel}
            saving={saving || savingInput}
            lazyData={lazyData}
            staticData={staticData}
            disabledFields={disabledFields}
            saveButtonText={saveButtonText}
            regular={regular}
            arriveAt={arriveAt}
            employees={employees}
            cargoPlaceAccounting={cargoPlaceAccounting}
            edit={edit}
            republishing={republishing}
          >
            {formChildren}
          </Order.TransportForm>
        }
      </CargoPlaceAccountingContext.Provider>
    </WhiteBoxDeprecated>
  );
}

const mapStateToProps = (state) => {
  let { dictionaries = {}, user } = state;
  return {
    dictionaries,
    user,
  };
};

export default connect(mapStateToProps)(OrderEditor);
