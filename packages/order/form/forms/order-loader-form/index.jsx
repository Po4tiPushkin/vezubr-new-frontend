import compose from '@vezubr/common/hoc/compose';
import t from '@vezubr/common/localization';
import { Ant, Loader, VzForm, Comments } from '@vezubr/elements';
import { useObserver } from 'mobx-react';
import moment from 'moment';
import { Contractor as ContractorService } from '@vezubr/services';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import OrderFieldAddresses from '../../form-fields/order-field-addresses';
import OrderFieldDate from '../../form-fields/order-field-date';
import OrderFieldCurrency from '../../form-fields/order-field-currency';
import OrderFieldTextarea from '../../form-fields/order-field-textarea';
import OrderFieldSelect from '../../form-fields/order-field-select';
import OrderFieldTime from '../../form-fields/order-field-time';
import withOrderStore from '../../hoc/withOrderStore';
import OrderDataLoader from '../../store/OrderDataLoader';
import { isActiveUpdater, getProducersForOrder, getOrderDataSave } from '../../utils';
import validateAddressItem from '../../validators/validateAddressItem';
import OrderCustomProperties from '../../form-components/order-custom-properties';
import OrderFieldText from '../../form-fields/order-field-text';
import { OrderSpecialities } from '../../form-components';
import { prohibitedGoods } from '../../short-info';

function OrderLoaderForm(props) {
  const {
    saving,
    store,
    loading,
    orderIsActive,
    onCancel,
    onTariff,
    onRate,
    onBargain,
    onDefer,
    children,
    saveButtonText,
    disabledFields = [],
    republishing
  } = props;

  const user = useSelector((state) => state.user);
  const dictionaries = useSelector((state) => state.dictionaries);
  const addresses = useObserver(() => store.getDataItem('addresses'));
  const selectedClient = useObserver(() => store.getDataItem('client'));
  const requiredLoadersArray = useObserver(() => store.getDataItem('requiredLoadersArray'));
  const [buttonData, setButtonData] = useState({});

  const [clients, setClients] = React.useState([]);

  const fetchClientUsers = React.useCallback(async () => {
    try {
      const response = await ContractorService.clientList();
      const dataSource = response?.data || [];
      setClients(
        dataSource
          .filter((el) => !!el.contours.find((contour) => contour.managerContractorId === user.id))
          .map((item) => {
            return {
              label: item?.title || item?.inn,
              value: item?.id,
            };
          }),
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  const prepareAddressFromFavoriteFn = useCallback((address) => {
    const newAddress = {
      ...address,
    };

    delete newAddress.requiredArriveAt;
    return newAddress;
  }, []);

  const canMoveEditAddressPredicate = useCallback(
    (address, position) =>
      !address?.completedAt &&
      !(isActiveUpdater(store.getDataItemNoComputed('status')) && position === 1) &&
      !disabledFields.includes('addresses'),
    [store],
  );

  const disabledDate = useCallback((date) => {
    return date.isBefore(moment(), 'date') || date.isAfter(moment().add(1, 'month'), 'date');
  }, []);

  React.useEffect(() => {
    const fetchProds = async () => {
      const { orderType, vehicleType } = getOrderDataSave({ ...store.data, addresses });

      if (orderIsActive && addresses.length > 0) {
        const producers = await getProducersForOrder(orderType, addresses, vehicleType);
        store.setDataItem('producers', producers);
      }
    };
    fetchProds();
  }, [addresses, orderIsActive]);

  useEffect(() => {
    if (user.costWithVat) {
      store.setDataItem('vatRate', parseInt(user.vatRate));
    }
  }, []);

  useEffect(() => {
    store.setDataItem('republishing', republishing);
  }, [republishing]);

  useEffect(() => {
    if (user.costWithVat) {
      store.setDataItem('vatRate', parseInt(user.vatRate));
    }
    if (APP == 'dispatcher') {
      fetchClientUsers();
    }
  }, []);

  const handleProcess = React.useCallback(
    (e) => {
      const dataset = e.target.dataset;

      const {
        canceling,
        deferring,
        bargaining,
        tariffpublishing: tariffPublishing,
        ratepublishing: ratePublishing,
      } = dataset;

      if (canceling) {
        onCancel(store, dataset);
      } else if (deferring) {
        onDefer(store, dataset);
      } else if (bargaining) {
        store.setDataItem('publishingType', 'bargain');
        onBargain(store, dataset);
      } else if (tariffPublishing) {
        store.setDataItem('publishingType', 'tariff');
        onTariff(store, dataset);
      } else if (ratePublishing) {
        store.setDataItem('publishingType', 'rate');
        onRate(store, dataset);
      }

      setButtonData(dataset);
    },
    [onCancel, onBargain, onDefer, onRate, onTariff],
  );

  const { canceling, deferring, bargaining, ratepublishing, tariffpublishing } = buttonData;
  return (
    <div className={'order-form order-loader-form'}>
      {APP == 'dispatcher' ? (
        <VzForm.Group>
          <VzForm.Row>
            <VzForm.Col span={24}>
              <OrderFieldSelect
                name={'client'}
                list={{
                  array: clients,
                  labelKey: 'label',
                  valueKey: 'value',
                }}
                allowClear={false}
                id={'order-clients'}
                optionId={'order-client'}
                label={'Грузовладелец'}
                placeholder={'Выберите грузовладельца'}
                disabled={disabledFields.includes('client')}
              />
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      ) : null}
      <VzForm.Group title={'Общие сведения'}>
        <VzForm.Row wrap={true}>
          <VzForm.Col span={12}>
            <OrderFieldDate
              name={'toStartAtDate'}
              disabled={disabledFields.includes('toStartAtDate')}
              disabledDate={disabledDate}
              label={'Дата подачи'}
              id={'order-tostartatdate'}
            />
          </VzForm.Col>

          <VzForm.Col span={12}>
            <OrderFieldTime
              name={'toStartAtTime'}
              label={'Время подачи'}
              disabled={disabledFields.includes('toStartAtTime')}
              id={'order-tostartattime'}
            />
          </VzForm.Col>

          <OrderSpecialities
            loaderSpecialities={dictionaries.loaderSpecialities}
            specs={requiredLoadersArray}
            setSpecs={(requiredLoaderSpecialities) =>
              store.setDataItem('requiredLoaderSpecialities', requiredLoaderSpecialities)
            }
            disabled={disabledFields.includes('requiredLoaderSpecialities')}
            loaderErrors={store.getError('requiredLoaderSpecialities')}
          />

          <VzForm.Col span={24}>
            <OrderFieldAddresses
              name={'addresses'}
              prepareAddressFromFavoriteFn={prepareAddressFromFavoriteFn}
              useMap={true}
              useFavorite={APP == 'dispatcher' ? !!selectedClient : true}
              client={selectedClient}
              canMovePredicateFn={canMoveEditAddressPredicate}
              canChangePredicateFn={canMoveEditAddressPredicate}
              max={1}
              validatorAddressItem={validateAddressItem}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group>
        <Ant.Collapse className={'order-advanced-options'}>
          <Ant.Collapse.Panel id="order-advanced-options" header="Показать дополнительные параметры" key="0">
            <VzForm.Row>
              <VzForm.Col span={6}>
                <OrderFieldText
                  label={'Идентификатор рейса'}
                  name={'clientNumber'}
                  disabled={disabledFields.includes('advancedOptions')}
                  id={'order-clientnumber'}
                />
              </VzForm.Col>
              <VzForm.Col span={6}>
                <OrderFieldCurrency
                  label={t.order('assessedCargoValue')}
                  placeholder={'Ввести стоимость'}
                  min={0}
                  step={500}
                  name={'assessedCargoValue'}
                  disabled={disabledFields.includes('assessedCargoValue')}
                  id={'order-assessedcargovalue'}
                />
              </VzForm.Col>
              <VzForm.Col span={6}>
                <OrderFieldSelect
                  name={'cargoCategoryId'}
                  shortInfo={prohibitedGoods}
                  list={{
                    array: dictionaries.cargoTypes,
                    labelKey: 'title',
                    valueKey: 'id'
                  }}
                  label={'Категория груза'}
                  searchPlaceholder={'Введите категорию груза для поиска'}
                  placeholder={'Выберите категорию груза'}
                  disabled={disabledFields.includes('cargoCategoryId')}
                  id={'order-cargocategoryids'}
                  optionId={'order-cargocategoryid'}
                />
              </VzForm.Col>
            </VzForm.Row>
          </Ant.Collapse.Panel>
        </Ant.Collapse>
      </VzForm.Group>

      <OrderCustomProperties
        name={'customProperties'}
        wrapped={false}
        disabled={disabledFields.includes('customProperties')}
      />

      <VzForm.Group title={'Дополнительно'}>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <OrderFieldTextarea
              label={'Публичный комментарий'}
              name={'comment'}
              autoSize={{
                minRows: 3,
                maxRows: 10,
              }}
              disabled={disabledFields.includes('comment')}
            />
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <div style={{ textAlign: 'left' }}>
            <div>Внутренние комментарии:</div>
            {<Comments comments={store.getDataItem('innerComments')} />}
          </div>
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <OrderFieldTextarea
              label={'Внутренний Комментарий'}
              name={'innerComment'}
              autoSize={{
                minRows: 3,
                maxRows: 10,
              }}
              disabled={disabledFields.includes('innerComment')}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      {children}

      <VzForm.Actions className={'order-form__actions'}>
        {onCancel && (
          <Ant.Button type={'ghost'} onClick={handleProcess} data-canceling={'true'} loading={loading && !!canceling}>
            {t.order('cancel')}
          </Ant.Button>
        )}

        {onDefer && (
          <Ant.Button onClick={handleProcess} type={'default'} data-deferring={'true'} loading={loading && !!deferring}>
            Сохранить в отложенные
          </Ant.Button>
        )}

        {onBargain && (
          <Ant.Button
            onClick={handleProcess}
            type={'primary'}
            data-bargaining={'true'}
            loading={loading && !!bargaining}
          >
            {saveButtonText ? saveButtonText : 'В торги'}
          </Ant.Button>
        )}

        {onRate && (
          <Ant.Button
            onClick={handleProcess}
            data-ratepublishing={'true'}
            type={'primary'}
            loading={loading && !!ratepublishing}
          >
            {saveButtonText ? saveButtonText : 'По ставке'}
          </Ant.Button>
        )}

        {onTariff && (
          <Ant.Button
            onClick={handleProcess}
            data-tariffpublishing={'true'}
            type={'primary'}
            loading={loading && !!tariffpublishing}
          >
            {saveButtonText ? saveButtonText : 'По тарифу'}
          </Ant.Button>
        )}
      </VzForm.Actions>

      {(loading || saving) && <Loader />}
    </div>
  );
}

OrderLoaderForm.propTypes = {
  dictionaries: PropTypes.object.isRequired,
  validators: PropTypes.object,
  saving: PropTypes.bool,
  deferring: PropTypes.bool,
  canceling: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onDefer: PropTypes.func,
  saveButtonText: PropTypes.string,
  history: PropTypes.object.isRequired,
};

export default compose([withOrderStore(OrderDataLoader)])(OrderLoaderForm);
