import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Trailer as TrailerService } from '@vezubr/services';
import { Trailer as TrailerServiceOperator } from '@vezubr/services/index.operator';
import { Ant, Modal, showError, Loader } from '@vezubr/elements';
import Trailer from './elements/trailer';
import Search from './elements/search';
const AssignTrailerNew = (props) => {
  const { showModal, onSave, onClose } = props;
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(null);
  const [page, setPage] = useState(1);
  const [totalTrailers, setTotalTrailers] = useState(0);

  const renderPagination = useMemo(() => {
    return <div className='assignModal__pagination flexbox margin-top-5'>
      <Ant.Pagination total={totalTrailers} pageSize={100} current={page} onChange={(newPage) => setPage(newPage)} />
    </div>;
  }, [page, totalTrailers])

  const fetchData = async () => {
    let trailersResponse = []
    try {
      setLoading(true)
      if (APP === 'operator') {
        const response = await TrailerServiceOperator.vehicleTrailerList();
        trailersResponse = response.data.trailers;
      } else {
        const payload = {
          isOwned: true,
          page,
          itemsPerPage: 100,
        }
        if (searchValue) {
          payload.plateNumber = searchValue
        }
        const response = await TrailerService.list(payload);
        trailersResponse = response.trailers;
        setTotalTrailers(response.itemsCount)
      }
      setTrailers(trailersResponse);
    } catch (e) {
      console.error(e);
      showError(e);
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

  const onSelect = useCallback((trailer) => {
    if (onSave) {
      onSave(trailer);
    }
    onClose();
  }, [])

  const renderTrailers = useMemo(() => {
    return trailers.map((el) => {
      return (
        <Trailer data={el} key={el.id} onAction={onSelect} />
      )
    })
  }, [trailers])

  const renderSearch = useMemo(() => {
    return <Search setSearchValue={setSearchValue} />
  }, [])

  const renderModal = useMemo(() => {
    return (
      <div className='assign-trailer__main'>
        {renderSearch}
        <div className="flexbox">
          <div className='assign-trailer__list'>
            {loading ? <Loader /> : renderTrailers}
          </div>
        </div>
        {renderPagination}
      </div>
    )
  }, [renderTrailers, renderPagination, loading, page])

  return (
    <Modal
      visible={showModal}
      className={'assign-trailer'}
      title={'Добавить Полуприцеп'}
      onCancel={() => onClose()}
      footer={[]}
    >
      {renderModal}
    </Modal>
  )
}

export default AssignTrailerNew;