import React from 'react';
import PropTypes from 'prop-types';
import { Ant, VzTable, Loader } from '@vezubr/elements';
import TariffHourlyTableExpand from '../../components/tariff-hourly-table-expand';
import TariffFixedTableExpand from '../../components/tariff-fixed-table-expand';
import TariffLoadersTableExpand from '../../components/tariff-loaders-table-expand';
import t from '@vezubr/common/localization';
import useColumns from './hooks/useColumns';
import { useSelector } from 'react-redux';
import { VzTableFiltered } from '@vezubr/components';
import useFiltersActions from './hooks/useFiltersActions';
function TariffChooseTariffsForm(props) {
  const {
    dataSource,
    loading,
    onCancel,
    onSave,
    saving,
    canceling,
    saveText,
    tariffs = [],
    selectionType = 'checkbox',
    customButton,
    params,
    pushParams
  } = props;
  const user = useSelector((state) => state.user);
  const dictionaries = useSelector(state => state.dictionaries);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState(tariffs);

  const { territories, tariffTypes } = dictionaries;

  const columns = useColumns({ territories, tariffTypes });

  const onSelectChange = React.useCallback((selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  }, []);

  //TODO disable designated checkboxes
  const rowSelectionGetCheckboxProps = React.useCallback(
    (record) => {
      return {
        disabled: tariffs.includes(record.id),
      };
    },
    [selectedRowKeys, tariffs],
  );

  const handleSave = React.useCallback(
    (e) => {
      e.preventDefault();
      if (!selectedRowKeys.length) {
        Ant.message.error('Выберите тариф');
        return;
      }
      onSave(selectedRowKeys);
    },
    [onSave, selectedRowKeys],
  );

  const expandedRowRender = React.useCallback(
    (record) => {
      if (record.orderType === 'loaders_order') {
        return <TariffLoadersTableExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
      }
      else
        if (record.type === 1) {
          return <TariffHourlyTableExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
        } else if (record.type === 3) {
          return <TariffFixedTableExpand costWithVat={user?.costWithVat} tariff={record} editable={false} dictionaries={dictionaries} />;
        }

      return null;
    },
    [dictionaries],
  );

  const filtersActions = useFiltersActions();

  return (
    <div className={'tariff-choose-tariffs-form'}>
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          filterSetName: 'tariffs',
          filtersActions,
          title: 'Тарифы',
          showArrow: false
        }}
      />
      <VzTable.Table
        {...{
          columns,
          rowSelection: {
            type: selectionType,
            selectedRowKeys,
            getCheckboxProps: rowSelectionGetCheckboxProps,
            onChange: onSelectChange,
            hideDefaultSelections: true,
          },
          loading,
          expandedRowRender,
          dataSource,
          rowKey: 'id',
          scroll: { x: 1100, y: 300 },
          pagination: false,
        }}
      />

      <div className="tariff-choose-tariffs-form__button-group">
        {customButton && customButton}

        <div className={'tariff-choose-tariffs-form__actions'}>
          {onCancel && (
            <Ant.Button onClick={onCancel} loading={canceling}>
              {t.order('cancel')}
            </Ant.Button>
          )}

          {onSave && (
            <Ant.Button onClick={handleSave} type={'primary'} loading={saving}>
              {saveText || 'Сохранить'}
            </Ant.Button>
          )}
        </div>
      </div>

      {(loading || saving || canceling) && <Loader />}
    </div>
  );
}

export default TariffChooseTariffsForm;
