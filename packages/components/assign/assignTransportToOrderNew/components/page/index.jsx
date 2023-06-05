import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Orders as OrdersService, Vehicle as VehicleService } from '@vezubr/services';
import { showError, Modal, Loader, Ant, showConfirm } from '@vezubr/elements';
import useTabs from '../../hooks/useTabs';
import t from '@vezubr/common/localization';
import { Search, Content, Tabs } from '../../elements';
import _compact from 'lodash/compact';
import _isEmpty from 'lodash/isEmpty';
import _uniqBy from 'lodash/uniqBy';
import Utils from '@vezubr/common/common/utils';
import { useSelector } from 'react-redux'
import TRANSPORT_ORDER
  from '@vezubr/common/assets/agreements/Общие условия перевозки груза автомобильным транспортом.pdf';

const AssignTransportToOrderPage = (props) => {
  const {
    data,
    order = {},
    vehicleTypes,
    showPhone,
    selectTransport,
    isStrict
  } = props;
  const [vehicles, setVehicles] = useState([]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [page, setPage] = useState(1);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [tractors, setTractors] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [filterState, setFilterState] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const isMounted = useRef(false);
  const user = useSelector((state) => state.user)
  const orderCoordinates = useMemo(() => {
    return `${order.firstPointLatitude || data.firstPointLatitude}, ${order.firstPointLongitude || data.firstPointLongitude}`;
  }, [order, data])

  const tabs = useTabs({ vehicles, activeTab, startAtLocal: data?.startAtLocal, orderCoordinates });

  const renderPagination = useMemo(() => {
    return <div className='assignModal__pagination flexbox'>
      <Ant.Pagination total={totalVehicles} pageSize={100} current={page} onChange={(newPage) => setPage(newPage)} />
    </div>;
  }, [page, totalVehicles])

  const fetchTractors = useCallback(async () => {
    const responce = await VehicleService.listCompatibleForOrderTractor(data?.id, { itemsPerPage: 100, isStrict });
    const total = responce.itemsCount;
    const tractors = responce.vehicles;
    let page = 2;
    const totalPages = Math.ceil(total / 100);
    while (page <= totalPages) {
      const newTractors =
        await VehicleService.listCompatibleForOrderTractor(data?.id, {
          itemsPerPage: 100, page: page, isStrict
        });

      page += 1;
      tractors.push(...newTractors.vehicles);
    }
    return tractors;
  }, [isStrict])

  const onChangeFilterValue = useCallback(async (value) => {
    setFilterValue(value)
    if (page !== 1) {
      setPage(1);
    } else {
      fetchData(value);
    }
  }, [page, filterValue])

  const fetchData = useCallback(async (value) => {
    try {
      setLoading(true);
      const query = value === null ? filterValue : value
      const dataRequest = {
        page,
        query,
        isStrict
      }
      if (!dataRequest.query || dataRequest.query?.length < 2) {
        delete dataRequest.query;
      }
      const responseVehicles = await VehicleService.listCompatibleForOrderVehicle(data?.id, dataRequest);
      const responseTractors = await fetchTractors();
      const vehicleTemp = responseVehicles.vehicles || [];
      const totalVehicles = responseVehicles.itemsCount;
      setTractors(responseTractors.map(el => (
        {
          ...el.vehicle, linkedDrivers: el.linkedDrivers, availability: el.availability, activeOrder: el.activeOrder
        })
      ));
      setVehicles(vehicleTemp);
      setFilteredVehicles(vehicleTemp);
      setTotalVehicles(totalVehicles);
    } catch (e) {
      console.error(e);
      showError(e);
    } finally {
      setLoading(false);
    }
  }, [page, filterValue, data, isStrict]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
      return
    }
    if (isMounted.current) {
      fetchData();
    }
    else {
      isMounted.current = true
    }
  }, [isStrict])

  useEffect(() => {
    fetchData();
  }, [data, page])

  useEffect(() => {
    let filtered = tabs[activeTab]?.vehicles || vehicles || [];
    // if (filterValue) {
    //   filtered = filtered.filter((transport) => {
    //     const isPlateNumber = transport?.vehicle?.plateNumber.toLowerCase().includes(filterValue);
    //     const findIndexDriverNames = transport?.linkedDrivers.findIndex((item) => {
    //       const { driverLicenseName = '', driverLicenseSurname = '', driverLicensePatronymic = '' } = item?.driver || {};
    //       let searchArr = _compact([driverLicenseName, driverLicenseSurname, driverLicensePatronymic]);
    //       if (!_isEmpty(searchArr)) {
    //         searchArr = searchArr.map(v => v.toLowerCase())
    //         return searchArr.some((v) => v.includes(filterValue));
    //       }
    //       return false;
    //     });

    //     return (
    //       isPlateNumber || (findIndexDriverNames > -1)
    //     );
    //   });
    // }
    if (filterState && filtered.length) {
      filtered = filtered.filter(el => +el.vehicle.vehicleTypeId === +filterState)
    }
    setFilteredVehicles(filtered);


  }, [filterState, activeTab, tabs])

  const onSelectTransport = useCallback(async (transport, driver, tractor) => {
    try {
      setLoading(true);
      await selectTransport(transport, driver, tractor)
    }
    finally {
      setLoading(false);
    }
  }, [selectTransport])

  const errorText = !user.vehiclesAdded
    ? 'Вы сможете выбрать Транспорт и водителя после их создания/регистрации в системе.'
    : 'Не были найдены ТС, подходящие под ваш запрос'

  return (

    <div className="assignModal__content">
      <Tabs tabs={tabs} setActiveTab={onChangeTabs} />
      <Search
        vehicleTypes={vehicleTypes}
        filterState={filterState}
        filterValue={filterValue}
        key={isStrict}
        setFilterState={setFilterState}
        setFilterValue={(e) => onChangeFilterValue(e)}
      />
      {vehicles?.length && !loading ?
        <>
          <Content
            tractors={tractors}
            selectTransport={onSelectTransport}
            transports={filteredVehicles}
            loading={loading} s
            howPhone={showPhone}
            data={data}
          />
          {renderPagination}
        </>
        :
        loading ?
          <Loader />
          :
          <div className='assignModal__error'>
            <span>
              {errorText}
            </span>
          </div>
      }
    </div>
  )
}

export default AssignTransportToOrderPage;