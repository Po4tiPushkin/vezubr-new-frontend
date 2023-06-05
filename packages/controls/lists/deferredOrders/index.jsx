import React, {useCallback, useEffect, useState} from 'react';
import {bindActionCreators} from "redux";
import * as actions from "../../infrastructure/actions";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { Orders as OrdersService } from "@vezubr/services";
import {Ant, IconDeprecated, Modal, showAlert, showError, VzForm} from "@vezubr/elements";
import useParams from "@vezubr/common/hooks/useParams";
import { useHistory } from 'react-router-dom';
import moment from "moment";
import useColumns from "./hooks/useColumns";
import useColumnsGenerator from "@vezubr/components/tableConfig/hooks/useColumnsGenerator";
import useFiltersActions from "./hooks/useFiltersActions";
import csvRenderCols from "@vezubr/components/export/CSV/renderCols";
import {Filters} from "@vezubr/components/tableFiltered";
import {VzTableFiltered} from "@vezubr/components";
import ExportCSV from "@vezubr/components/export/CSV";
import TableConfig from "@vezubr/components/tableConfig";
import t from "@vezubr/common/localization";
import Utils from '@vezubr/common/common/utils';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = `deferred-orders-${APP}`;

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  if (paramsQuery.orderStatuses) {
    paramsQuery.orderStatuses = paramsQuery.orderStatuses.split(',').map((idString) => ~~idString);
  }

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page;
  }

  return paramsQuery;
};

function DeferredOrders(props) {
  const history = useHistory();
  const { location } = history
  const { dictionaries, selectionType = 'checkbox' } = props;

  const [params, pushParams] = useParams({
    history,
    location,
    paramsName: 'deferredOrders',
    paramsDefault: {
      toStartAtDateFrom: moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
      toStartAtDateTill: moment().endOf('day').format('YYYY-MM-DD'),
    },
  });

  const [visibleModal, setVisibleModal] = useState();

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);

  const oldColumns = useColumns({ dictionaries });
  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params);
    try {
      const { requests, itemsCount: total } = await OrdersService.getDeferredList({ ...paramsQuery });
      const dataSource = requests.map((item) => {
        return {
          ...item?.orders[0]
        }
      });

      setData({ dataSource: Utils.getIncrementingId(dataSource, paramsQuery?.page), total });

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

    const paramsQuery = getParamsQuery(params);

    const { requests } = await OrdersService.getDeferredList({ 
      ...paramsQuery,
      ...QUERY_DEFAULT,
      itemsPerPage: 10000,
      page: 1      
    });
    let dataSource = requests.map((item) => {
      return {
        ...item?.orders[0]
      }
    });

    dataSource = Utils.getIncrementingId(dataSource, 1)

    return csvRenderCols(dataSource, columns);

  }, [columns, params]);

  const confirmRemove = () => {
    setVisibleModal(true);
  }

  const removeSelected = async () => {
    const requests = selectedRows.map(item =>  item.requestId.toString());
    try {
      await OrdersService.cancelDeferredList({ requests });
      fetchData();
      setVisibleModal(false);
      showAlert({
        content: t.common('Рейсы удалены'),
        onOk: () => {},
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }

  const setToJob = async () => {
    const { requestId: request } = selectedRows[0];
    try {
      await OrdersService.publishDeferred({ request: request.toString() });
      fetchData();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }

  const [selectedRows, setSelectedRows] = useState([]);

  const onSelectChange = useCallback((selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  }, []);

  const filtersActions = useFiltersActions({
    setUseExport,
  });

  const handleCancelModal = () => {
    setVisibleModal(false);
  }

  return (
    <div className="orders-table-container">
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'deferredOrders',
          filtersActions,
          title: 'Отложенные рейсы',
        }}
      />
      <div className="flexbox align-center justify-right margin-bottom-20">
        <Ant.Button
          type={'primary'}
          disabled={
            selectedRows.length == 0
          }
          className={'margin-right-10'}
          onClick={setToJob}
        >
          Взять в работу
        </Ant.Button>
        <Ant.Button
          type={'primary'}
          disabled={selectedRows.length == 0}
          className={'margin-right-10'}
          onClick={confirmRemove}
        >
          Удалить
        </Ant.Button>
      </div>
      <VzTableFiltered.TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          rowSelection: {
            type: selectionType,
            selectedRows,
            onChange: onSelectChange,
            hideDefaultSelections: true,
          },
          dataSource,
          rowKey: 'orderId',
          scroll: { x: width, y: 550 },
          paramKeys,
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
        title={'Отложенные рейсы'}
        getDataFunc={getDataFuncForExport}
        filename={'Отложенные рейсы'}
      />
      <TableConfig
        tableKey={tableKey}
        onSave={fetchData}
      />
      <Modal
        title={'Внимание'}
        className={'order-general__modal--skip-address'}
        visible={visibleModal}
        centered={true}
        destroyOnClose={true}
        footer={null}
        width={350}
        onCancel={handleCancelModal}
      >
        Вы действительно хотите удалить выбранные рейсы из списка?
        <VzForm.Actions>
          <Ant.Button
            onClick={handleCancelModal}
            className={'semi-wide margin-left-16'}
            theme={'primary'}
          >
            Отмена
          </Ant.Button>
          <Ant.Button
            type="primary"
            onClick={removeSelected}
            className={'semi-wide margin-left-16'}
          >
            Подтвердить
          </Ant.Button>
        </VzForm.Actions>
      </Modal>
    </div>
  );
}

DeferredOrders.propTypes = {
  location: PropTypes.object,
  dictionaries: PropTypes.object,
  selectionType: PropTypes.string,
};

const mapStateToProps = (state) => {
  const { dictionaries} = state;
  return {
    dictionaries,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...actions.filters }, dispatch) };
};

DeferredOrders.contextTypes = {
  observer: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeferredOrders);