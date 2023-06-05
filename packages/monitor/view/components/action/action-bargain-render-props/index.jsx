import React from 'react';
import PropTypes from 'prop-types';
import useModalGroup from '@vezubr/common/hooks/useModalGroup';
import { Modal } from '@vezubr/elements';
import ActionBargainContent from './action-bargain-content';

function ActionBargainRenderProps(props) {
  const { modalIsVisible, modalSetVisible, modalGetToggleFunc } = useModalGroup();

  const { order, children } = props;

  const openModal = React.useCallback(() => {
    modalSetVisible('bargain', true);
  }, []);

  const closeModal = React.useCallback(() => {
    modalSetVisible('bargain', false);
  }, []);

  return (
    <>
      <Modal
        title={`Торги на рейсе № ${order.id}`}
        width={1200}
        bodyNoPadding={true}
        maskClosable={true}
        visible={modalIsVisible('bargain')}
        centered={false}
        onCancel={modalGetToggleFunc('bargain')}
        destroyOnClose={true}
        footer={null}
      >
        <ActionBargainContent order={order} />
      </Modal>

      {children({ openModal, closeModal, order })}
    </>
  );
}

ActionBargainRenderProps.propTypes = {
  order: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};

export default ActionBargainRenderProps;
