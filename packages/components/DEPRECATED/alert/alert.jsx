import React from 'react';
import t from '@vezubr/common/localization';
import { AlertBox } from '@vezubr/elements';
import Modal from '../modal/modal';
import PropTypes from 'prop-types';

class Alert extends React.Component {
  state = {
    showAlertModal: false,
    alert: {
      title: '',
      message: '',
    },
  };

  componentDidMount() {
    const { observer } = this.context;
    observer.subscribe('alert', (data) => {
      this.setState({
        showAlertModal: true,
        alert: data,
      });
    });
  }

  componentWillUnmount() {
    const { observer } = this.context;
    observer.off('alert');
  }

  alertBoxOnClick() {
    const { observer } = this.context;
    const { alert } = this.state;
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
  }

  onClose() {
    const { alert } = this.state;
    if (alert.cb) {
      alert.cb({ cancelled: true });
    }
    this.setState({
      showAlertModal: false,
      alert: {
        title: '',
        message: '',
        html: false,
      },
    });
  }

  render() {
    const { showAlertModal, alert } = this.state;

    return (
      <Modal
        options={{
          showModal: showAlertModal,
          showClose: alert.showClose,
          modalClassnames: 'alert-generic-modal',
        }}
        size={'small'}
        animation={false}
        onClose={() => this.onClose()}
        content={
          <AlertBox
            title={alert.title}
            content={alert.message}
            html={alert.html}
            button={{
              text: alert?.btnText ? t.buttons(alert?.btnText) : 'Ok',
              event: (e) => this.alertBoxOnClick(e),
            }}
          />
        }
      />
    );
  }
}

Alert.contextTypes = {
  observer: PropTypes.object,
};

export default Alert;
