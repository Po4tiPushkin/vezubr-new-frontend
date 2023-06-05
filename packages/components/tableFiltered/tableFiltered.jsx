import React, { useCallback, useMemo, useEffect } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { VzTable } from '@vezubr/elements';
import { Resizable } from 'react-resizable'
import { setColumnsWidth } from './utils';

const DEFAULT_PARAM_KEYS = {
  orderBy: 'orderBy',
  orderDirection: 'orderDirection'
}

const ResizeableTitle = (props) => {
  const { onResize, onResizeStop, width, ...restProps } = props;

  return (
    <Resizable
      width={width || 150}
      height={0}
      onResize={onResize}
      minConstraints={[75, 0]}
      maxConstraints={[450, 0]}
      onResizeStop={onResizeStop}
    >
      <th {...restProps} />
    </Resizable>
  );
}

function TableFiltered(props, context) {
  const {
    paramKeys: paramKeysInput,
    params,
    pushParams,
    className: classNameInput,
    total,
    columns: columnsInput,
    paginatorConfig,
    tableKey,
    responsive = true,
    ...otherProps
  } = props;

  const [columns, setColumns] = React.useState(columnsInput)


  useEffect(() => {
    setColumns(() => columnsInput)
  }, [columnsInput])

  React.useEffect(() => {
    [...document.getElementsByClassName('react-resizable-handle')].forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation()
      })
    })
    return () => {
      [...document.getElementsByClassName('react-resizable-handle')].forEach((item) => {
        item.removeEventListener('click', (e) => {
          e.stopPropagation()
        })
      })
    }
  }, [])
  

  const handleResize = React.useCallback(index => (e, { size }) => {
    setColumns((prev) => {
      const nextColumns = [...prev];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return nextColumns;
    });
  }, [columns]);

  const refreshColumnsWidth = React.useCallback(async () => {
    await setColumnsWidth(tableKey, columns)
  }, [columns])

  const onResizeStop = React.useCallback(() => {
    refreshColumnsWidth()
  }, [columns])

  const heightOfTable = () => {
    let filters = document.getElementsByClassName('table-filters');
    let filtersHeight = filters[0]?.clientHeight;

    /***
     * Расчет адаптивной высоты таблицы исходя из остальных параметров страницы и других элементов на странице
     * 
     * 41 - высота возможного футера таблицы
     * 48 - вертикальные марджины вокруг фильтров и пагинации
     * 46 - высота хэдера таблицы
     * 32 - высота самой пагинации
     * 60 - высота topNav
     */
    return (Math.max((window.innerHeight - filtersHeight - (otherProps.footer ? 41 : 0) - 48 - 46 - 32 - 60), 440) / window.innerHeight) * 100 + 'vh'
  }

  const paramKeys = {
    ...DEFAULT_PARAM_KEYS,
    ...paramKeysInput
  }

  const orderBy = params?.[paramKeys['orderBy']];
  const orderDirection = params?.[paramKeys['orderDirection']];

  React.useEffect(() => {
    setColumns(columns.map((col) => {
      if (col.sorter) {
        const sortOrder =
          orderBy === col.key && orderDirection ? (orderDirection === 'ASC' ? 'ascend' : 'descend') : false;
        return {
          ...col,
          sortOrder,
        };
      }
      return col;
    }))
  }, [orderDirection, orderBy])

  const onTableChange = useCallback(
    (pagination, filters, sorter) => {
      if (!paramKeys) {
        return;
      }
      const { current } = pagination;

      const { order, columnKey } = sorter;

      const direction = order ? (order === 'ascend' ? 'ASC' : 'DESC') : null;

      pushParams({
        ...params,
        ...(paramKeys['page'] ? { [paramKeys['page']]: current } : {}),
        ...(paramKeys['orderBy'] ? { [paramKeys['orderBy']]: columnKey } : {}),
        ...(paramKeys['orderDirection'] ? { [paramKeys['orderDirection']]: direction } : {}),
      });
    },
    [paramKeys, params],
  );

  const pagination = useMemo(() => {
    if (paginatorConfig) {
      const { total, itemsPerPage, local = false } = paginatorConfig;

      if (local) {
        return {
          position: 'bottom',
          pageSize: itemsPerPage,
        }
      }

      const pageInput = params[paramKeys['page']];
      const current = pageInput && parseInt(pageInput, 10);

      return {
        position: 'bottom',
        total,
        current,
        pageSize: itemsPerPage,
        showTotal: (total, range) => {
          if (total < itemsPerPage) {
            return `${total} строк`;
          }
          return `${range[0]} - ${range[1]} из ${total} строк`;
        },
      };
    }

    return false;
  }, [paginatorConfig?.total, paginatorConfig?.itemsPerPage, params?.[paramKeys?.['page']]]);

  const className = cn('vz-table-filtered', classNameInput);

  const renderColumns = React.useMemo(() => {
    return columns.filter((item) => {
      return !!(item.title || item.key || item.dataIndex)
    }).map((col, index) => ({
      ...col,
      sorter: col.key == 'number' ? false : col.sorter,
      onHeaderCell: column => ({ 
        width: column.width,
        onResize: handleResize(index),
        onResizeStop: onResizeStop
      })
    }));
  }, [columns])

  return (
    <VzTable.Table
      pagination={pagination}
      onChange={onTableChange}
      columns={renderColumns}
      {...otherProps}
      className={className}
      components={{
        header: {
          cell: ResizeableTitle
        }
      }}
      scroll={{
        ...(otherProps.scroll || {}),
        y: responsive ? heightOfTable() : otherProps.scroll?.y || null
      }}
    />
  );
}

TableFiltered.propTypes = {
  ...VzTable.Table.propTypes,
  params: PropTypes.object,
  pushParams: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.object),
  paramKeys: PropTypes.shape({
    page: PropTypes.string,
    orderBy: PropTypes.string,
    orderDirection: PropTypes.string,
  }),
  paginatorConfig: PropTypes.shape({
    total: PropTypes.number,
    itemsPerPage: PropTypes.number,
  }),
};

TableFiltered.contextTypes = {
  observer: PropTypes.object,
  history: PropTypes.object,
};

export default TableFiltered;
