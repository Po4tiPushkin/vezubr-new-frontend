import React, { useEffect, useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, VzTable } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import useColumns from './hooks/useColumns';
import store from '../../store/Favorite';
import { useDebouncedCallback } from 'use-debounce';

function AddressFavoriteChooseForm(props) {
  const { onCancel, onChoose, chooseText, selectedAddress, excludeAddresses, client } = props;
  const { loading, loaded, sort, page, total, addressString, id } = store;

  const dataSourceStore = excludeAddresses ? store.dataSourceFiltered(excludeAddresses) : store.dataSource;

  const onChangeTable = useCallback(
    (paginationInput, filters, sorter) => {
      if (sorter.order === 'descend' && sort !== 'DESC') {
        store.sort = 'DESC';
      } else if (sorter.order === 'ascend' && sort !== 'ASC') {
        store.sort = 'ASC';
      }
      if (paginationInput?.current !== page) {
        store.page = paginationInput?.current;
      }
    },
    [sort, page],
  );

  const dataSource = useMemo(() => {
    return dataSourceStore;
  }, [dataSourceStore]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const columns = useColumns(sort);

  const [setSearchFilteredDebounce] = useDebouncedCallback((search) => {
    if (addressString !== search) {
      store.addressString = search;
      setSelectedRowKeys([]);
    }
  }, 500);

  const onSearchChange = useCallback((e) => {
    const search = e.target.value;
    const noneEmptyLowerSearch = search.trim().toLowerCase();
    setSearchFilteredDebounce(noneEmptyLowerSearch);
  }, []);

  const [setIdFilteredDebounce] = useDebouncedCallback((search) => {
    if (id !== search) {
      store.id = search;
      setSelectedRowKeys([]);
    }
  }, 500);

  const onIdChange = useCallback((e) => {
    const search = e.target.value;
    setIdFilteredDebounce(search);
  }, []);

  const onSelectChange = useCallback((selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  }, []);

  const handleChoose = useCallback(
    (e) => {
      e.preventDefault();
      if (!selectedRowKeys.length) {
        Ant.message.error('Выберите адрес');
        return;
      }
      const selected = selectedRowKeys.map((id) => store.getData(id));
      onChoose(selected);
    },
    [onChoose, selectedRowKeys],
  );

  useEffect(() => {
    store.fetch(client || '');
  }, [loaded, sort, client, addressString, page, id]);

  useEffect(() => {
    return () => {
      store.id = null;
      store.addressString = null;
      store.page = 1;
    };
  }, []);

  return (
    <div className={'address-favorite-choose-form'}>
      <div className={'address-favorite-choose-form__search-input flexbox'}>
        <Ant.Input
          style={{
            width: '50%',
            marginRight: '10px',
          }}
          allowClear={true}
          autoFocus={true}
          suffix={<Ant.Icon type="search" />}
          placeholder="ID Адреса Партнёра"
          onChange={onIdChange}
        />
        <Ant.Input
          allowClear={true}
          autoFocus={true}
          suffix={<Ant.Icon type="search" />}
          placeholder="Введите адрес"
          onChange={onSearchChange}
        />
      </div>

      <VzTable.Table
        {...{
          columns,
          rowSelection: {
            type: 'radio',
            selectedRowKeys,
            onChange: onSelectChange,
            hideDefaultSelections: true,
          },
          onChange: onChangeTable,
          dataSource,
          loading: !loaded || loading,
          rowKey: 'id',
          scroll: { x: 400, y: 400 },
          pagination: {
            total,
            pageSize: 100,
            current: page,
          },
          paginatorConfig: {
            total,
            itemsPerPage: 100,
          },
        }}
      />

      <div className={'address-favorite-choose-form__actions'}>
        {onCancel && <Ant.Button onClick={onCancel}>{t.order('cancel')}</Ant.Button>}

        {onChoose && (
          <Ant.Button onClick={handleChoose} type={'primary'}>
            {chooseText || 'Применить выбранный'}
          </Ant.Button>
        )}
      </div>
    </div>
  );
}

AddressFavoriteChooseForm.propTypes = {
  onCancel: PropTypes.func,
  onChoose: PropTypes.func,
  chooseText: PropTypes.string,
  selectedAddress: PropTypes.object,
  excludeAddresses: PropTypes.arrayOf(PropTypes.object),
};

export default observer(AddressFavoriteChooseForm);
