import React, { useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm, Loader } from '@vezubr/elements';
import * as Order from '@vezubr/order/form';
import t from '@vezubr/common/localization';
import { useObserver } from 'mobx-react';
import compose from '@vezubr/common/hoc/compose';
import { VEHICLE_BODY_GROUPS, VEHICLE_BODY_GROUPS_BODY_TYPES } from '@vezubr/common/constants/constants';

const { SelectVehicleList, TreeSelect, Select } = Order.FormFields;

const { AdvancedOptionsTransport } = Order.FormComponents;

const { withOrderStore } = Order;

const { OrderDataTransport } = Order.Store;

const { getBodyTypesTreeData, getOrderDocumentCategoriesTreeData, getOrderDocumentsRequired } = Order.Utils;

function SettingsOrderIntercityForm(props) {
  const { saving, loading, dictionaries, store } = props;
  const didMount = useRef(false);
  const {
    vehicleTypesList,
    vehicleBodies,
    orderDocumentCategories,
    geozones: geozonesInput,
    cargoTypes,
    orderSettingPointChangeType
  } = dictionaries;
  const vehicleType = useObserver(() => store.getDataItem('vehicleType'));
  const orderDocumentCategoriesTreeData = useMemo(() => {
    const { intercity } = getOrderDocumentsRequired(orderDocumentCategories);
    return getOrderDocumentCategoriesTreeData(
      {
        intercity,
      },
      orderDocumentCategories,
    );
  }, [orderDocumentCategories]);

  useEffect(() => {
    if (didMount.current) {
      store.setDataItem('bodyTypes', []);
    } else if (vehicleType) {
      didMount.current = true;
    }
  }, [vehicleType]);

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

  const bodyTypesTreeData = useMemo(
    () =>
      getBodyTypesTreeData(
        vehicleBodies,
        VEHICLE_BODY_GROUPS,
        VEHICLE_BODY_GROUPS_BODY_TYPES,
        vehicleType,
        vehicleTypesList,
      ),
    [vehicleBodies, vehicleType, vehicleTypesList],
  );

  return (
    <div className={'settings-order-intercity-form'}>
      <VzForm.Group title={'Данные по транспортному средству'}>
        <VzForm.Row wrap={true}>
          <VzForm.Col span={8}>
            <SelectVehicleList name={'vehicleType'} label={'Тип ТС'} vehicleTypesList={vehicleTypesList} />
          </VzForm.Col>
          <VzForm.Col span={16}>
            <TreeSelect
              style={{ height: 34 }}
              name={'bodyTypes'}
              maxTagCount={3}
              treeNodeFilterProp={'title'}
              treeData={bodyTypesTreeData}
              allowClear={false}
              disabled={!vehicleType}
              treeCheckable={true}
              showCheckedStrategy={Ant.TreeSelect.SHOW_CHILD}
              searchPlaceholder={'Выберите тип кузова'}
              placeholder={'Выберите тип кузова'}
              label={'Тип кузова'}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <Select
              label={'Изменение и пропуск точек маршрута водителем'}
              name={'pointChangeType'}
              list={{
                array: orderSettingPointChangeType,
                labelKey: 'title',
                valueKey: 'id'
              }}
              allowClear={false}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group>
        <TreeSelect
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
        />
      </VzForm.Group>

      <VzForm.Group>
        <AdvancedOptionsTransport geozones={geozones} cargoTypes={cargoTypes} />
      </VzForm.Group>

      {(loading || saving) && <Loader />}
    </div>
  );
}

SettingsOrderIntercityForm.propTypes = {
  dictionaries: PropTypes.object.isRequired,
  validators: PropTypes.object,
  saving: PropTypes.bool,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  lazyData: PropTypes.object,
  staticData: PropTypes.object,
};

export default compose([withOrderStore(OrderDataTransport)])(SettingsOrderIntercityForm);
