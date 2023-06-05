import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Ant,
  IconDeprecated,
  Modal,
  WhiteBoxDeprecated,
  WhiteBoxHeaderDeprecated,
  showError,
} from '@vezubr/elements';
import * as Order from '../../../..';
import Utils from '@vezubr/common/common/utils';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import useModalGroup from '@vezubr/common/hooks/useModalGroup';
import {
  CALCULATION_LOADER_FIELDS,
  CALCULATION_LOADER_FIELDS_DISPATCHER,
  ORDER_BARGAIN_PUBLISH_FIELDS,
  ORDER_RATE_PUBLISH_FIELDS,
  ORDER_TARIFF_PUBLISH_FIELDS,
} from '../../../constants';
import { Orders as OrderService, Loaders as LoadersService, Profile as ProfileService } from '@vezubr/services';
import OrderBargainPublishForm from '../../forms/order-bargain-publish-form';
import OrderRatePublishForm from '../../forms/order-rate-publish-form';
import OrderTariffPublishForm from '../../forms/order-tariff-publish-form';
import useOrderLoaderCalc from '../../../hooks/useOrderLoaderCalc';

import _uniq from 'lodash/uniq';
function OrderEditorLoader(props) {
  const {
    dictionaries: dictionariesInput,
    balance,
    actions,
    user,
    observer,
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
    republishing = false,
    orderIsActive = false,
  } = props;

  const dictionaries = useConvertDictionaries({ dictionaries: dictionariesInput });
  const { cargoTypes } = dictionaries;
  const { modalIsVisible, modalToggle, modalSetVisible, modalGetToggleFunc } = useModalGroup();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [employees, setEmployees] = useState([]);

  const calcFetch = useOrderLoaderCalc();

  const { contours } = user;

  const staticData = useMemo(
    () => ({
      ...staticDataInput,
      contours,
      transportOrderMaxWorkingDays: Order.Constants.ORDER_LOADER_MAX_WORKING_DAYS,
    }),
    [contours, staticDataInput],
  );

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await Utils.fetchAllEmployees();
      setEmployees(response);
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onPreSave = useCallback(
    async (store, data) => {
      const { values, hasError } = store.getValidateData({
        excludeFields: _uniq([
          ...ORDER_RATE_PUBLISH_FIELDS,
          ...ORDER_TARIFF_PUBLISH_FIELDS,
          ...ORDER_BARGAIN_PUBLISH_FIELDS,
        ]),
      });

      if (hasError && !republishing && !orderIsActive) {
        await Utils.setDelay(300);
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      const {
        calculation: { status: calcStatus, error: calcError },
      } = store.data;

      if (calcStatus !== 'calculated' && !republishing && !orderIsActive) {
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

  const onRate = useCallback(
    async (store) => {
      const { hasError } = store.getValidateData({
        onlyFields: ORDER_RATE_PUBLISH_FIELDS,
      });

      if (hasError && !orderIsActive) {
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      onRateInput(store);
      modalSetVisible('ratePublish', false);
    },
    [orderIsActive, onRateInput],
  );

  const onBargain = useCallback(
    async (store) => {
      const { hasError } = store.getValidateData({
        onlyFields: ORDER_BARGAIN_PUBLISH_FIELDS,
      });

      if (hasError && !orderIsActive) {
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      onBargainInput(store);
      modalSetVisible('bargainPublish', false);
    },
    [orderIsActive, onBargainInput],
  );

  const onTariff = useCallback(
    async (store) => {
      const { hasError } = store.getValidateData({
        onlyFields: ORDER_TARIFF_PUBLISH_FIELDS,
      });

      if (hasError && !orderIsActive) {
        Ant.message.error('Исправьте ошибки в форме');
        return;
      }

      onTariffInput(store);
      modalSetVisible('tariffPublish', false);
    },
    [orderIsActive, onTariffInput],
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

  return (
    <WhiteBoxDeprecated className={'extra-wide order-editor order-editor-loader margin-top-24'}>
      <WhiteBoxHeaderDeprecated icon={<IconDeprecated name={'orderTypeLoad'} />}>
        {title || 'Новый заказ ПРР'}
      </WhiteBoxHeaderDeprecated>

      <Order.LoaderForm
        onChange={onChange}
        dictionaries={dictionaries}
        validators={Order.Validators.validateOrderLoader(false)}
        loading={loadingInput}
        observer={observer}
        history={history}
        onBargain={onBargainInput ? onPreSave : undefined}
        onRate={onRateInput ? onPreSave : undefined}
        onTariff={onTariffInput ? onPreSave : undefined}
        onCancel={onCancel}
        saving={saving || savingInput}
        lazyData={lazyDataInput}
        staticData={staticData}
        saveButtonText={saveButtonText}
        disabledFields={disabledFields}
        orderIsActive={orderIsActive}
        republishing={republishing}
      >
        {!orderIsActive &&
          (!republishing ? (
            <Order.Calculate
              calculationFields={
                APP === 'dispatcher' ? CALCULATION_LOADER_FIELDS_DISPATCHER : CALCULATION_LOADER_FIELDS
              }
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
          // className={cn(classNameSaveModal)}
          maskClosable={false}
          visible={modalIsVisible('ratePublish')}
          centered={false}
          onCancel={modalGetToggleFunc('ratePublish')}
          destroyOnClose={true}
          footer={null}
        >
          <OrderRatePublishForm
            disabledFields={disabledFields}
            edit={!disabledFields.includes('responsibleEmployees')}
            employees={employees}
            producers={lazyDataInput?.producers}
            cargoTypes={cargoTypes}
            inn={user.inn}
            republishing={republishing}
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
          // className={cn(classNameSaveModal)}
          maskClosable={false}
          visible={modalIsVisible('tariffPublish')}
          centered={false}
          onCancel={modalGetToggleFunc('tariffPublish')}
          destroyOnClose={true}
          footer={null}
        >
          <OrderTariffPublishForm
            disabledFields={disabledFields}
            edit={!disabledFields.includes('responsibleEmployees')}
            employees={employees}
            cargoTypes={cargoTypes}
            republishing={republishing}
            onCancel={modalGetToggleFunc('tariffPublish')}
            onSubmit={onTariff}
            inn={user.inn}
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
          // className={cn(classNameSaveModal)}
          maskClosable={false}
          visible={modalIsVisible('bargainPublish')}
          centered={false}
          onCancel={modalGetToggleFunc('bargainPublish')}
          destroyOnClose={true}
          footer={null}
        >
          <OrderBargainPublishForm
            disabledFields={disabledFields}
            edit={!disabledFields.includes('responsibleEmployees')}
            employees={employees}
            inn={user.inn}
            republishing={republishing}
            producers={lazyDataInput?.producers}
            onCancel={modalGetToggleFunc('bargainPublish')}
            onSubmit={onBargain}
          />
        </Modal>
      </Order.LoaderForm>
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

export default connect(mapStateToProps)(OrderEditorLoader);
