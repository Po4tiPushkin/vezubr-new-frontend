import useCustomPropsColumns from '@vezubr/common/hooks/useCustomPropsColumns';
import { ProfileUsersSelectList, VzTableFiltered } from '@vezubr/components';
import { Ant, Modal, showConfirm } from '@vezubr/elements';
import React, { useCallback, useState, useEffect } from 'react';
import ProfileUserCounterpartyList from '../modal/counterparty';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import useParamsState from '@vezubr/common/hooks/useParamsState';

const ProfileUserContractors = (props) => {
  const { contractors: { data = [], itemsCount } = {}, onRemove, onAssign, onDelegate, loading } = props;

  const [selectedContractors, setSelectedContractors] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [filteredContractors, setFilteredContractors] = useState(data);
  const oldColumns = useColumns();
  const customPropsColumns = useCustomPropsColumns('client');
  const [params, pushParams] = useParamsState({ paramsDefault: { role: '2' } });
  const columns = [...oldColumns, ...customPropsColumns];
  const rowSelection = {
    selectedRowKeys: selectedContractors,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedContractors(selectedRowKeys);
    },
  };

  const filtersActions = useFiltersActions({ setShowModal })

  const closeModal = () => {
    setShowModal('');
  }

  const handleRemove = useCallback(() => {
    if (onRemove) {
      showConfirm({
        title: 'Вы точно хотите отвязать контрагентов от пользователя?',
        onOk: () => {
          onRemove(selectedContractors)
          setSelectedContractors([]);
        }
      })
    }
  }, [selectedContractors])
  const handleDelegate = useCallback((id) => {
    if (onDelegate) {
      closeModal();
      onDelegate(id, selectedContractors);
      setSelectedContractors([])
    }
  }, [selectedContractors]);

  const handleAssign = useCallback((counterparties) => {
    if (onAssign) {
      closeModal();
      onAssign(counterparties);
    }
  }, [])

  useEffect(() => {
    const { ...filterParams } = params
    let newDataSource = data;
    if (filterParams) {
      Object.entries(filterParams).forEach(([field, value]) => {
        newDataSource = newDataSource.filter(record => {

          if (typeof record[field] == 'string') {
            return record[field].toLowerCase().includes(value.toLowerCase());
          } else if (typeof record[field] == 'number') {
            return record[field] == value || value.includes(record[field])
          }
        })
      })
    }
    setFilteredContractors(newDataSource)
  }, [params, data])

  return (
    <>
      <div>
        <div className='user-contractors__table'>
          <VzTableFiltered.Filters
            {...{
              showArrow: false,
              filterSetName: 'contractors',
              filtersActions,
              title: 'Ответственный за Контрагентов',
              params,
              pushParams
            }}
          />
          <VzTableFiltered.TableFiltered
            {...{
              loading,
              dataSource: filteredContractors,
              columns,
              rowKey: 'contractorId',
              rowSelection,
              scroll: { x: true, y: 550 },
            }}
          />
        </div>
        <div className='user-contractors__actions'>
          <Ant.Button disabled={!selectedContractors.length} onClick={() => handleRemove()}>
            Отвязать контрагентов
          </Ant.Button>
          <Ant.Button disabled={!selectedContractors.length} onClick={() => setShowModal('delegate')}>
            Делегировать Пользователям
          </Ant.Button>
        </div>
      </div>
      {
        showModal === 'assign' && (
          <Modal
            visible={true}
            width={'85vw'}
            footer={[]}
            onCancel={() => closeModal()}
          >
            <ProfileUserCounterpartyList
              onCancel={() => closeModal()}
              onSave={(e) => handleAssign(e)}
              data={data.map(el => el.contractorId)}
            />
          </Modal>
        )
      }
      {
        showModal === 'delegate' && (
          <Modal
            visible={true}
            width={'85vw'}
            footer={[]}
            onCancel={() => closeModal()}
          >
            <ProfileUsersSelectList selectType="checkbox" onCancel={() => closeModal()} onSave={(e) => handleDelegate(e)} />
          </Modal>
        )
      }

    </>

  )
}

export default ProfileUserContractors;