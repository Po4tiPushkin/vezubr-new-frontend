import { VEHICLE_BODY_GROUPS, VEHICLE_BODY_GROUPS_BODY_TYPES } from '@vezubr/common/constants/constants';
import compose from '@vezubr/common/hoc/compose';
import t from '@vezubr/common/localization';
import { Ant, IconDeprecated, Loader, VzForm, WhiteBoxHeaderDeprecated, Comments } from '@vezubr/elements';
import { useObserver } from "mobx-react";
import { Contractor as ContractorService } from '@vezubr/services'
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import OrderAddressCargoPlace from '../../components/order-address-cargo-place';
import OrderAdvancedOptionsIntercity from '../../form-components/options/order-advanced-options-intercity';
import OrderCargoPlaces from '../../form-components/order-cargo-places';
import OrderRegularSettings from '../../form-components/order-regular-settings';
import OrderFieldAddresses from '../../form-fields/order-field-addresses';
import OrderFieldDate from '../../form-fields/order-field-date';
import OrderFieldNumber from '../../form-fields/order-field-number';
import OrderFieldSelectVehicleList from '../../form-fields/order-field-select-vehicle-list';
import OrderFieldSelect from '../../form-fields/order-field-select';
import OrderFieldSwitch from '../../form-fields/order-field-switch';
import OrderFieldTextarea from '../../form-fields/order-field-textarea';
import OrderFieldTime from '../../form-fields/order-field-time';
import OrderFieldTreeSelect from '../../form-fields/order-field-tree-select';
import withOrderStore from '../../hoc/withOrderStore';
import OrderDataIntercity from '../../store/OrderDataIntercity';
import {
  getBodyTypesTreeData,
  getOrderDocumentCategoriesTreeData,
  getOrderDocumentsRequired, isActiveUpdater
} from '../../utils';
import { validateAddressItem } from '../../validators';
import OrderFieldSelectCategoryChoice from '../../form-fields/order-field-category-choice';
import OrderCustomProperties from '../../form-components/order-custom-properties';



function OrderIntercityForm(props) {
  const {
    store,
    loading,
    processing,
    dictionaries,
    children,
    saveButtonText,
    disabledFields = [],
    onBargain,
    onCancel,
    onDefer,
    onRate,
    onTariff,
    regular = false,
    arriveAt = null,
    republishing,
    employees,
    cargoPlaceAccounting
  } = props;

  const {
    contourVehicleTypes,
    vehicleBodies,
    geozones: geozonesInput,
    orderDocumentCategories,
    cargoTypes,
    orderSettingPointChangeType
  } = dictionaries;

  const transportOrderMaxWorkingDays = useObserver(() => store.getDataItem('transportOrderMaxWorkingDays'))
  const bodyTypes = useObserver(() => store.getDataItem('bodyTypes'));
  const vehicleType = useObserver(() => store.getDataItem('vehicleType'));
  const orderCategory = useObserver(() => store.getDataItem('orderCategory'));
  const selectedClient = useObserver(() => store.getDataItem('client'));
  const user = useSelector((state) => state.user)

  const availableVehicleTypes = React.useMemo(() => {
    if (orderCategory) {
      return contourVehicleTypes.filter((item) => item.category == orderCategory)
    } else {
      return contourVehicleTypes
    }
  }, [orderCategory, contourVehicleTypes])

  React.useEffect(() => {
    if (!availableVehicleTypes.find((item) => item.id == vehicleType)) {
      store.setDataItem('vehicleType', null)
    }
  }, [availableVehicleTypes])

  const onTrackUpdated = React.useCallback(
    (polyLineObj) => {
      const { value, encoder } = polyLineObj || {};
      store.setDataItem('trackPolyline', value);
      store.setDataItem('trackEncoder', encoder);
    },
    [store],
  );

  const [buttonData, setButtonData] = React.useState({});

  const [clients, setClients] = React.useState([]);

  const fetchClientUsers = React.useCallback(async () => {
    try {
      const response = await ContractorService.clientList();
      const dataSource = response?.data || [];
      setClients(dataSource.filter(el => !!el.contours.find(contour => contour.managerContractorId === user.id)).map((item) => {
        return {
          label: item?.title || item?.inn,
          value: item?.id,
        }
      }));
    } catch (e) {
      console.error(e);
    }
  }, [])

  const disabledDate = React.useCallback((date) => {
    return date.isBefore(moment(), 'date') || date.isAfter(moment().add(transportOrderMaxWorkingDays, 'days'), 'date');
  }, []);

  useEffect(() => {
    if (!bodyTypes || !vehicleType || republishing || disabledFields.includes('vehicleType') || disabledFields.includes('bodyTypes')) {
      return;
    }
    store.setDataItem('bodyTypes', bodyTypes.filter(el => 
      dictionaries.vehicleTypesList.find(item => item.id === vehicleType)?.availableBodyTypes?.[el]
    ));
  }, [vehicleType]);

  useEffect(() => {
    if (!bodyTypes || !bodyTypes.length || !vehicleType) {
      store.setDataItem('disabledLoadingTypesByVehicleAndBody', []);
      return;
    }
    let disabledLoadingTypes = [];
    bodyTypes.forEach(el => {
      const { availableBodyTypes } = availableVehicleTypes?.find(elem => elem.id === +vehicleType) || {};
      if (!availableBodyTypes || Array.isArray(availableBodyTypes)) {
        return;
      }
      for (const item of dictionaries?.loadingTypes) {
        const { id } = item;
        if (!availableBodyTypes?.[el]?.[id]) {
          disabledLoadingTypes.push(id);
          continue;
        }
      }
    });
    store.setDataItem('disabledLoadingTypesByVehicleAndBody', disabledLoadingTypes);
  }, [vehicleType, bodyTypes, availableVehicleTypes]);

  const orderDocumentCategoriesRequired = useMemo(() => {
    const { intercity, international } = getOrderDocumentsRequired(orderDocumentCategories);
    return {
      intercity,
    };
  }, [orderDocumentCategories]);

  const orderDocumentCategoriesTreeData = useMemo(
    () => getOrderDocumentCategoriesTreeData(orderDocumentCategoriesRequired, orderDocumentCategories),
    [orderDocumentCategoriesRequired, orderDocumentCategories],
  );

  const geozones = React.useMemo(() => {
    const list = [
      {
        label: 'Не требуется',
        value: null,
      },
      {
        label: t.order('autoDetect'),
        value: 0,
      },
    ];

    for (const idGeozone of Object.keys(geozonesInput)) {
      list.push({
        label: geozonesInput[idGeozone],
        value: idGeozone,
      });
    }

    return list;
  }, [geozonesInput]);

  const handleProcess = React.useCallback(
    (e) => {
      const dataset = e.target.dataset;

      const { canceling, deferring, bargaining, tariffpublishing: tariffPublishing, ratepublishing: ratePublishing } = dataset;

      if (canceling) {
        onCancel(store, dataset);
      } else if (deferring) {
        onDefer(store, dataset);
      } else if (bargaining) {
        store.setDataItem('publishingType', 'bargain')
        onBargain(store, dataset);
      } else if (tariffPublishing) {
        store.setDataItem('publishingType', 'tariff')
        onTariff(store, dataset)
      } else if (ratePublishing) {
        store.setDataItem('publishingType', 'rate')
        onRate(store, dataset)
      }

      setButtonData(dataset);
    },
    [onCancel, onBargain, onDefer, onRate, onTariff],
  );

  const bodyTypesTreeData = React.useMemo(
    () => getBodyTypesTreeData(vehicleBodies, VEHICLE_BODY_GROUPS, VEHICLE_BODY_GROUPS_BODY_TYPES, vehicleType, availableVehicleTypes),
    [vehicleBodies, vehicleType, availableVehicleTypes],
  );

  const prepareAddressFromFavoriteFn = useCallback((address, index) => {
    const newAddress = {
      ...address,
      ...(index
        ? {
          isLoadingWork: false,
          isUnloadingWork: true,
        }
        : {
          isLoadingWork: true,
          isUnloadingWork: false,
        }),
    };

    delete newAddress.requiredArriveAt;
    return newAddress;
  }, []);

  const canMoveEditAddressPredicate = useCallback((address, position) => (
    !address?.completedAt &&
    !(isActiveUpdater(store.getDataItemNoComputed('status')) && position === 1) &&
    !disabledFields.includes('addresses')
  ), [store]);

  const { canceling, deferring, bargaining, ratepublishing, tariffpublishing } = buttonData;

  React.useEffect(() => {
    store.setDataItem('regular', regular)
  }, [regular])

  React.useEffect(() => {
    if (user.costWithVat) {
      store.setDataItem('vatRate', parseInt(user.vatRate))
    }
    if (APP == 'dispatcher') {
      fetchClientUsers();
    }
  }, []);

  return (
    <div className={'order-form order-intercity-form'}>
      {
        APP == 'dispatcher' ? (
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
                  label={'Грузовладелец'}
                  placeholder={'Выберите грузовладельца'}
                  disabled={disabledFields.includes('client')}
                />
              </VzForm.Col>
            </VzForm.Row>
          </VzForm.Group>
        ) : null
      }
      {regular ? (
        <OrderRegularSettings arriveAt={arriveAt} disabledFields={disabledFields} />
      ) : (
        null
      )}
      {!regular ? (
        <VzForm.Group title={'Дата и время подачи (в часовом поясе точки подачи)'}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <OrderFieldDate name={'toStartAtDate'} label={'Дата подачи'} disabledDate={disabledDate} disabled={disabledFields.includes('toStartAtDate')} />
            </VzForm.Col>

            <VzForm.Col span={12}>
              <OrderFieldTime name={'toStartAtTime'} label={'Время подачи'} disabled={disabledFields.includes('toStartAtTime')} />
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      ) : (
        null
      )}

      <VzForm.Group title={'Данные по транспортному средству'}>
        <VzForm.Row>
          <VzForm.Col span={6}>
            <OrderFieldSelectCategoryChoice name={'orderCategory'} label={'Тип автоперевозки'} disabled={disabledFields.includes('orderCategory')} />
          </VzForm.Col>
          <VzForm.Col span={6}>
            <OrderFieldSelectVehicleList name={'vehicleType'} label={'Тип ТС'} vehicleTypesList={availableVehicleTypes} disabled={disabledFields.includes('vehicleType') || !orderCategory} />
          </VzForm.Col>
          <VzForm.Col span={12}>
            <OrderFieldTreeSelect
              style={{ height: 34 }}
              name={'bodyTypes'}
              maxTagCount={3}
              treeNodeFilterProp={'title'}
              treeData={bodyTypesTreeData}
              allowClear={false}
              treeCheckable={true}
              showCheckedStrategy={Ant.TreeSelect.SHOW_CHILD}
              searchPlaceholder={'Выберите тип кузова'}
              placeholder={'Выберите тип кузова'}
              label={'Тип кузова'}
              disabled={disabledFields.includes('bodyTypes') || !orderCategory}
            />
          </VzForm.Col>
          {bodyTypes.find(el => el === 2) ?
            <>
              <VzForm.Col span={8}>
                <OrderFieldSwitch
                  name={'isThermograph'}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  label={'Наличие термописца в ТС'}
                  disabled={disabledFields.includes('isThermograph')}
                />
              </VzForm.Col>
              <VzForm.Col span={8}>
                <OrderFieldNumber
                  style={{ height: 34 }}
                  name={'vehicleTemperatureMin'}
                  label={'Тепература от, ℃'}
                  disabled={disabledFields.includes('vehicleTemperatureMin')}
                />
              </VzForm.Col>
              <VzForm.Col span={8}>
                <OrderFieldNumber
                  style={{ height: 34 }}
                  name={'vehicleTemperatureMax'}
                  label={'Тепература до, ℃'}
                  disabled={disabledFields.includes('vehicleTemperatureMax')}
                />
              </VzForm.Col>
            </> :
            <></>}
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group title={'Адреса'}>
        <OrderFieldAddresses
          name={'addresses'}
          prepareAddressFromFavoriteFn={prepareAddressFromFavoriteFn}
          onTrackUpdated={onTrackUpdated}
          useMap={true}
          useFavorite={APP == "dispatcher" ? !!selectedClient : true}
          client={selectedClient}
          canMovePredicateFn={canMoveEditAddressPredicate}
          canChangePredicateFn={canMoveEditAddressPredicate}
          validatorAddressItem={validateAddressItem}
          extraFieldComponent={OrderAddressCargoPlace}
          disabled={disabledFields.includes('addresses')}
        />
      </VzForm.Group>

      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <OrderFieldSelect
              label={'Изменение и пропуск точек маршрута водителем'}
              name={'pointChangeType'}
              list={{
                array: orderSettingPointChangeType,
                labelKey: 'title',
                valueKey: 'id'
              }}
              disabled={disabledFields.includes('advancedOptions')}
              allowClear={false}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <OrderFieldTreeSelect
              name={'requiredDocumentsCategories'}
              treeNodeFilterProp={'title'}
              dropdownStyle={{
                height: 200,
              }}
              treeData={orderDocumentCategoriesTreeData}
              allowClear={false}
              treeCheckable={true}
              showCheckedStrategy={Ant.TreeSelect.SHOW_CHILD}
              searchPlaceholder={'Выберите требуемые документы'}
              placeholder={'Выберите требуемые документы'}
              label={'Требуемые документы'}
              disabled={disabledFields.includes('requiredDocumentsCategories')}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group>
        <OrderAdvancedOptionsIntercity cargoTypes={cargoTypes} disabled={disabledFields.includes('advancedOptions')} geozones={geozones} />
      </VzForm.Group>

      <VzForm.Group>
        <OrderCustomProperties 
          name={'customProperties'} 
          wrapped={false} 
          disabled={disabledFields.includes('customProperties')} 
        />
      </VzForm.Group>


      {cargoPlaceAccounting && (
        <VzForm.Group>
          <OrderCargoPlaces
            cargoPlaceStatuses={dictionaries?.cargoPlaceStatuses}
            fieldNameStore={'cargoPlacesStore'}
            fieldNameAddresses={'addresses'}
            fieldNameValue={'cargoPlaces'}
            fieldNameAll={'cargoPlacesAll'}
            fieldNameAddressIn={'departurePointPosition'}
            fieldNameAddressOut={'arrivalPointPosition'}
            disabled={disabledFields.includes('cargoPlaces')}
          />
        </VzForm.Group>
      )
      }

      <VzForm.Group title={'Дополнительно'}>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <OrderFieldTextarea
              label={'Комментарий'}
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
          <div style={{ 'textAlign': 'left' }}>
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

      <WhiteBoxHeaderDeprecated icon={<IconDeprecated name={'ordersDocuments2'} />}>
        {'Опубликовать рейс'}
      </WhiteBoxHeaderDeprecated>
      <VzForm.Actions className={'order-form__actions'}>
        {onCancel && (
          <Ant.Button
            type={'ghost'}
            onClick={handleProcess}
            data-canceling={'true'}
            loading={processing && !!canceling}
          >
            {t.order('cancel')}
          </Ant.Button>
        )}

        {onDefer && (
          <Ant.Button
            onClick={handleProcess}
            type={'default'}
            data-deferring={'true'}
            loading={processing && !!deferring}
          >
            Сохранить в отложенные
          </Ant.Button>
        )}

        {onBargain && (
          <Ant.Button
            onClick={handleProcess}
            type={'primary'}
            data-bargaining={'true'}
            loading={processing && !!bargaining}
          >
            {saveButtonText ? saveButtonText : 'В торги'}
          </Ant.Button>
        )}

        {onRate && (
          <Ant.Button
            onClick={handleProcess}
            data-ratepublishing={'true'}
            type={'primary'}
            loading={processing && !!ratepublishing}
          >
            {saveButtonText ? saveButtonText : 'По ставке'}
          </Ant.Button>
        )}

        {onTariff && (
          <Ant.Button
            onClick={handleProcess}
            data-tariffpublishing={'true'}
            type={'primary'}
            loading={processing && !!tariffpublishing}
          >
            {saveButtonText ? saveButtonText : 'По тарифу'}
          </Ant.Button>
        )}
      </VzForm.Actions>

      {(loading || processing) && <Loader />}
    </div>
  );
}

OrderIntercityForm.propTypes = {
  dictionaries: PropTypes.object.isRequired,
  validators: PropTypes.object,
  processing: PropTypes.bool,
  saveButtonText: PropTypes.string,
  disabledFields: PropTypes.arrayOf(PropTypes.string),
  republishing: PropTypes.bool,
  regular: PropTypes.bool,

  onCancel: PropTypes.func,
  onBargain: PropTypes.func,
  onDefer: PropTypes.func,
  onTariff: PropTypes.func,
  onRate: PropTypes.func,
};

OrderIntercityForm.defaultProps = {
  disabledFields: []
};

export default compose([withOrderStore(OrderDataIntercity)])(OrderIntercityForm);
