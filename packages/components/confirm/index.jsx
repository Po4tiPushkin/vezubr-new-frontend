import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Ant } from '@vezubr/elements';
import Modal from '../DEPRECATED/modal/modal';

const DEFAULT_STATE_DATA = {
  title: 'Подтвердите действие',
  message: '',
  showClose: false,
  okText: 'Да',
  cancelText: 'Отмена',
  name: '',
};

export const CONFIRM_STATUS = {
  CANCELED: 'canceled',
  CONFIRM: 'confirm',
};
const Confirm = (props) => {
  const { observer } = props;
  const [data, setData] = useState(DEFAULT_STATE_DATA);
  const [show, setShow] = useState(false);

  useEffect(() => {
    observer.subscribe('confirm', (data) => {
      setShow(true);
      setData(prev => ({ ...prev, data }));
    });
    return () => observer.off('confirm');
  }, [])

  const sendStatus = useCallback((status) => {
    const { cb, name } = data;
    if (cb) {
      cb({ status });
    }

    observer.emit(`confirm:closed`, data);
    if (name) {
      observer.emit(`confirm:${name}:closed`, data);
    }
    setShow(false);
    setData(DEFAULT_STATE_DATA);
  }, [data, observer])

  const renderBox = useMemo(() => {
    const { title, message, okText, cancelText } = data;
    return (
      <div className="confirm-box-container">
        {title && <h2>{title}</h2>}
        {message && <div className="confirm-box-body">{message}</div>}

        <div className="confirm-box-actions">
          <Ant.Button
            theme={'secondary'}
            onClick={() => {
              sendStatus(CONFIRM_STATUS.CANCELED);
            }}
          >
            {cancelText}
          </Ant.Button>

          <Ant.Button
            theme={'primary'}
            onClick={() => {
              sendStatus(CONFIRM_STATUS.CONFIRM);
            }}
          >
            {okText}
          </Ant.Button>
        </div>
      </div>
    )
  }, [data])

  return (
    <Modal
      options={{
        showModal: show,
        showClose: data.showClose,
        modalClassnames: 'confirm-generic-modal',
      }}
      size={'small'}
      animation={false}
      onClose={() => {
        sendStatus(CONFIRM_STATUS.CANCELED);
      }}
      content={renderBox}
    />
  )
}

export default Confirm;