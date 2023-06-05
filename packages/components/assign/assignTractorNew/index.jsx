import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Tractor as TractorService } from '@vezubr/services';
import { Tractor as TractorServiceOperator } from '@vezubr/services/index.operator';
import { Ant, Modal, showError, Loader } from '@vezubr/elements';
import Tractor from './elements/tractor';
import Search from './elements/search';
const AssignTractorNew = (props) => {
  const { showModal, onSave, onClose } = props;
  const [tractors, setTractors] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalTractors, setTotalTractors] = useState(0);

  const renderPagination = useMemo(() => {
    return <div className='assignModal__pagination flexbox margin-top-5'>
      <Ant.Pagination total={totalTractors} pageSize={100} current={page} onChange={(newPage) => setPage(newPage)} />
    </div>;
  }, [page, totalTractors])


  const fetchData = async () => {
    let tractorsResponse = []
    try {
      setLoading(true)
      if (APP === 'operator') {
        const response = await TractorServiceOperator.vehicleTractorsList();
        tractorsResponse = response.data.tractors;
      } else {
        const payload = {
          isOwned: true,
          page,
          itemsPerPage: 100,
        }
        if (searchValue) {
          payload.plateNumber = searchValue
        }
        const response = await TractorService.list(payload);
        tractorsResponse = response.data;
        setTotalTractors(response.count)
      }
      setTractors(tractorsResponse);
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        showError(e);
      }
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData()
  }, [page]);

  useEffect(() => {
    if (searchValue === null) {
      return;
    }
    if (page !== 1) {
      setPage(1);
    } else {
      fetchData()
    }
  }, [searchValue])

  const onSelect = useCallback((tractor) => {
    if (onSave) {
      onSave(tractor);
    }
    onClose();
  }, [])

  const renderTractors = useMemo(() => {
    return tractors.map((el) => {
      return (
        <Tractor data={el} key={el.id} onAction={onSelect} />
      )
    })
  }, [tractors])

  const renderSearch = useMemo(() => {
    return <Search setSearchValue={setSearchValue} />
  }, [searchValue])

  const renderModal = useMemo(() => {
    return (
      <div className='assign-tractor__main'>
        {renderSearch}
        <div className="flexbox">
          <div className='assign-tractor__list'>
            {loading ? <Loader /> : renderTractors}
          </div>
        </div>
        {renderPagination}
      </div>
    )
  }, [renderTractors, loading, renderPagination])

  return (
    <Modal
      visible={showModal}
      className={'assign-tractor'}
      title={'Добавить Тягач'}
      onCancel={() => onClose()}
      footer={[]}
    >
      {renderModal}
    </Modal>
  )
}

export default AssignTractorNew;