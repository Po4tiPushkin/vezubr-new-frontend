import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Orders as OrdersService, Vehicle as VehicleService } from '@vezubr/services';
import { showError, Modal, Loader, Ant, showConfirm } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import _compact from 'lodash/compact';
import _isEmpty from 'lodash/isEmpty';
import _uniqBy from 'lodash/uniqBy';
import Utils from '@vezubr/common/common/utils';
import { useSelector } from 'react-redux';
import Content from '../content';
import Search from '../search';
import Tabs from '../tabs';
const AssignTransportToOrderPage = (props) => {
  const {
    order,
    showPhone,
    selectTransport,
    isStrict
  } = props;

  const [activeTab, setActiveTab] = useState(false);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [vehicles, setVehicles] = useState(null);
  const [tractors, setTractors] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const isMounted = useRef(false);
  const tabs = useMemo(() => [
    {
      title: 'Доступные',
      active: !activeTab,
    },
    {
      title: 'Недоступные',
      active: activeTab,
    }
  ], [activeTab]);
  const user = useSelector((state) => state.user);

  const onSelectTransport = useCallback(async (transport, driver, tractor) => {
    try {
      setLoading(true);
      await selectTransport({ transport, driver, tractor })
    }
    finally {
      setLoading(false);
    }
  }, [selectTransport]);

  const fetchTractors = useCallback(async () => {
    try {
      setLoading(true);
      const responce = await VehicleService.listCompatibleForOrderTractor(order?.id,
        {
          itemsPerPage: 100,
          isStrict,
        });
      const total = responce.itemsCount;
      const tractors = responce.vehicles;
      let page = 2;
      const totalPages = Math.ceil(total / 100);
      while (page <= totalPages) {
        const newTractors =
          await VehicleService.listCompatibleForOrderTractor(order?.id, {
            itemsPerPage: 100, page, isStrict
          });

        page += 1;
        tractors.push(...newTractors.vehicles);
      }
      setTractors(tractors.map(el => (
        {
          ...el.vehicle, linkedDrivers: el.linkedDrivers, availability: el.availability, activeOrder: el.activeOrder
        })
      ));
    } catch (e) {
      showError(e);
      console.error(e);
    }
    finally {
      setLoading(false);
    }

  }, [isStrict, activeTab]);

  const fetchTransports = useCallback(async (value) => {
    try {
      setLoading(true);
      const query = value === null ? filterValue : value;
      const dataRequest = {
        page,
        query,
        isStrict,
        employmentStatus: activeTab ? 'busy' : 'free',
      }
      if (!dataRequest.query || dataRequest.query?.length < 2) {
        delete dataRequest.query;
      }
      const responseVehicles = await VehicleService.listCompatibleForOrderVehicle(order?.id, dataRequest);
      const vehicleTemp = responseVehicles.vehicles || [];
      const totalVehicles = responseVehicles.itemsCount;
      setVehicles(vehicleTemp);
      setFilteredVehicles(vehicleTemp);
      setTotalVehicles(totalVehicles);
    } catch (e) {
      console.error(e);
      showError(e);
    } finally {
      setLoading(false);
    }
  }, [isStrict, activeTab, filterValue, order, page])

  const onChangeFilterValue = useCallback(async (value) => {
    setFilterValue(value)
    if (page !== 1) {
      setPage(1);
    } else {
      fetchTransports(value);
    }
  }, [page, filterValue])

  const onChangeTab = useCallback((value) => {
    setFilterValue('')
    setActiveTab(value);
  }, [])

  const renderPagination = useMemo(() => {
    return <div className='assignModal__pagination flexbox'>
      <Ant.Pagination total={totalVehicles} pageSize={100} current={page} onChange={(newPage) => setPage(newPage)} />
    </div>;
  }, [page, totalVehicles])

  const fetchData = useCallback(async (value) => {
    await fetchTractors();
    await fetchTransports(value);
  }, [isStrict, activeTab, filterValue, order, page]);

  useEffect(() => {
    if (isMounted.current) {
      fetchTransports(null)
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [order])

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    else
      if (isMounted.current) {
        fetchData();
      }
      else {
        isMounted.current = true
      }
  }, [isStrict, activeTab]);

  const errorText = !user.vehiclesAdded
    ? 'Вы сможете выбрать Транспорт и водителя после их создания/регистрации в системе.'
    : 'Не были найдены ТС, подходящие под ваш запрос'

  return (
    <div className='assignModal__content'>
      <Tabs tabs={tabs} setActiveTab={(e) => onChangeTab(e)} />
      <Search
        key={`${isStrict}-${activeTab}`}
        setFilterValue={(e) => onChangeFilterValue(e)}
      />
      {vehicles?.length && !loading ?
        <>
          <Content
            tractors={tractors}
            selectTransport={onSelectTransport}
            transports={filteredVehicles}
            loading={loading}
            showPhone={showPhone}
            order={order}
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