import { VEHICLE_BODY_GROUPS, VEHICLE_BODY_GROUPS_BODY_TYPES } from '@vezubr/common/constants/constants';
import compose from '@vezubr/common/hoc/compose';
import t from '@vezubr/common/localization';
import {
  Ant,
  IconDeprecated,
  Loader,
  VzForm,
  WhiteBoxHeaderDeprecated,
  Comments,
} from '@vezubr/elements';
import { useObserver } from 'mobx-react';
import { Contractor as ContractorService, Orders as OrderService } from '@vezubr/services';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import OrderAddressCargoPlace from '../../components/order-address-cargo-place';
import OrderAdvancedOptionsTransport from '../../form-components/options/order-advanced-options-transport';
import OrderAdvancedRequirementsTransport from '../../form-components/options/order-advanced-requirements-transport';
import OrderCargoPlaces from '../../form-components/order-cargo-places';
import OrderRegularSettings from '../../form-components/order-regular-settings';
import OrderFieldAddresses from '../../form-fields/order-field-addresses';
import OrderFieldDate from '../../form-fields/order-field-date';
import OrderFieldNumber from '../../form-fields/order-field-number';
import OrderFieldSelectVehicleList from '../../form-fields/order-field-select-vehicle-list';
import OrderFieldSwitch from '../../form-fields/order-field-switch';
import OrderFieldTextarea from '../../form-fields/order-field-textarea';
import OrderFieldTime from '../../form-fields/order-field-time';
import OrderFieldSelect from '../../form-fields/order-field-select';
import OrderFieldTreeSelect from '../../form-fields/order-field-tree-select';
import withOrderStore from '../../hoc/withOrderStore';
import OrderDataTransport from '../../store/OrderDataTransport';
import {
  getBodyTypesTreeData,
  getOrderDataSave,
  getOrderDocumentCategoriesTreeData,
  getOrderDocumentsRequired,
  getProducersForOrder,
  isActiveUpdater,
} from '../../utils';
import { validateAddressItem } from '../../validators';
import OrderFieldSelectCategoryChoice from '../../form-fields/order-field-category-choice';
import OrderCustomProperties from '../../form-components/order-custom-properties';

function OrderTransportForm(props) {
  const {
    saving,
    store,
    loading,
    dictionaries,
    children,
    disabledFields = [],
    regular = false,
    saveButtonText,
    onCancel,
    onDefer,
    onTariff,
    onRate,
    onBargain,
    arriveAt,
    orderIsActive,
    republishing,
    cargoPlaceAccounting,
  } = props;

  const {
    contourVehicleTypes,
    vehicleBodies,
    geozones: geozonesInput,
    orderDocumentCategories,
  } = dictionaries;

  const bodyTypes = useObserver(() => store.getDataItem('bodyTypes'));
  const vehicleType = useObserver(() => store.getDataItem('vehicleType'));
  const selectedClient = useObserver(() => store.getDataItem('client'));
  const orderCategory = useObserver(() => store.getDataItem('orderCategory'));
  const addresses = useObserver(() => store.getDataItem('addresses'));
  const user = useSelector((state) => state.user);
  const [buttonData, setButtonData] = React.useState({});
  const [clients, setClients] = React.useState([]);

  const availableVehicleTypes = React.useMemo(() => {
    if (orderCategory) {
      return contourVehicleTypes.filter((item) => item.category == orderCategory);
    } else {
      return contourVehicleTypes;
    }
  }, [orderCategory, contourVehicleTypes]);

  React.useEffect(() => {
    if (!availableVehicleTypes.find((item) => item.id == vehicleType)) {
      store.setDataItem('vehicleType', null);
    }
  }, [availableVehicleTypes]);

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

  const orderDocumentCategoriesTreeData = useMemo(() => {
    const { city } = getOrderDocumentsRequired(orderDocumentCategories);
    return getOrderDocumentCategoriesTreeData(
      {
        city,
      },
      orderDocumentCategories,
    );
  }, [orderDocumentCategories]);

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

  const onTrackUpdated = React.useCallback(
    (polyLineObj) => {
      const { value, encoder } = polyLineObj || {};
      store.setDataItem('trackPolyline', value);
      store.setDataItem('trackEncoder', encoder);
    },
    [store],
  );

  const disabledDate = React.useCallback((date) => {
    return date.isBefore(moment(), 'date') || date.isAfter(moment().add(1, 'month'), 'date');
  }, []);

  useEffect(() => {
    if (
      !bodyTypes ||
      !vehicleType ||
      republishing ||
      disabledFields.includes('vehicleType') ||
      disabledFields.includes('bodyTypes')
    ) {
      return;
    }
    store.setDataItem(
      'bodyTypes',
      bodyTypes.filter(
        (el) => dictionaries.vehicleTypesList.find((item) => item.id === vehicleType)?.availableBodyTypes?.[el],
      ),
    );
  }, [vehicleType]);

  useEffect(() => {
    if (!bodyTypes || !bodyTypes.length || !vehicleType) {
      store.setDataItem('disabledLoadingTypesByVehicleAndBody', []);
      return;
    }
    let disabledLoadingTypes = [];
    bodyTypes.forEach((el) => {
      const { availableBodyTypes } = availableVehicleTypes?.find((elem) => elem.id === +vehicleType) || {};
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

  React.useEffect(() => {
    if (vehicleType) {
      const { availableBodyTypes } = dictionaries.vehicleTypesList.find((item) => item.id === vehicleType);
      if (Object.keys(availableBodyTypes).length == 1) {
        store.setDataItem('bodyTypes', Object.keys(availableBodyTypes));
      }
    } else {
      store.setDataItem('bodyTypes', []);
    }
  }, [vehicleType]);

  const bodyTypesTreeData = React.useMemo(
    () =>
      getBodyTypesTreeData(
        vehicleBodies,
        VEHICLE_BODY_GROUPS,
        VEHICLE_BODY_GROUPS_BODY_TYPES,
        vehicleType,
        availableVehicleTypes,
      ),
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

  const canMoveEditAddressPredicate = useCallback(
    (address, position) =>
      !address?.completedAt &&
      !(isActiveUpdater(store.getDataItemNoComputed('status')) && position === 1) &&
      !disabledFields.includes('addresses'),
    [store],
  );

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

  React.useEffect(() => {
    store.setDataItem('regular', regular);
  }, [regular]);

  useEffect(() => {
    store.setDataItem('republishing', republishing);
  }, [republishing]);

  React.useEffect(() => {
    if (user.costWithVat) {
      store.setDataItem('vatRate', parseInt(user.vatRate));
    }
    if (APP == 'dispatcher') {
      fetchClientUsers();
    }
  }, []);

  return (
    <div className={'order-form order-city-form'}>
      <VzForm.Group>
        <VzForm.Row>
          {regular && (
            <VzForm.Col span={APP === 'dispatcher' ? 6 : 12}>
              <OrderFieldSelect
                name={'orderType'}
                list={{
                  array: [
                    {
                      label: "Городской",
                      value: 1,
                    },
                    {
                      label: "Междугородний",
                      value: 3,
                    },
                  ],
                  labelKey: 'label',
                  valueKey: 'value',
                }}
                allowClear={false}
                label={'Тип рейса'}
                id={'order-ordertype'}
                optionId={'order-ordertypeoption'}
                placeholder={'Тип рейса'}
                disabled={disabledFields.includes('orderType')}
              />
            </VzForm.Col>
          )}
          {APP == 'dispatcher' ? (
            <VzForm.Col span={regular ? 18 : 24}>
              <OrderFieldSelect
                name={'client'}
                list={{
                  array: clients,
                  labelKey: 'label',
                  valueKey: 'value',
                }}
                allowClear={false}
                label={'Грузовладелец'}
                id={'order-clients'}
                optionId={'order-client'}
                placeholder={'Выберите грузовладельца'}
                disabled={disabledFields.includes('client')}
              />
            </VzForm.Col>
          ) : null}
        </VzForm.Row>
      </VzForm.Group>
      {regular ? <OrderRegularSettings arriveAt={arriveAt} disabledFields={disabledFields} /> : null}
      {!regular ? (
        <VzForm.Group title={'Дата и время подачи'}>
          <VzForm.Row wrap={true}>
            <VzForm.Col span={12}>
              <OrderFieldDate
                id={'order-tostartatdate'}
                name={'toStartAtDate'}
                label={'Дата подачи'}
                disabledDate={disabledDate}
                disabled={disabledFields.includes('toStartAtDate')}
              />
            </VzForm.Col>
            <VzForm.Col span={12}>
              <OrderFieldTime
                id={'order-tostartattime'}
                name={'toStartAtTime'}
                label={'Время подачи'}
                disabled={disabledFields.includes('toStartAtTime')}
              />
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      ) : null}
      <VzForm.Group title={'Данные по транспортному средству'}>
        <VzForm.Row wrap={true}>
          <VzForm.Col span={6}>
            <OrderFieldSelectCategoryChoice
              id={'order-ordercategory'}
              name={'orderCategory'}
              label={'Тип автоперевозки'}
              disabled={disabledFields.includes('orderCategory')}
            />
          </VzForm.Col>
          <VzForm.Col span={6}>
            <OrderFieldSelectVehicleList
              name={'vehicleType'}
              label={'Тип ТС'}
              vehicleTypesList={availableVehicleTypes}
              disabled={disabledFields.includes('vehicleType') || !orderCategory}
              id={'order-vehicletype'}
            />
          </VzForm.Col>
          <VzForm.Col span={12}>
            <OrderFieldTreeSelect
              style={{ height: 34 }}
              name={'bodyTypes'}
              id={'order-bodytypes'}
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
          {bodyTypes.find((el) => el === 2) ? (
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
                  label={'Температура от, ℃'}
                  disabled={disabledFields.includes('vehicleTemperatureMin')}
                />
              </VzForm.Col>
              <VzForm.Col span={8}>
                <OrderFieldNumber
                  style={{ height: 34 }}
                  name={'vehicleTemperatureMax'}
                  label={'Температура до, ℃'}
                  disabled={disabledFields.includes('vehicleTemperatureMax')}
                />
              </VzForm.Col>
            </>
          ) : (
            <></>
          )}
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group title={'Адреса'}>
        <OrderFieldAddresses
          name={'addresses'}
          prepareAddressFromFavoriteFn={prepareAddressFromFavoriteFn}
          onTrackUpdated={onTrackUpdated}
          useMap={true}
          id={'order-address'}
          useFavorite={APP == 'dispatcher' ? !!selectedClient : true}
          client={selectedClient}
          canMovePredicateFn={canMoveEditAddressPredicate}
          canChangePredicateFn={canMoveEditAddressPredicate}
          validatorAddressItem={validateAddressItem}
          extraFieldComponent={OrderAddressCargoPlace}
          disabled={disabledFields.includes('addresses')}
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
      )}

      <VzForm.Group>
        <OrderAdvancedOptionsTransport
          disabled={disabledFields.includes('advancedOptions')}
          geozones={geozones}
        />
      </VzForm.Group>

      <VzForm.Group>
        <OrderAdvancedRequirementsTransport
          disabled={disabledFields.includes('advancedOptions')}
          geozones={geozones}
        />
      </VzForm.Group>
      {/* 
      <VzForm.Group>
        <OrderCustomProperties
          name={'customProperties'}
          wrapped={false}
          disabled={disabledFields.includes('customProperties')}
        />
      </VzForm.Group> */}

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

      <OrderCustomProperties
        name={'customProperties'}
        wrapped={false}
        disabled={disabledFields.includes('customProperties')}
      />

      <VzForm.Group title={'Дополнительно'}>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <OrderFieldTextarea
              label={'Публичный комментарий к рейсу'}
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

      <WhiteBoxHeaderDeprecated icon={<IconDeprecated name={'ordersDocuments2'} />}>
        {'Опубликовать рейс'}
      </WhiteBoxHeaderDeprecated>
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

export default compose([withOrderStore(OrderDataTransport)])(OrderTransportForm);
