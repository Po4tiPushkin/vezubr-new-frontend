import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Utils } from '@vezubr/common/common';
import DocUpload from '../../../DEPRECATED/fields/docUpload/docUpload';
import { Loader } from '@vezubr/elements';

function DocElem(props) {
  const { doc: docInput, type, buttonText, disableAddEdit, supportTypes, uploadDoc, useIcon } = props;

  const [isLoading, setLoading] = useState(false);

  const [doc, setDoc] = useState(docInput);

  const onStartUpload = useCallback((file) => {
    setLoading(true);
  }, []);

  const onEndUpload = useCallback((doc, error) => {
    if (error) {
      setLoading(false);
    }
  }, []);

  const onDocsUpload = useCallback(
    async (file) => {
      const docSaving = {
        ...doc,
        file: file.response.data,
        type: type,
        name: file.name,
        versionName: file.name,
        fileData: {
          tmpFile: file.file.tmpFile,
        },
        originalName: file.file.file.name,
      };

      try {
        const updatedDoc = await uploadDoc(docSaving);
        setDoc({
          ...doc,
          ...updatedDoc,
        });
      } catch (e) {
        console.error(e);
      }

      setLoading(false);
    },
    [doc],
  );

  const onDocDownload = useCallback(async (doc) => {
    const url = Utils.concatImageUrl(doc.downloadUrl);
    const win = window.open(url, '_blank');
    win.focus();
  }, []);

  return (
    <div className="doc-item">
      <DocUpload
        disableAddEdit={disableAddEdit}
        doc={doc}
        className={'doc-preview'}
        name={'documents'}
        addDocType={onDocsUpload}
        startUpload={onStartUpload}
        endUpload={onEndUpload}
        onDocDownload={onDocDownload}
        viewDateCreatedByFormat={'DD.MM.YYYY'}
        addButtonText={buttonText}
        downloadButton={true}
        supportTypes={supportTypes}
        useIcon={useIcon}
      />
      {isLoading && <Loader />}
    </div>
  );
}

DocElem.propTypes = {
  doc: PropTypes.object,
  buttonText: PropTypes.string.isRequired,
  disableAddEdit: PropTypes.bool.isRequired,
  uploadDoc: PropTypes.func.isRequired,
};

export default DocElem;
