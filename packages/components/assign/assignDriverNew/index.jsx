import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Drivers as DriversServiceOperator } from '@vezubr/services/index.operator';
import { Drivers as DriversService } from '@vezubr/services/index';
import { showError, Modal, Loader, Ant } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import Driver from './elements/driver';
import './styles.scss';
import { useDebouncedCallback } from 'use-debounce';
const itemsPerPage = 100;

const AssignDriver = (props) => {
  const { showModal, onClose: closeModalInput, userId, assignedDrivers: assignedDriversInput = [], onSelect } = props;
  const dictionaries = useSelector((state) => state.dictionaries)
  const [drivers, setDrivers] = useState([]);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [assignedDrivers, setAssignedDrivers] = useState(assignedDriversInput);
  const [page, setPage] = useState(1);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (APP === 'operator') {
        const response = await DriversServiceOperator.list();
        setDrivers(response.data.vehicles || []);
      }
      else {
        const dataRequest = {
          page,
          name: searchValue,
          producer: userId,
          itemsPerPage
        }
        if (!searchValue || searchValue?.length < 2) {
          delete dataRequest.name;
        }
        const response = await DriversService.shortList(dataRequest);
        let responseDriversFiltered = response.drivers || [];
        if (assignedDrivers.length) {
          assignedDrivers.forEach((el) => {
            responseDriversFiltered = responseDriversFiltered.filter((item) => el.id !== item.id)
          })
        }
        setDrivers(responseDriversFiltered)
        setTotalDrivers(response.itemsCount);
      }
    } catch (e) {
      showError(e);
      console.error(e);
    }
    finally {
      setLoading(false)
    }
  }, [page, searchValue, assignedDrivers])

  useEffect(() => {
    fetchData();
  }, [page])

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    } else {
      fetchData()
    }
  }, [searchValue])

  // useEffect(() => {
  //   const filterVal = searchValue.toLowerCase();
  //   const filtered = filterVal ? drivers.filter((driver) => {
  //     const condition = driver.patronymic ?
  //       driver.name.toLowerCase().includes(filterVal) ||
  //       driver.surname.toLowerCase().includes(filterVal) ||
  //       driver.patronymic.toLowerCase().includes(filterVal) :
  //       driver.name.toLowerCase().includes(filterVal) ||
  //       driver.surname.toLowerCase().includes(filterVal);

  //     return (
  //       condition
  //     );
  //   }) : drivers;

  //   setFilteredDrivers(filtered)
  // }, [searchValue, drivers])

  const closeModal = useCallback(() => {
    setSearchValue('');
    closeModalInput();
  }, [])

  const onSubmit = useCallback(() => {
    onSelect(assignedDrivers);
    closeModalInput();
  }, [assignedDrivers])

  const [debounced] = useDebouncedCallback((value) => {
    setSearchValue(value)
  }, 500)

  const addDriver = useCallback((driver, key) => {
    const newDrivers = drivers.filter(el => el.id !== driver.id);
    const newAssignedDrivers = [...assignedDrivers, driver];
    setDrivers(newDrivers);
    setAssignedDrivers(newAssignedDrivers);
  }, [drivers, assignedDrivers])

  const removeDriver = useCallback((driver) => {
    const newAssignedDrivers = assignedDrivers.filter(el => el.id !== driver.id);
    const newDrivers = [...drivers, driver];

    setDrivers(newDrivers);
    setAssignedDrivers(newAssignedDrivers);
  }, [drivers, assignedDrivers])

  const renderAssignedDrivers = useMemo(() => {
    return assignedDrivers.map((el, index) => {
      return (
        <Driver
          uiStates={dictionaries?.driverUiStates}
          data={el}
          key={index}
          assigned={true}
          disabled={loading}
          onAction={(driver) => removeDriver(driver)}
        />
      )
    })
  }, [assignedDrivers, drivers, loading]);


  const renderDrivers = useMemo(() => {
    return drivers.map((el, index) => {
      return (
        <Driver
          data={el}
          key={index}
          uiStates={dictionaries?.driverUiStates}
          onAction={(driver) => addDriver(driver)}
        />
      )
    })
  }, [drivers]);

  const renderSearch = useMemo(() => {
    return (
      <Ant.Input
        suffix={<Ant.Icon type="search" />}
        placeholder='Поиск по ФИО'
        // value={searchValue}
        onChange={(e) => debounced(e.target.value.toLowerCase())}
      />
    )
  }, [searchValue]);

  const renderPagination = useMemo(() => {
    return <div className='assignModal__pagination flexbox'>
      <Ant.Pagination total={totalDrivers} pageSize={itemsPerPage} current={page} onChange={(newPage) => setPage(newPage)} />
    </div>;
  }, [page, totalDrivers])

  const renderModal = useMemo(() => {
    return (
      <div className='assign-driver__main'>
        <div className="flexbox">
          <div style={{flex: '0.5'}}>
            <div className='assign-driver__list'>
              {renderSearch}
              {
                loading ? <Loader /> :
                  <>
                    {renderDrivers}
                  </>
              }

            </div>
            {renderPagination}
          </div>

          <div className='assign-driver__assigned'>
            {renderAssignedDrivers}
          </div>
        </div>
      </div>
    )
  }, [renderAssignedDrivers, renderDrivers, loading])

  return (
    <Modal
      visible={showModal}
      onCancel={() => closeModal()}
      className={'assign-driver'}
      title={'Добавление водителей'}
      footer={[
        <Ant.Button
          onClick={() => onSubmit()}
          key="submit"
          type='primary'
        >
          Назначить выбранных
        </Ant.Button>
      ]}
    >
      {renderModal}
    </Modal>
  )
}

export default AssignDriver;