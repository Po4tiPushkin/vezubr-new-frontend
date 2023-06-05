import React from 'react';
import DocsUploadViewer from './docs-upload-viewer';

export default function OrderAccountingDocuments(props) {
  const { editable, docs, uploadDoc, accepted } = props;

  return (
    <div className={'order-accounting-documents'}>
      <DocsUploadViewer
        docs={docs}
        editable={editable}
        uploadDoc={uploadDoc}
        accepted = {accepted}
      />
    </div>
  )
}