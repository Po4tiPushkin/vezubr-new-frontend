import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { CancellationReason as CancellationReasonService } from '@vezubr/services';
import useParamsState from '@vezubr/common/hooks/useParamsState';

import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import moment from 'moment';
import t from '@vezubr/common/localization';
import { showError, showAlert, Modal, showConfirm } from '@vezubr/elements';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import { camelCaseToSnakeCase } from "@vezubr/common/utils"
import FieldEditor from './modal';
import Utils from '@vezubr/common/common/utils';

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

  return paramsQuery;
};

const CancellationReasons = (props) => {
  const [params, pushParams] = useParamsState({ paramsDefault: QUERY_DEFAULT });
  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });
  const { dataSource, total } = data;
  const { itemsPerPage } = QUERY_DEFAULT;
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editableValue, setEditableValue] = useState(null);

  const getCancellationReasons = useCallback(async () => {
    try {
      setLoading(true);
      const paramsQuery = getParamsQuery(params);
      const response = await CancellationReasonService.list({...QUERY_DEFAULT, ...paramsQuery});
      const dataSource = response.cancellationReasons;
      const total = dataSource.itemsCount;
      setData({ dataSource, total });
    } catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false)
    }
  }, [params]);

  const onDelete = useCallback(async ({ id, reason }) => {
    try {
      showConfirm({
        content: 'Вы уверены?',
        title: `Удаление причины отказа "${reason}"`,
        onCancel: () => {
          return;
        },
        cancelText: 'Отмена',
        onOk: async () => {
          await CancellationReasonService.delete(id);
          getCancellationReasons();
        },
      })
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, []);

  const onCreate = useCallback(async (data) => {
    try {
      await CancellationReasonService.create(data);
      getCancellationReasons();
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getCancellationReasons();
  }, [params]);

  const onCloseModal = useCallback(() => {
    setEditableValue(null);
    setShowModal(false);
  }, [])

  const columns = useColumns({ onDelete })
  const filtersActions = useFiltersActions({ setShowModal })
  return (
    <>
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          showArrow: false,
          filterSetName: 'cancellation-reasons',
          filtersActions,
          title: 'Причины отмены Заявок/Рейсов',
          classNames: 'cancellation-reasons__settings'
        }}
      />
      <TableFiltered
        {...{
          params,
          pushParams,
          loading,
          columns,
          dataSource,
          rowKey: 'id',
          scroll: { x: 600, y: 550 },
          paramKeys,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
      <Modal
        onCancel={() => onCloseModal()}
        visible={showModal}
        footer={null}
        title={'Добавить новое значение'}
        width={400}
        centered={true}
        destroyOnClose={true}
      >
        <FieldEditor
          onClose={onCloseModal}
          onSave={onCreate}
        />
      </Modal>
    </>
  )
}

export default CancellationReasons;