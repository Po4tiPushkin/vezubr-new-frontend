import React from 'react';
import Modal from '../DEPRECATED/modal/modal';
import PropTypes from 'prop-types';
import { ButtonDeprecated } from '@vezubr/elements';

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

class Confirm extends React.Component {
  state = {
    show: false,
    data: DEFAULT_STATE_DATA,
  };

  componentDidMount() {
    const { observer } = this.context;
    observer.subscribe('confirm', (data) => {
      this.setState({
        show: true,
        data: {
          ...this.state.data,
          ...data,
        },
      });
    });
  }

  componentWillUnmount() {
    const { observer } = this.context;
    observer.off('confirm');
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

  sendStatus(status) {
    const { observer } = this.context;
    const {
      data,
      data: { cb, name },
    } = this.state;

    if (cb) {
      cb({ status });
    }

    observer.emit(`confirm:closed`, data);
    if (name) {
      observer.emit(`confirm:${name}:closed`, data);
    }

    this.setState({
      show: false,
      data: DEFAULT_STATE_DATA,
    });
  }

  renderBox() {
    const { title, message, okText, cancelText } = this.state.data;

    return (
      <div className="confirm-box-container">
        {title && <h2>{title}</h2>}
        {message && <div className="confirm-box-body">{message}</div>}

        <div className="confirm-box-actions">
          <ButtonDeprecated
            theme={'secondary'}
            onClick={() => {
              this.sendStatus(CONFIRM_STATUS.CANCELED);
            }}
          >
            {cancelText}
          </ButtonDeprecated>

          <ButtonDeprecated
            theme={'primary'}
            onClick={() => {
              this.sendStatus(CONFIRM_STATUS.CONFIRM);
            }}
          >
            {okText}
          </ButtonDeprecated>
        </div>
      </div>
    );
  }

  render() {
    const {
      show,
      data: { showClose },
    } = this.state;

    return (
      <Modal
        options={{
          showModal: show,
          showClose: showClose,
          modalClassnames: 'confirm-generic-modal',
        }}
        size={'small'}
        animation={false}
        onClose={() => {
          this.sendStatus(CONFIRM_STATUS.CANCELED);
        }}
        content={this.renderBox()}
      />
    );
  }
}

Confirm.contextTypes = {
  observer: PropTypes.object,
};

export default Confirm;
