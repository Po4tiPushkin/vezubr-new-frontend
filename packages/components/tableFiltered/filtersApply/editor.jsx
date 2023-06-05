import React, { useCallback, useState } from 'react';
import { Ant, VzForm, VzTable } from '@vezubr/elements';
import useColumns from './hooks/useColumns';

function FilterApplyEditor(props) {
  const {dataSource, onRemove, onApply, onUpdate, onDefault, defaultFilterId} = props;
  const [selectedRows, setSelectedRows] = useState([]);
  const onSelectChange = useCallback((selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  }, []);
  const [columns, width] = useColumns(dataSource, onRemove, onUpdate, onDefault, defaultFilterId);

  const otherProps = {
    rowSelection: {
      type: 'radio',
      selectedRows,
      onChange: onSelectChange,
      hideDefaultSelections: true,
    },
  }

  const handleApply = () => {
    if (selectedRows.length > 0) {
      onApply(selectedRows[0].uuid);
    }
  }

  return (
    <>
      <VzTable.Table
        {...otherProps}
        columns={columns}
        bordered={false}
        dataSource={dataSource}
        rowKey={'uuid'}
        pagination={false}
      />
      {selectedRows.length > 0 && (
        <VzForm.Actions>
          <Ant.Button type="primary" onClick={handleApply} className={'semi-wide margin-left-16 filters-apply__button-accept'}>
            Применить
          </Ant.Button>
        </VzForm.Actions>
      )}
    </>
  )
}

export default FilterApplyEditor;