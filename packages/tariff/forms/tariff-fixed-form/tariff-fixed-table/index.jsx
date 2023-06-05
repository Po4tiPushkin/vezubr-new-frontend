import React from 'react';
import PropTypes from 'prop-types';
import useColumnVehicle from '../../../hooks/columns/useColumnVehicle';
import useColumnBodyType from '../../../hooks/columns/useColumnBodyType';
import useColumnService from '../../../hooks/columns/useColumnService';
import TariffTable, { TariffTableConfigProps } from '../../../form-components/tarif-table';
import useColumnsMainService from '../../../hooks/columns/useColumnsMainService';
import useColumnsParam from '../../../hooks/columns/useColumnParam';

function TariffFixedTable(props) {
  const { tableConfig, client } = props;

  const columnVehicle = useColumnVehicle({ tableConfig });
  const columnBodyType = useColumnBodyType({ tableConfig });
  const columnsMainService = useColumnsMainService({ tableConfig, client });
  const columnParam = useColumnsParam({ tableConfig })
  const columnService = useColumnService({ tableConfig, client });

  const columns = [columnVehicle, columnBodyType, ...columnsMainService, ...columnParam, columnService];

  return <TariffTable columns={columns} />;
}

TariffFixedTable.propTypes = {
  tableConfig: TariffTableConfigProps,
};

export default TariffFixedTable;
