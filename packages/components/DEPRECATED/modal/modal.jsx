import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { IconDeprecated } from '@vezubr/elements';

class VzModalVzModal extends Component {
  closeModal = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const {
      options,
      content,
      title,
      size = 'large',
      animation = true,
      noPadding = false,
      footer,
      bodyStyle,
      bsClass = '',
    } = this.props;
    const { showModal, showClose, bodyClassnames = '', modalClassnames = '' } = options;
    return (
      <div className={`vz-modal modal-container ${size} ${modalClassnames}`}>
        <Modal
          bsSize={size}
          animation={animation}
          show={showModal}
          container={this}
          onHide={this.closeModal}
          aria-labelledby="contained-modal-title"
        >
          {title && (
            <Modal.Header>
              {title.icon && (
                <div className={'modal-icon-wrapper'} style={{ width: '40px', height: '40px' }}>
                  <IconDeprecated name={title.icon} style={{ width: '33px', height: '33px' }} />
                </div>
              )}
              <h3 style={{ fontSize: '20px' }} className={title.classnames}>
                {title.text}
              </h3>
              {title.leftText && <p>{title.leftText}</p>}
            </Modal.Header>
          )}

          {showClose && (
            <div onClick={this.closeModal} className="modal-close-button">
              <IconDeprecated className={'close-icon'} name={'xBlack'} />
            </div>
          )}

          <Modal.Body style={bodyStyle} className={`${bodyClassnames} ${noPadding ? 'no-padding' : ''}`}>
            {content}
          </Modal.Body>

          {footer && <Modal.Footer className={options.footerClassnames}>{footer}</Modal.Footer>}
        </Modal>
      </div>
    );
  }
}

export default VzModalVzModal;
