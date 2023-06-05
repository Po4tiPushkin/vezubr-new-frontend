import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useRowClassName from './hooks/useRowClassName';
import { Filters, TableFiltered, useFooterOrderTotalsSoftProducer } from '@vezubr/components/tableFiltered';
import { connect, useSelector } from 'react-redux';
import { Registries as RegistriesService } from '@vezubr/services';
import { showAlert, showError } from "@vezubr/elements";
import useParams from '@vezubr/common/hooks/useParams';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import TableConfig from '@vezubr/components/tableConfig';
import { history } from '../../../../infrastructure';
import { Utils } from '@vezubr/common/common';
const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page
  };
  if (paramsQuery.contractId) {
    paramsQuery.contractId = +paramsQuery.contractId
  }
  if (paramsQuery.orderId) {
    paramsQuery.orderId = +paramsQuery.orderId
  }
  if (paramsQuery.orderType) {
    paramsQuery.orderType = +paramsQuery.orderType
  }
  if (paramsQuery.clientId) {
    paramsQuery.clientId = +paramsQuery.clientId
  }

  return paramsQuery
}

const tableKey = `producer-registries-create-${APP}`

function RegistryCreate(props) {

  const { dictionaries, isAdd = false, handleNewOrder = null, contractId = null, clientId = null, } = props;
  const { location } = history;
  const user = useSelector((state) => state.user);
  const [params, pushParams] = useParams({
    history,
    location,
    paramsDefault: {
      contractId: contractId,
      clientId: clientId,
    }
  });

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  if (handleNewOrder) { handleNewOrder(selectedRowKeys) };
  const [loadingAddCartulary, setLoadingAddCartulary] = useState(false);

  const onCreateCartulary = useCallback(async () => {
    setLoadingAddCartulary(true);
    try {
      const created = await RegistriesService.create({ orders: selectedRowKeys });
      setSelectedRowKeys([]);
      showAlert({
        content: `Реестр${created?.length > 1 ? 'ы' : ''} ${created.map((reg) => '№' + reg.number).join(', ')} был${created?.length > 1 ? 'и' : ''} успешно создан${created?.length > 1 ? 'ы' : ''}`,
        title: undefined,
        onOk: () => {
          history.replace(`/registries/${APP === 'dispatcher' ? 'producer/' : ''}${created?.[0]?.id}`);
        },
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setLoadingAddCartulary(false);
  }, [selectedRowKeys]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
      },
      selections: [
        {
          key: 'clear-all',
          text: 'Очистить',
          onSelect: () => {
            setSelectedRowKeys([]);
          },
        },
      ],
    }),
    [selectedRowKeys],
  );

  const oldColumns = useColumns(dictionaries, user);

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns)

  const filtersActions = useFiltersActions({
    dictionaries,
    selectedRowKeys,
    loadingAddCartulary,
    onCreateCartulary,
    setUseExport,
    isAdd,
  });

  const footer = useFooterOrderTotalsSoftProducer(dataSource, {
    costOrderKey: 'orderSum',
    costSoftKey: 'orderSoftwareSum',
  });

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const val = getParamsQuery(params);
      const response = await RegistriesService.getOrdersList({ ...QUERY_DEFAULT, ...val });

      const dataSource = Utils.getIncrementingId(response?.data, val?.page)
      const total = response?.count || dataSource.length;

      setData({ dataSource, total });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const getDataFuncForExport = useCallback(async () => {
    const response = await RegistriesService.getOrdersList({
      ...QUERY_DEFAULT,
      ...params,
      ...{ itemsPerPage: 100000, page: 1 },

    });

    const dataSource = response?.data || [];

    return csvRenderCols(dataSource, columns);
  }, [columns, params]);

  const rowClassName = useRowClassName();

  return (
    <div className="cartulary-table-container">
      <Filters
        {...{
          params,
          pushParams,
          filterSetName: 'cartulary',
          filtersActions,
          title: isAdd ? 'Добавление Рейса в Реестр' : 'Формирование реестра',
        }}
      />
      <TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowKey: 'orderId',
          scroll: { x: 2700, y: 500 },
          paramKeys,
          rowSelection,
          rowClassName,
          footer,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
      <ExportCSV
        useExport={useExport}
        onFinishFunc={() => setUseExport(false)}
        setLoadingStatusFunc={setLoadingData}
        title={'Формирование реестра'}
        getDataFunc={getDataFuncForExport}
        filename={'Формирование реестра'}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}
const mapStateToProps = (state, ownProps) => {
  let { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(RegistryCreate);
