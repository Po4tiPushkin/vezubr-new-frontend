import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Filters, TableFiltered, useFooterOrderTotalsSoftProducer } from '@vezubr/components/tableFiltered';
import { connect } from 'react-redux';
import { Registries as RegistriesService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';
import { showAlert, showError } from '@vezubr/elements';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import { Modal } from '@vezubr/elements/antd';
import { Ant, Modal as ModalWindow } from '@vezubr/elements';
const { confirm } = Modal;
import useRowClassName from './hooks/useRowClassName';
import disband from './store/disband';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import OrderAccountingDocumentsAction from './actions/order-accounting-documents';
import CreateRegistry from './../create';
import Utils from '@vezubr/common/common/utils';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};
const tableKey = `producer-registries-detail-${APP}`

function RegistryDetail(props) {
  const { match, location, useReform, history, openAdd, dictionaries, user } = props;
  const [params, pushParams] = useParams({ history, location });
  const [mastFetchData, setMastFetchData] = useState(Date.now());
  const backUrl = useMemo(() => (
    location.state ? location?.state?.back?.pathname :
      APP === 'dispatcher'
        ?
        '/registries/producer'
        :
        '/registries'
  ), []);
  const [showRemove, setShowRemove] = useState(false);

  const [loadingData, setLoadingData] = useState(false);

  const [useExport, setUseExport] = useState(false);

  const registryId = useMemo(() => match.params.id, [match.params.id]);

  const [showAdd, setShowAdd] = useState(false);
  const [newOrders, setNewOrders] = useState([]);

  const [{ dataSource, total }, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const [registry, setRegistry] = useState(null);

  const goBack = useGoBack({ location, history, defaultUrl: backUrl });

  const showConfirm = () => {
    confirm({
      title: 'Вы уверены, что хотите расформировать реестр?',
      async onOk() {
        const orders = dataSource.map((e) => e.orderId);
        try {
          await RegistriesService.reform({ id: registryId, orders });
          showAlert({
            content: `Реестр был успешно расформирован`,
            title: undefined,
            onOk: () => {
              goBack();
            },
          });
        } catch (e) {
          console.error(e);
          showError(e);
        }
      },
      onCancel() { },
    });
  };

  const columns = useColumns(dictionaries, user, registry?.costVatRate, registry?.hasRejectedOrders);

  const filtersActions = useFiltersActions({
    setRegistry,
    registry,
    registryId,
    setUseExport,
    useReform,
    onDisbandRegistry: () => showConfirm(),
    dataSource,
  });

  const uploadDoc = useCallback(
    async (docSaving, docInfo) => {
      const response = await RegistriesService.attachFiles({
        id: registryId,
        type: docInfo.type,
        file: docSaving,
      });

      const file = response?.data?.file;

      setRegistry({ ...registry, [docInfo.key]: file });

      return file;
    },
    [registryId, registry],
  );

  useEffect(() => {
    disband.clear();

    (async () => {
      setLoadingData(true);
      try {
        const response = await RegistriesService.getRegistriesDetails(registryId);
        if (!response?.orders?.length) {
          goBack();
        }
        const dataSource = Utils.getIncrementingId(response?.orders, 1)
        const total = response?.ordersCount || dataSource.length;
        const registry = response?.registry || null;
        setData({ dataSource, total });
        setRegistry(registry);
      } catch (e) {
        console.error(e);
        showError(e);
      }
      setLoadingData(false);
    })();
  }, [params, registryId, mastFetchData]);

  const getDataFuncForExport = useCallback(async () => {
    const response = await RegistriesService.getRegistriesDetails(registryId);

    const dataSource = response?.orders || [];

    return csvRenderCols(dataSource, columns);
  }, [params, registryId, mastFetchData]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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

  const handleRemoveOrders = useCallback(async () => {
    try {
      const response = await RegistriesService.removeOrders({
        id: registryId,
        orders: selectedRowKeys.map((el) => String(el)),
      });
      setShowRemove(false);
      setSelectedRowKeys([]);
      setMastFetchData(Date.now());
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [registryId, registry, selectedRowKeys, rowSelection]);

  const handleNewOrder = (newOrders) => {
    setNewOrders(newOrders);
  };

  const closeAdd = () => {
    setShowAdd(false);
  };
  const handleAddOrders = useCallback(async () => {
    try {
      const response = await RegistriesService.addOrders({ id: registryId, orders: newOrders.map(el => String(el)) });
      setShowAdd(false);
      setNewOrders([]);
      setMastFetchData(Date.now());
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [registryId, registry, newOrders]);

  const showRemoveHandler = () => {
    setShowRemove(true);
  };

  const { itemsPerPage } = QUERY_DEFAULT;

  const title = `Реестр для Заказчика` + (registry ? ` № ${registry?.number || 'undefined'} / ${registry.clientTitle}` : '');

  const footer = useFooterOrderTotalsSoftProducer(dataSource, { costOrderKey: 'cost', costSoftKey: 'feeInCoins' });

  const rowClassName = useRowClassName({ hasRejectedOrders: registry?.hasRejectedOrders });

  return (
    <>
      <div className="registry-detail-table-container">
        <Filters
          {...{
            params,
            pushParams,
            filterSetName: 'RegistryDetail',
            filtersActions,
            title,
            goBack: () => history.push(backUrl),
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
            rowSelection: showRemove ? rowSelection : undefined,
            scroll: { x: 2000, y: 500 },
            paramKeys,
            footer,
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
          editable={true}
          docs={registry}
          accepted={registry?.allOrdersAccepted}
          uploadDoc={uploadDoc}
        />
        <ModalWindow
          cancelButtonProps={{ disabled: !newOrders.length, id: 'registry-addorders-cancel' }}
          okText={'Добавить в Реестр'}
          okButtonProps={{ disabled: !newOrders.length, id: 'registry-addorders-add' }}
          children={
            <CreateRegistry
              handleNewOrder={handleNewOrder}
              isAdd={true}
              location={location}
              clientId={registry?.clientId}
              contractId={dataSource[0]?.contractId}
            />
          }
          onOk={() => handleAddOrders()}
          width={1600}
          visible={showAdd}
          onCancel={() => closeAdd()}
        />

        <div className="registry__detail-actions">
          {!showRemove ? (
            <>
              <Ant.Button id={'registry-addorders'} onClick={() => setShowAdd(true)}>Добавить рейсы</Ant.Button>
              <Ant.Button id={'registry-removeorders'} onClick={() => showRemoveHandler()}>Удалить рейсы</Ant.Button>
            </>
          ) : (
            <>
              <Ant.Button id={'registry-cancel'} onClick={() => setShowRemove(false)}>Отмена</Ant.Button>
              <Ant.Button
                id={'registry-removeorders-remove'}
                disabled={!selectedRowKeys.length}
                onClick={() => handleRemoveOrders()}
              >
                Удалить рейсы
              </Ant.Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

RegistryDetail.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = (state) => {
  let { dictionaries, user } = state;

  return {
    dictionaries,
    user,
  };
};

export default connect(mapStateToProps)(RegistryDetail);
