import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { Unit as UnitService } from '@vezubr/services';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import { useSelector } from 'react-redux';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import { showError, showAlert, Modal, showConfirm } from '@vezubr/elements';
import FieldEditor from './modal';

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

const Units = (props) => {
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
  const user = useSelector(state => state.user);
  const getUnits = useCallback(async () => {
    try {
      setLoading(true);
      const paramsQuery = getParamsQuery(params);
      const response = await UnitService.list({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = response;
      const total = dataSource.length;
      setData({ dataSource, total });
    } catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false)
    }
  }, [params]);

  const onDelete = useCallback(async (id) => {
    try {
      showConfirm({
        content: 'Удалить подразделение?',
        title: 'Удаление подразделения',
        onCancel: () => {
          return;
        },
        cancelText: 'Отмена',
        className: 'vz-show-alert-modal',
        width: 800,
        onOk: async () => {
          await UnitService.delete(id);
          showAlert({ content: "Подразделение удалено" })
          getUnits();
        },
      })
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, []);

  const onEdit = useCallback(async (data) => {
    try {
      await UnitService.update(editableValue?.id, data);

      getUnits();
    } catch (e) {
      showError(e);
      console.error(e);
    }
    finally {
      setEditableValue(null);
    }
  }, [editableValue]);

  const onCreate = useCallback(async (data) => {
    try {
      await UnitService.create(data);
      showAlert({ content: 'Подразделение добавлено' });
      getUnits();
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, []);

  useEffect(() => {
    getUnits();
  }, [params]);

  const goToEdit = useCallback((data) => {
    setEditableValue(data);
    setShowModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setEditableValue(null);
    setShowModal(false);
  }, [])

  const columns = useColumns({ goToEdit, onDelete })
  const filtersActions = useFiltersActions({ setShowModal })
  return (
    <>
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          showArrow: false,
          filterSetName: 'units',
          filtersActions,
          title: 'Подразделения',
          classNames: 'units__settings'
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
          responsive: false,
        }}
      />
      <Modal
        onCancel={() => onCloseModal()}
        visible={showModal}
        footer={null}
        title={!!editableValue ? `Редактирование ${editableValue?.externalId}` : 'Добавить новое значение'}
        width={600}
        centered={true}
        destroyOnClose={true}
      >
        <FieldEditor
          onClose={onCloseModal}
          onSave={!!editableValue ? onEdit : onCreate}
          title={editableValue?.title}
          externalId={editableValue?.externalId} />
      </Modal>
    </>
  )
}

export default Units;