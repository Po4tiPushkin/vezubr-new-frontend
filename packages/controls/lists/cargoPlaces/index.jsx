import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { VzTableFiltered, MultiSelect } from '@vezubr/components';
import { Filters } from '@vezubr/components/tableFiltered';
import { Address as AddressService, CargoPlace as CargoPlaceService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';
import useRowSelection from '@vezubr/common/hooks/useRowSelection';
import useColumns from './hooks/useColumns';
import Utils from '@vezubr/common/common/utils'
import useRowClassName from './hooks/useRowClassName';
import useFiltersActions from './hooks/useFiltersActions';
import ExportCSV from '@vezubr/components/export/CSV';
import { Modal, showError, showAlert, Ant } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { history } from '../../infrastructure';
import { useSelector } from 'react-redux';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import moment from 'moment';
import RoutingUpdateFields from './actions/routingUpdateFields';
import { useDebouncedCallback } from 'use-debounce';
import TableConfig from '@vezubr/components/tableConfig';
const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = `cargo-place-${APP}`;

const getParamsQuery = (params) => {
  const paramsQuery = { ...params };

  if (paramsQuery.deliveryRegionId) {
    paramsQuery.deliveryRegionId = ~~paramsQuery.deliveryRegionId;
  }

  if (paramsQuery.departureRegionId) {
    paramsQuery.departureRegionId = ~~paramsQuery.departureRegionId;
  }

  if (paramsQuery.orderId) {
    paramsQuery.orderId = ~~paramsQuery.orderId;
  }

  if (paramsQuery.status) {
    paramsQuery.status = paramsQuery.status.split(',');
  }

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page;
  }

  return paramsQuery;
};

function CargoPlaceList(props) {

  const { location } = history;
  const dictionaries = useSelector(state => state.dictionaries)

  const [params, pushParams] = useParams({
    history,
    location,
    paramsName: 'cargoPlace',
    paramsDefault: {
      creationDateFrom: moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
      creationDateTo: moment().endOf('day').format('YYYY-MM-DD'),
    },
  });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;
  const [rowSelection, multiSelect, setMultiSelect] = useRowSelection();

  const [useExport, setUseExport] = useState(false);

  const oldColumns = useColumns({ dictionaries });
  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);
  const [canRefreshFilters, setCanRefreshFilters] = useState(false);
  const [visibleRoutingModal, setVisibleRoutingModal] = useState(false);
  const [cargoRegions, setCargoRegions] = useState([]);

  const { itemsPerPage } = QUERY_DEFAULT;
  const [addressServiceData, setAddressServiceData] = useState([]);
  const [addressesFilters, setAddressesFilters] = useState({ id: null, addressString: null })
  const [addressLoading, setAddressLoading] = useState(false);

  const fetchData = async () => {

    const paramsQuery = getParamsQuery(params)

    try {
      setLoadingData(true);
      if (multiSelect) {
        rowSelection.onChange([]);
      }
      const response = await CargoPlaceService.list({
        ...QUERY_DEFAULT,
        ...paramsQuery,
      });
      const dataSource = Utils.getIncrementingId(response?.data, paramsQuery?.page)

      setData({ dataSource, total: response?.itemsCount });

      setLoadingData(false);
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        showError(e);
        setLoadingData(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const getDataFuncForExport = useCallback(async () => {
    const paramsQuery = getParamsQuery(params);
    await Utils.exportList(CargoPlaceService, {
      ...QUERY_DEFAULT,
      ...paramsQuery,
      ...{ itemsPerPage: null },
    })

    return () => { };
  }, [columns, params]);

  const rowClassName = useRowClassName();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionsList = await AddressService.regionsList();
        setCargoRegions(regionsList);
      } catch (e) {
        console.error(e);
        showError(e);
      }
    };
    fetchData();
  }, []);

  const fetchAddresses = useCallback(async (params) => {
    try {
      setAddressLoading(true)
      const AddressServiceSource = await AddressService.list(params);
      setAddressServiceData(AddressServiceSource?.points);
    } catch (e) {
      console.error(e);
      showError(e);
    }
    finally {
      setAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses(addressesFilters);
  }, [addressesFilters]);

  const [debounced] = useDebouncedCallback((value, type) => {
    setAddressesFilters(prev => ({ ...prev, [type]: value }))
  }, 500);

  const renderAdditionalAddressesFilters = useMemo(() => {
    return (
      <div className='flexbox'>
        <Ant.Form.Item label={'ID Адреса Партнёра'} className={'flexbox'}>
          <Ant.Input
            defaultValue={addressesFilters?.externalId}
            onChange={(e) => debounced(e.target.value, 'externalId')}
          />
        </Ant.Form.Item>
        <Ant.Form.Item className={'margin-left-25 flexbox'} label={'Фактический Адрес'}>
          <Ant.Input
            defaultValue={addressesFilters?.addressString}
            onChange={(e) => debounced(e.target.value, 'addressString')}
          />
        </Ant.Form.Item>


      </div>
    )
  }, [addressesFilters]);



  const handleCancelRoutingModal = () => {
    setVisibleRoutingModal(false);
  };

  const onSaveChanges = async (data) => {
    try {
      await CargoPlaceService.updateGroup({ cargoPlacesUpdate: data });
      fetchData();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  };

  const onSaveRoutingChanges = async (data) => {
    try {
      await CargoPlaceService.orderPlanning(data);
      handleCancelRoutingModal();
      fetchData();

      showAlert({
        content: 'Грузоместа отправлены на маршрутизацию',
        title: t.common('ОК')
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  };

  const filtersActions = useFiltersActions({
    dictionaries,
    setUseExport,
    history,
    cargoRegions,
    pushParams,
    setCanRefreshFilters,
    multiSelect,
    setMultiSelect,
  });

  const formatDataSource = useMemo(() => {
    return dataSource.map(el => {
      if (el.statusAddress) {
        el.statusPointId = el.statusAddress?.id
      }
      if (el.departurePoint) {
        el.departurePointId = el.departurePoint?.id
      }
      if (el.deliveryPoint) {
        el.deliveryPointId = el.deliveryPoint?.id
      }
      return el
    })
  }, [dataSource])

  return (
    <div className="orders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          canRefreshFilters,
          setCanRefreshFilters,
          visibleSaveButtons: true,
          filterSetName: 'cargoPlace',
          filtersActions,
          title: 'Грузоместа',
        }}
      />
      {multiSelect &&
        <MultiSelect
          tableName={'cargoPlaces'}
          history={history}
          onSave={onSaveChanges}
          location={location}
          loading={{ table: addressLoading }}
          selectedRows={rowSelection.selectedRows.map(el => (formatDataSource || []).find(item => el === item.id)).filter(el => el)}
          other={
            {
              addresses: {
                addressList: addressServiceData,
                render: {
                  render: renderAdditionalAddressesFilters,
                  valuesCheck: [1, 2, 3],
                }
              }
            }
          }
          otherActions={
            [
              {
                onAction: () => setVisibleRoutingModal(true),
                title: 'Маршрутизировать'
              }
            ]
          }
        />
      }
      <VzTableFiltered.TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          rowSelection,
          dataSource,
          rowClassName,
          key: params?.page || 1,
          rowKey: 'id',
          scroll: { x: width, y: 550 },
          paramKeys,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
      <ExportCSV
        useExport={useExport}
        onFinishFunc={() => setUseExport(false)}
        setLoadingStatusFunc={setLoadingData}
        title={'Грузоместа'}
        getDataFunc={getDataFuncForExport}
        filename={'Грузоместа'}
      />
      <Modal
        className={'cargo-place-routing__modal'}
        visible={visibleRoutingModal}
        centered={false}
        destroyOnClose={true}
        footer={null}
        width={1200}
        onCancel={handleCancelRoutingModal}
      >
        <RoutingUpdateFields
          dataSource={rowSelection?.selectedRows.map(el => dataSource.find(item => el === item.id)).filter(el => el)}
          onCancel={handleCancelRoutingModal}
          onSaveRoutingChanges={onSaveRoutingChanges}
        />
      </Modal>
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}

export default CargoPlaceList;
