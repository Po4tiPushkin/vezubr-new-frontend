import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { RouteContext } from './context';
import RouteTableRow from './routeTableRow';
import useColumns from './hooks/useColumns';

function RouteTable() {
  const { store } = React.useContext(RouteContext);
  const [columns, width] = useColumns();

  const components = {
    body: {
      row: RouteTableRow,
    },
  };

  return (
    <Ant.Table
      rowKey={'vehicleKey'}
      className={cn('tariff-table', { 'tariff-table--has-scale-error': store.getError('tariffScale') })}
      columns={columns}
      components={components}
      pagination={false}
      bordered={true}
      dataSource={store.dataSource}
      scroll={{ x: width }}
    />
  );
}

export default observer(RouteTable);
