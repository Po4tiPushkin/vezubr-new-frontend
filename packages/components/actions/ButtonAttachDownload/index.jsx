import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FilterButton } from '@vezubr/elements';
import ModalAttachDownload from '../../modals/ModalAttachDownload';
import { DocsType } from '../../modals/ModalAttachDownload/types';

function ButtonAttachDownload(props) {
  const { uploadDoc, docs, modalProps } = props;
  const [openModal, setOpenModal] = useState(false);

  const open = () => {
    setOpenModal(true);
  };

  const close = () => {
    setOpenModal(false);
  };

  return (
    <>
      <FilterButton
        {...{
          icon: 'paymentIn',
          className: 'rounded box-shadow',
          content: <p className="no-margin">Документы для бухгалтерии</p>,
          ...props.buttonProps,
          withMenu: false,
          onClick: open,
        }}
      />

      <ModalAttachDownload open={openModal} onClose={close} uploadDoc={uploadDoc} docs={docs} modalProps={modalProps} />
    </>
  );
}

ButtonAttachDownload.propTypes = {
  buttonProps: PropTypes.object,
  modalProps: PropTypes.object,
  docs: DocsType.isRequired,
  uploadDoc: PropTypes.func,
};

export default ButtonAttachDownload;
