import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Ant } from '@vezubr/elements';
import Editor from './editor';
import { Modal } from '@vezubr/elements';
import { getDBConfig, setDBConfig } from '../utils';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { setLocalStorageItem } from '@vezubr/common/common/utils';
import { setDBConfig as setTableDbConfig, getDBConfig as getTableDbConfig } from '../../tableConfig/utils';

export default function FiltersApply(props) {
  const { filterSetName, pushParams, setCanRefreshFilters, id: inputId, tableKey } = props;
  const { id } = useSelector(state => state.user);
  const [visibleModal, setVisibleModal] = useState(false);
  const [filters, setFilters] = useState({});

  const openModal = () => {
    setVisibleModal(true);
  };

  const closeModal = () => {
    setVisibleModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const newFilters = await getDBConfig(`filters-${id}`);
      if (newFilters) {
        setFilters(newFilters[filterSetName]);
      }
    };
    fetchData();
  }, [visibleModal]);

  const dataSource = useMemo(() => {
    return (
      filters &&
      Object.entries(filters).map(([uuid, value]) => {
        return {
          uuid,
          ...value,
        };
      })
    );
  }, [filters]);

  const onApply = (uuid) => {
    const params = filters[uuid].params;
    const columns = filters[uuid].columns;
    pushParams(params);
    if (columns) {
      const prevColumnsConfig = getTableDbConfig(tableKey)
      setTableDbConfig(tableKey, { ...prevColumnsConfig, columns })
    }
    setCanRefreshFilters(true);
    setVisibleModal(false);
  };

  const onRemove = useCallback(
    (removeUuid) => {
      const newFilters = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (removeUuid !== key) {
          newFilters[key] = { ...value };
        }
      });

      setDBConfig(`filters-${id}`, {
        [filterSetName]: {
          ...newFilters,
        },
      });
      setFilters(newFilters);
    },
    [filters],
  );

  const onUpdate = (uuid, data) => {
    const newFilters = { ...filters };

    newFilters[uuid] = { ...newFilters[uuid], ...data };

    setDBConfig(`filters-${id}`, {
      [filterSetName]: newFilters,
    });
    setFilters(newFilters);
  }

  const onDefault = (uuid) => {
    const raw = localStorage.getItem(`filters-${id}`);
    const currentFilter = dataSource && dataSource.filter((el) => el.uuid === uuid);
    let filtersDB = {}
    if (raw) {
      filtersDB = JSON.parse(raw);
    }
    if (filterSetName) {
      filtersDB[filterSetName] = { ...filtersDB[filterSetName], default: currentFilter };
      Ant.message.success({
        content: 'Фильтр по умолчанию установлен',
      });
    }
    setLocalStorageItem(`filters-${id}`, JSON.stringify(filtersDB));
    onApply(uuid);
  }

  const defaultFilterId = useMemo(() => {
    const raw = localStorage.getItem(`filters-${id}`);
    let filtersDB = {}
    if (raw) {
      filtersDB = JSON.parse(raw);
    }
    if (filterSetName && filtersDB[filterSetName]?.default?.[0]?.uuid) {
      return filtersDB[filterSetName].default[0].uuid
    }
    return null
  }, [localStorage.getItem(`filters-${id}`), filterSetName])

  return (
    (dataSource && (
      <>
        <Ant.Button id={inputId} type="primary" onClick={openModal} className={'filters-apply__button semi-wide margin-left-16'}>
          Сохраненные фильтры
        </Ant.Button>
        <Modal
          title={'Сохраненные фильтры'}
          visible={visibleModal}
          centered={false}
          destroyOnClose={true}
          footer={null}
          width={600}
          className={'filters-apply__modal'}
          onCancel={closeModal}
        >
          <Editor
            dataSource={dataSource}
            onApply={onApply}
            onRemove={onRemove}
            onUpdate={onUpdate}
            onDefault={onDefault}
            defaultFilterId={defaultFilterId}
          />
        </Modal>
      </>
    )) ||
    null
  );
}
