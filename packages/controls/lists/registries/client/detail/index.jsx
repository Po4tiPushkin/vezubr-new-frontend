import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { VzTableFiltered } from '@vezubr/components';
import useParams from '@vezubr/common/hooks/useParams';
import { showError } from '@vezubr/elements';
import AcceptRegistryAction from './actions/acceptRegistryAction';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import Utils from '@vezubr/common/common/utils';
import { history } from '../../../../infrastructure';
import useRowClassName from './hooks/useRowClassName';
import { Invoices as InvoicesService } from '@vezubr/services';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import OrderAccountingDocumentsAction from './actions/order-accounting-documents';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import TableConfig from '@vezubr/components/tableConfig';

const QUERY_DEFAULT = {
  /*  itemsPerPage: 100,*/
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = 'registry-detail-client'

function RegistryDetail(props) {

  const { match, location, dictionaries, user } = props;

  const [params, pushParams] = useParams({ history, location });

  const [updated, setUpdated] = useState(Date.now());
  const reload = useCallback(() => {
    setUpdated(Date.now);
  }, []);

  const [loadingData, setLoadingData] = useState(false);

  const [useExport, setUseExport] = useState(false);

  const registryId = useMemo(() => match.params.id, [match.params.id]);
  const backUrl = useMemo(() => location.state ? location?.state?.back?.pathname : '/registries', [])
  const [{ dataSource, registry, total, totalAccepted, hasRejectedOrders, isHasNoneResolve, canBeAccepted }, setData] = useState({
    dataSource: [],
    registry: null,
    total: 0,
    isHasNoneResolve: false,
    hasRejectedOrders: false,
    totalAccepted: 0,
    canBeAccepted: false
  });

  const goBack = useGoBack({ location, history, defaultUrl: '/registries' });

  const oldColumns = useColumns({ reload, dictionaries, user, hasRejectedOrders });

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns)

  const filtersActions = useFiltersActions({
    registry,
    registryId,
    setUseExport,
  });

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const response = await InvoicesService.info(registryId);

      const { orders = [], itemsCount, hasRejectedOrders, ...registry } = response || {};

      const dataSource = Utils.getIncrementingId(orders, 1)

      const total = itemsCount || dataSource.length;

      const isHasNoneResolve = dataSource.some(({ accepted }) => typeof accepted !== "boolean");
      const totalAccepted = (dataSource.filter(({ accepted }) => accepted)).length
      const canBeAccepted = dataSource.every(({ accepted, acceptingAvailable }) => accepted || acceptingAvailable);

      setData({ dataSource, registry, total, totalAccepted, hasRejectedOrders, isHasNoneResolve, canBeAccepted });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, [params, registryId, updated]);

  const getDataFuncForExport = useCallback(async () => {
    const response = await InvoicesService.info(registryId);

    return csvRenderCols(response?.orders || [], columns);
  }, [params, registryId, columns]);

  const itemsPerPage = total;

  const title = `Реестр от Подрядчика № ${registry?.number}`;

  const rowClassName = useRowClassName({ hasRejectedOrders });

  const registryNumber = React.useMemo(() => registry?.number, [registry])

  return (
    <div className="registry-detail-table-container">
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          filterSetName: 'RegistryDetail',
          filtersActions,
          title,
          goBack: () => history.push(backUrl),
        }}
      />

      <AcceptRegistryAction
        reload={reload}
        count={total}
        countAccepted={totalAccepted}
        isHasNoneResolve={isHasNoneResolve}
        hasRejectedOrders={hasRejectedOrders}
        registryId={registryId}
        registryNumber={registryNumber}
        canBeAccepted={canBeAccepted}
      />

      <VzTableFiltered.TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowKey: 'number',
          scroll: { x: width, y: '50vh' },
          paramKeys,
          rowClassName,
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
        title={title}
        getDataFunc={getDataFuncForExport}
        filename={title}
      />

      <OrderAccountingDocumentsAction
        editable={false}
        docs={registry}
        accepted={registry?.allOrdersAccepted}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
}

RegistryDetail.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { dictionaries, user } = state;
  return {
    dictionaries,
    user
  };
};

export default connect(mapStateToProps)(RegistryDetail);
