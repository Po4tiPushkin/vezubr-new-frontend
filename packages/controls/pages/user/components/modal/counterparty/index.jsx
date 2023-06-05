import React, { useState, useEffect, useMemo } from 'react';
import { Contractor as ContractorService } from '@vezubr/services';
import { VzTableFiltered } from "@vezubr/components";
import { useSelector } from 'react-redux';
import useParams from "@vezubr/common/hooks/useParamsState";
import Utils from '@vezubr/common/common/utils'
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import { showError, Ant } from '@vezubr/elements';
const COUNTERPARTY_TYPES = {
  CLIENT: 'client',
  PRODUCER: 'producer'
}

const QUERY_DEFAULT = {
  itemsPerPage: 100
}

const paramKeys = {
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
  page: 'page',
};

const getParamsQuery = (params) => {
  if (params.page) {
    params.page = +params.page
  }
  return params;
};

const ProfileUserCounterpartyList = (props) => {
  const { onSave, onCancel, data = [] } = props;
  const dictionaries = useSelector(state => state.dictionaries);
  const [counterpartyType, setCounterpartyType] = useState(COUNTERPARTY_TYPES.CLIENT);

  const tabs = useMemo(() => [
    {
      id: COUNTERPARTY_TYPES.CLIENT,
      title: 'Заказчики',
      active: counterpartyType === COUNTERPARTY_TYPES.CLIENT,
    },
    {
      id: COUNTERPARTY_TYPES.PRODUCER,
      title: 'Подрядчики',
      active: counterpartyType === COUNTERPARTY_TYPES.PRODUCER,
    }
  ], [counterpartyType]);

  const onTypeChange = (newType) => {
    setCounterpartyType(newType);
    setSelectedRowKeys([]);
  }

  const renderTabs = useMemo(() => {
    const t = tabs.map((val) => (
      <a
        className={`vz-tab ${val.active ? 'active' : ''}`}
        key={val.id}
        onClick={(e) => { e.preventDefault(); onTypeChange(val.id) }}
      >
        {val.title}
      </a>
    ));
    return <div className={'vz-tabs'}>{t}</div>;
  }, [tabs]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [{ dataSource, total }, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const [params, pushParams] = useParams({
    paramsDefault: {},
  });

  const fetchCounterparty = async () => {
    try {
      setLoading(true);
      const paramsQuery = getParamsQuery(params);
      const response = await ContractorService[`${counterpartyType}List`]({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource =
        Utils.getIncrementingId(response.data.filter(el => !data.includes(el.id)), paramsQuery.page)
      setData({ dataSource, total: response.count });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    finally {
      setLoading(false)
    }
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(selectedRowKeys);
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const columns = useColumns({ dictionaries });

  useEffect(() => {
    fetchCounterparty();
  }, [params, counterpartyType]);

  const filtersActions = useFiltersActions();

  return (
    <div>
      <div>
        {renderTabs}
      </div>
      <div className='orders-table-container'>
        <VzTableFiltered.Filters
          {...{
            params,
            pushParams,
            paramKeys,
            showArrow: false,
            filtersActions,
            title: 'Список Контрагентов',
          }}
        />
        <VzTableFiltered.TableFiltered
          {...{
            params,
            pushParams,
            loading,
            columns,
            dataSource,
            rowKey: 'id',
            paramKeys,
            paginatorConfig: {
              total,
              itemsPerPage: QUERY_DEFAULT.itemsPerPage,
            },
            scroll: { x: true, y: 450 },
            rowSelection
          }}
        />
      </div>
      <div className='user-contractors__actions'>
        <Ant.Button onClick={handleCancel}>
          Отмена
        </Ant.Button>
        <Ant.Button onClick={handleSubmit}>
          Подтвердить
        </Ant.Button>
      </div>
    </div>

  )
}

export default ProfileUserCounterpartyList;