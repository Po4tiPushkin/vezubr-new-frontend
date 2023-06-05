import React, { useState, useCallback } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import t from '@vezubr/common/localization';
const FieldEditor = (props) => {
  const { onSave, loading, title: titleInput, externalId: externalIdInput, id, onClose } = props;
  const [title, setTitle] = useState(titleInput || '');
  const [externalId, setExternalId] = useState(externalIdInput || '');

  const onSubmit = useCallback(() => {
    if (!title) {
      Ant.message.error(t.error('formError'));
      return
    }
    onSave({ title, externalId });
    onClose();
  }, [title, externalId, onClose, onSave])
  return (
    <div>
      <VzForm.Row>
        <VzForm.Col span={12}>
          <VzForm.Item required={true} error={title ? false : 'Обязательное поле'} label={'Название'}>
            <Ant.Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={12}>
          <VzForm.Item label={'Идентификатор в системе'}>
            <Ant.Input value={externalId} onChange={(e) => setExternalId(e.target.value)} />
          </VzForm.Item>
        </VzForm.Col>
      </VzForm.Row>
      <div className='flexbox'>
        <Ant.Button
          type='primary'
          className='margin-top-35 margin-left-auto'
          loading={loading}
          onClick={() => onSubmit()}
        >
          Сохранить
        </Ant.Button>
      </div>
    </div>
  )
}

export default FieldEditor;