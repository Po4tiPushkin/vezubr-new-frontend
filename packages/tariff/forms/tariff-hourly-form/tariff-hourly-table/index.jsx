import React from 'react';
import PropTypes from 'prop-types';
import useColumnVehicle from '../../../hooks/columns/useColumnVehicle';
import useColumnBodyType from '../../../hooks/columns/useColumnBodyType';
import useColumnBaseWork from '../../../hooks/columns/useColumnBaseWork';
import useColumnService from '../../../hooks/columns/useColumnService';
import TariffTable, { TariffTableConfigProps } from '../../../form-components/tarif-table';
import useColumnsMainService from '../../../hooks/columns/useColumnsMainService';

function TariffHourlyTable(props) {
  const { tableConfig, client } = props;

  const columnVehicle = useColumnVehicle({ tableConfig });
  const columnBodyType = useColumnBodyType({ tableConfig }); 
  const columnsMainService = useColumnsMainService({ tableConfig, client });
  const columnBaseWork = useColumnBaseWork({ tableConfig, client });
  const columnService = useColumnService({ tableConfig, client });

  const columns = [columnVehicle, columnBodyType, ...columnsMainService, columnBaseWork, columnService];

  return <TariffTable columns={columns} />;
}

TariffHourlyTable.propTypes = {
  tableConfig: TariffTableConfigProps,
};

export default TariffHourlyTable;
