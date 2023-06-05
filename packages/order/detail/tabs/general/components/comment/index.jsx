import React, { useMemo, useState, useCallback, useContext } from 'react';
import { Comments, Ant, VzForm, showError } from '@vezubr/elements';
import { Orders as OrderService } from '@vezubr/services';
import OrderViewContext from '../../../../context';

const OrderViewGeneralComment = () => {

  const { order, reload } = useContext(OrderViewContext);
  const [comment, setComment] = useState('');

  const addComment = useCallback(async () => {
    try {
      await OrderService.addComment(order?.id, { text: comment });
      setComment('');
      reload();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [comment, order?.id]);

  return (
    <div className="inner-comment">
      <div className="inner-comment__title">Внутренние комментарии:</div>
      <Comments comments={order?.innerComments} />
      <div className="inner-comment__inputs margin-top-15">
        <VzForm.Item label={'Добавить комментарий'}>
          <Ant.Input.TextArea onChange={(e) => setComment(e.target.value)} value={comment} />
        </VzForm.Item>
        <Ant.Button
          className={'margin-top-15'}
          disabled={!comment}
          onClick={() => addComment()}
          type={'primary'}
        >
          Отправить комментарий
        </Ant.Button>
      </div>
    </div>
  )
}

export default OrderViewGeneralComment;