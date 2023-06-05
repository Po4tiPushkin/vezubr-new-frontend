import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Vehicle as VehicleService } from '@vezubr/services';
import { Vehicle as VehicleServiceOperator } from '@vezubr/services/index.operator';
import { showError, Modal, Loader, Ant } from '@vezubr/elements';
import Vehicle from './elements/vehicle';
import './styles.scss';
const AssignTransport = (props) => {
  const { showModal, onClose: closeModalInput, userId, assignedTransports: assignedTransportsInput = [], onSelect } = props;
  const [transports, setTransports] = useState([]);
  const [filteredTransports, setFilteredTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [assignedTransports, setAssignedTransports] = useState(assignedTransportsInput);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (APP === 'operator') {
          const response = await VehicleServiceOperator.list();
          setTransports(response.data.vehicles || []);
          setFilteredTransports(response.data.vehicles || [])
        }
        else {
          const response = await VehicleService.list();

          let responseTransportsFiltered =
            response.data?.filter(
              el => el.producer?.id === userId &&
                !el.exploitationFinishDate &&
                el.status !== 'not_active' &&
                el.uiState !== 'work_suspended'
            ) ||
            [];

          if (assignedTransports.length) {
            assignedTransports.forEach((el) => {
              responseTransportsFiltered = responseTransportsFiltered.filter((item) => el.id !== item.id)
            })
          }
          setTransports(responseTransportsFiltered)
          setFilteredTransports(responseTransportsFiltered)
        }
      } catch (e) {
        showError(e);
        console.error(e);
      }
      finally {
        setLoading(false)
      }
    }
    fetchData();

  }, []);

  useEffect(() => {
    const filterVal = searchValue.toLowerCase();
    const filtered = filterVal ? transports.filter((transport) => {
      const condition = transport.markAndModel ? transport.markAndModel.toLowerCase().includes(filterVal) ||
        transport.plateNumber.toLowerCase().includes(filterVal) : transport.plateNumber.toLowerCase().includes(filterVal);

      return (
        condition
      );
    }) : transports;

    setFilteredTransports(filtered)
  }, [searchValue, transports])

  const closeModal = useCallback(() => {
    setSearchValue('');
    closeModalInput();
  }, [])

  const onSubmit = useCallback(() => {
    onSelect(assignedTransports);
    closeModalInput();
  }, [assignedTransports])

  const addTransport = useCallback((transport, key) => {
    const newTransports = transports.filter(el => el.id !== transport.id);
    const newAssignedTransports = [...assignedTransports, transport];
    setTransports(newTransports);
    setAssignedTransports(newAssignedTransports);
  }, [transports, assignedTransports])

  const removeTransport = useCallback((transport) => {
    const newAssignedTransports = assignedTransports.filter(el => el.id !== transport.id);
    const newTransports = [...transports, transport];

    setTransports(newTransports);
    setAssignedTransports(newAssignedTransports);
  }, [transports, assignedTransports])

  const renderAssignedTransports = useMemo(() => {
    return assignedTransports.map((el, index) => {
      return (
        <Vehicle
          data={el}
          key={index}
          assigned={true}
          onAction={(transport) => removeTransport(transport)}
        />
      )
    })
  }, [assignedTransports, transports]);


  const renderTransports = useMemo(() => {
    return filteredTransports.map((el, index) => {
      return (
        <Vehicle
          data={el}
          key={index}
          onAction={(transport) => addTransport(transport)}
        />
      )
    })
  }, [filteredTransports]);

  const renderSearch = useMemo(() => {
    return (
      <Ant.Input suffix={<Ant.Icon type="search" />} placeholder='Поиск ТС' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
    )
  }, [searchValue])

  const renderModal = useMemo(() => {
    return (
      <div className='assign-transport__main'>
        <div className="flexbox">
          <div className='assign-transport__list'>
            {renderSearch}
            {renderTransports}
          </div>
          <div className='assign-transport__assigned'>
            {renderAssignedTransports}
          </div>
        </div>
      </div>
    )
  }, [renderAssignedTransports, renderTransports])

  return (
    <Modal
      visible={showModal}
      onCancel={() => closeModal()}
      className={'assign-transport'}
      title={'Добавить ТС'}
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
      {loading ? <Loader /> : renderModal}
    </Modal>
  )
}

export default AssignTransport;