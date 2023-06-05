import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Orders from './orders';
import { Ant } from '@vezubr/elements';
import _isEqual from 'lodash/isEqual'
const BindOrdersModal = (props) => {
  const { onSave, onCancel, defaultRows = [] } = props;
  const [selectedRows, setSelectedRows] = useState(defaultRows.map(el => el.orderId));
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel()
    }
  }, []);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(selectedRows);
    }
  }, [selectedRows])

  return (
    <Ant.Modal
      width={'80vw'}
      visible={true}
      destroyOnClose={true}
      onCancel={() => handleCancel()}
      footer={[
        <Ant.Button onClick={handleCancel}>Отмена</Ant.Button>,
        <Ant.Button
          onClick={handleSave}
          disabled={_isEqual(selectedRows, defaultRows.map(el => el.id))}
          type={'primary'}
        >
          Связать Рейсы
        </Ant.Button>
      ]}
    >
      <Orders selectedRows={selectedRows} setSelectedRows={setSelectedRows} />
    </Ant.Modal>
  )
}

export default BindOrdersModal;