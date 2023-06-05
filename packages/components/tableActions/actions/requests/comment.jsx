import { Ant, Modal, showError, VzForm } from '@vezubr/elements';
import { Orders as OrdersService } from '@vezubr/services';
import React, { useCallback, useState } from 'react';
const CommentRequest = (props) => {
  const { record, reload } = props;
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');

  const addComment = useCallback(async () => {
    setLoading(true)
    try {
      await OrdersService.addComment(record?.orderId, { text: comment })
      setLoading(false);
      setComment('');
      setShowModal(false);
      reload();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [comment, record])
  return (
    <>
      <Ant.Button loading={loading} size="small" type={'outlined'} onClick={() => setShowModal(true)}>
        Внутренний комментарий
      </Ant.Button>
      <Modal
        visible={showModal}
        width={500}
        onCancel={() => setShowModal(false)}
        onOk={addComment}
      >
        <VzForm.Col span={24}>
          <VzForm.Item label={'Внутренний комментарий'}>
            <Ant.Input.TextArea value={comment} onChange={(e) => setComment(e.target.value)} />
          </VzForm.Item>
        </VzForm.Col>
      </Modal>
    </>
  )
}

export default CommentRequest;