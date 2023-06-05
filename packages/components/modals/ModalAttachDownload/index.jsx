import React, { useState, useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import ModalDeprecated from '../../DEPRECATED/modal/modal';
import DocElem from './DocElem';
import { DocsType } from './types';

function ModalAttachDownload(props) {
  const { open, onClose, uploadDoc, docs, modalProps } = props;

  const modalOptions = (modalProps && modalProps.options) || {};

  const renderFile = (docInfo, key) => {
    return (
      <DocElem
        key={key}
        doc={docInfo.doc}
        buttonText={docInfo.name}
        disableAddEdit={!docInfo.editMode}
        supportTypes={docInfo.supportTypes}
        useIcon={docInfo.useIcon}
        uploadDoc={(docSaving) => (uploadDoc ? uploadDoc(docSaving, docInfo) : docSaving)}
      />
    );
  };

  const renderItems = (items) => {
    if (items.length === 0) {
      return null;
    }

    return items.map((item, key) => {
      if (item.section) {
        return (
          <section key={key} className={cn('section-item', item.section?.className)}>
            {item.section?.name && <h2>{item.section?.name}</h2>}
            {item.section?.description && <div className="section-description">{item.section?.description}</div>}
            {item.items && <div className="section-content">{renderItems(item.items)}</div>}
          </section>
        );
      }
      return renderFile(item, key);
    });
  };

  return (
    <ModalDeprecated
      title={{
        text: 'Документы для скачивания',
      }}
      size={'medium'}
      {...modalProps}
      options={{
        ...modalOptions,
        showModal: open,
        showClose: true,
        modalClassnames: cn('modal-attach-download', modalOptions.modalClassnames),
      }}
      onClose={onClose}
      content={<div className={'documents-download-attach'}>{renderItems(docs)}</div>}
    />
  );
}

ModalAttachDownload.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  docs: DocsType,
  uploadDoc: PropTypes.func,
};

export default ModalAttachDownload;
