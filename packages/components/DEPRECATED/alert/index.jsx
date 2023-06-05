import React, { useState, useCallback, useMemo, useEffect } from 'react';
import t from '@vezubr/common/localization';
import { AlertBox } from '@vezubr/elements';
import Modal from '../modal/modal';
const Alert = (props) => {
  const { observer } = props;
  const [alert, setAlert] = useState({ title: '', message: '' })
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    observer.subscribe('alert', (data) => {
      setAlert(data);
      setShowAlertModal(true);
    });

    return () => observer.off('alert');
  }, []);

  const alertBoxOnClick = useCallback(() => {
    if (alert.cb) {
      alert.cb(alert);
    } else {
      observer.emit('alertClosed', alert);
    }
    this.setState({
      showAlertModal: false,
      alert: {
        title: '',
        html: false,
        message: '',
      },
    });
    setShowAlertModal(false)
    setAlert({
      title: '',
      html: false,
      message: '',
    })
  }, [observer, alert]);

  const onClose = useCallback(() => {
    if (alert.cb) {
      alert.cb({ cancelled: true });
    }
    setShowAlertModal(false)
    setAlert({
      title: '',
      html: false,
      message: '',
    })
  }, [alert])

  return (
    <Modal
      options={{
        showModal: showAlertModal,
        showClose: alert.showClose,
        modalClassnames: 'alert-generic-modal',
      }}
      size={'small'}
      animation={false}
      onClose={() => onClose()}
      content={
        <AlertBox
          title={alert.title}
          content={alert.message}
          html={alert.html}
          button={{
            text: alert?.btnText ? t.buttons(alert?.btnText) : 'Ok',
            event: (e) => alertBoxOnClick(e),
          }}
        />
      }
    />
  )
}

export default Alert;