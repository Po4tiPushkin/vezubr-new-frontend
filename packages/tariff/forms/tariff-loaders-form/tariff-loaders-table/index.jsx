import React from 'react';

import TariffTable, { TariffTableConfigProps } from '../../../form-components/tarif-table';
import useColumnLoader from '../../../hooks/columns/useColumnLoader';
import useColumnLoaderBaseWork from '../../../hooks/columns/useColumnLoaderBaseWork';
import useColumnLoaderService from '../../../hooks/columns/useColumnLoaderService';
import useColumnLoaderMainService from '../../../hooks/columns/useColumnLoaderMainService';
import useColumnDistance from '../../../hooks/columns/useColumnDistance';
function TariffLoadersTable(props) {
  const { tableConfig } = props;

  const columnsMainService = useColumnLoaderMainService({ tableConfig });
  const columnBaseWork = useColumnLoaderBaseWork({ tableConfig });
  const columnLoader = useColumnLoader({ tableConfig });
  // const columnServices = useColumnLoaderService({ tableConfig });
  const columnDistance = useColumnDistance({ tableConfig })
  const columns = [
    columnLoader,
    columnBaseWork,
    ...columnsMainService,
    columnDistance,
    // columnServices
  ];

  return <TariffTable columns={columns} />;
}

export default TariffLoadersTable;
