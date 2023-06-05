import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { TableFiltered } from '../../../tableFiltered';
import { connect } from 'react-redux';

import useColumns from './hooks/useColumns';
import useRowClassName from './hooks/useRowClassName';
import useParams from '@vezubr/common/hooks/useParams';

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

function Table(props, context) {
  const { dictionaries, orders, handleChange, renderBitmapIconTruck } = props;
  const { history } = context;

  const location = history.location;

  const [data, setData] = useState({
    dataSource: [],
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { dataSource } = data;

  const [params, pushParams] = useParams({ history, location });
  const [columns, width] = useColumns({ dictionaries, renderBitmapIconTruck });

  useEffect(() => {
    setData({ dataSource: orders });
  }, [orders]);

  const rowClassName = useRowClassName();

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
        handleChange(selectedRowKeys);
      },
      selections: [
        {
          key: 'clear-all',
          text: 'Очистить',
          onSelect: () => {
            setSelectedRowKeys([]);
            handleChange([]);
          },
        },
      ],
    }),
    [selectedRowKeys],
  );

  return (
    <div className="orders-table-container">
      <TableFiltered
        {...{
          params,
          pushParams,
          columns,
          dataSource,
          rowKey: 'orderId',
          rowClassName,
          scroll: { x: width, y: 550 },
          paramKeys,
          rowSelection,
          responsive: false,
        }}
      />
    </div>
  );
}

Table.propTypes = {
  match: PropTypes.object,
  journalTypes: PropTypes.object,
  dictionaries: PropTypes.object,
  orders: PropTypes.array,
  handleChange: PropTypes.any,
  renderBitmapIconTruck: PropTypes.func.isRequired,
};

Table.contextTypes = {
  history: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  let { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(Table);
