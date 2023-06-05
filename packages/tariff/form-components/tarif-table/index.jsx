import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant, VzTable } from '@vezubr/elements';
import { TariffContext } from '../../context';
import TariffTableRow from './TariffTableRow';

export const TariffTableConfigProps = PropTypes.shape({
  vehicleWidth: PropTypes.number,
  bodyTypesWidth: PropTypes.number,
  baseWorkWidth: PropTypes.number,
  serviceWidth: PropTypes.number,
});

export const TariffTableProps = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function TariffTable(props) {
  const { columns: columnsInput } = props;

  const { store } = React.useContext(TariffContext);

  const [columns, widthCalc] = React.useMemo(() => {
    const width = VzTable.Utils.columnsReduceWidth(columnsInput);
    const cols = VzTable.Utils.columnsDeleteLastWidth(columnsInput);
    return [cols, width];
  }, [columnsInput]);

  let width = widthCalc ? widthCalc : undefined;

  const components = {
    body: {
      row: TariffTableRow,
    },
  };
  return (
    <Ant.Table
      rowKey={store.type === 2 ? 'loaderKey' : 'vehicleKey'}
      className={cn('tariff-table', { 'tariff-table--has-scale-error': store.getError('tariffScale') })}
      columns={columns}
      components={components}
      pagination={false}
      bordered={true}
      dataSource={store.dataSource}
      scroll={{ x: true }}
    />
  );
}

TariffTable.propTypes = TariffTableProps;

export default observer(TariffTable);
