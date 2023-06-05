import React, { useState, useCallback, useMemo } from 'react';

const useRowSelection = () => {
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const onChange = useCallback((rows) => {
    setSelectedRows(rows);
  }, []);
  const rowSelection = useMemo(() => {
    if (!multiSelect) {
      return null;
    }
    return {
      type: 'checkbox',
      selectedRows,
      onChange,
      hideDefaultSelections: true,
    }
  }, [selectedRows, multiSelect]);

  return [rowSelection, multiSelect, setMultiSelect ];
}

export default useRowSelection;