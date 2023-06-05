import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Modal as AntModal } from '../antd';
import { VzForm } from '..';

function Modal(props) {
  const { children, className: classNameInput, subtitle, bodyNoPadding, ...otherProps } = props;

  const className = cn('modal-modern', { 'body-no-padding': bodyNoPadding }, classNameInput);

  return (
    <AntModal {...otherProps} className={className}>
      {subtitle ? (<h4>{subtitle}</h4>) : (null)}
      {children}
    </AntModal>
  );
}

Modal.propTypes = {
  ...AntModal.propTypes,
  className: PropTypes.string,
  bodyNoPadding: PropTypes.bool,
  subtitle: PropTypes.string
};

export default Modal;
