import React, { useState, useCallback, useMemo } from 'react';
import { Ant, VzForm, Modal } from '@vezubr/elements';
import { useSelector } from 'react-redux';
const CancelModal = (props) => {
  const { onSave, onCancel } = props;
  const [value, setValue] = useState(null);
  const { declineReasonManual } = useSelector(state => state.dictionaries);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(value);
    }
  }, [onSave, value]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel])

  const cachedReasons = useMemo(() => {
    const cancelReasonsStorage = localStorage.getItem('executionCancelReasons') ?
      JSON.parse(localStorage.getItem('executionCancelReasons'))
      :
      [];
    return cancelReasonsStorage.filter(el => el);
  }, []);

  const declineReasonsProducerOptions = useMemo(() => (
    declineReasonManual.filter(el => el.value !== 'manual_canceled').map(el => (
      <Ant.Select.Option value={el.id} key={el.id}>
        {el.title}
      </Ant.Select.Option>
    ))
  ), [])

  return (
    <Modal
      width={600}
      visible={true}
      destroyOnClose={true}
      onCancel={() => handleCancel()}
      footer={[
        <Ant.Button onClick={handleCancel}>Отмена</Ant.Button>,
        <Ant.Button
          onClick={handleSave}
          type={'primary'}
        >
          Отменить исполнение
        </Ant.Button>
      ]}
      title={"Отмена исполнения"}
    >
      <VzForm.Row>
        <VzForm.Col span={24}>
          <VzForm.Item label={"Причина отмены исполнения"}>
            {
              <Ant.Select value={value} onChange={(e) => setValue(e)}>
                {declineReasonsProducerOptions}
              </Ant.Select>
              // <Ant.AutoComplete
              //   defaultActiveFirstOption={false}
              //   value={value}
              //   onChange={(e) => setValue(e)}
              //   dataSource={cachedReasons}>
              //   <Ant.Input.TextArea />
              // </Ant.AutoComplete>
            }
          </VzForm.Item>
        </VzForm.Col>
      </VzForm.Row>
    </Modal>

  )
}

export default CancelModal;