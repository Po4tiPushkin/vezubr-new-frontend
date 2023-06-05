import React, { useState, useCallback } from 'react';
import { Ant, VzForm } from '@vezubr/elements';

const FieldEditor = (props) => {
  const { onSave, loading, id, onClose } = props;
  const [reason, setReason] = useState('');
  return (
    <div>
      <VzForm.Row>
        <VzForm.Col span={24}>
          <VzForm.Item label={'Причина отмены Заявки/Рейса'}>
            <Ant.Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </VzForm.Item>
        </VzForm.Col>
      </VzForm.Row>
      <div className='flexbox'>
        <Ant.Button
          type='primary'
          className='margin-top-35 margin-left-auto'
          loading={loading}
          onClick={() => { onSave({ reason }); onClose() }}
        >
          Сохранить
        </Ant.Button>
      </div>
    </div>
  )
}

export default FieldEditor;