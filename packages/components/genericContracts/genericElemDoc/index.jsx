import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DocUpload from '../../DEPRECATED/fields/docUpload/docUpload';
import setModalError from '../../DEPRECATED/setModalError';
import { ButtonDeprecated, Loader } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';

function GenericElemDoc(props, context) {
  const { observer } = context;

  const { doc: docInput, genericFunc, fileName, useIcon } = props;

  const [isLoading, setLoading] = useState(false);

  const [doc, setDoc] = useState(docInput);

  const genericFile = useCallback(async () => {
    setLoading(true);
    try {
      setDoc(await genericFunc());
    } catch (e) {
      console.error(e);
      setModalError(observer, e);
    }
    setLoading(false);
  }, []);

  const onDocDownload = useCallback(async (doc) => {
    const url = Utils.concatImageUrl(doc.downloadUrl);
    const win = window.open(url, '_blank');
    win.focus();
  }, []);

  useEffect(() => {
    if (docInput && docInput !== doc) {
      setDoc(docInput);
    }
  }, [docInput]);

  return (
    <div className="generic-doc-item">
      <div className="generic-doc-preview">
        {doc ? (
          <DocUpload
            disableAddEdit={true}
            doc={doc}
            addDocType={() => {}}
            className={'doc-preview'}
            name={'documents'}
            viewDateCreatedByFormat={'DD.MM.YYYY'}
            addButtonText={fileName}
            useIcon={useIcon}
            onDocDownload={onDocDownload}
          />
        ) : (
          <div className="generic-doc-preview-empty">
            {useIcon && <div className="empty-icon">{useIcon}</div>}

            <div className="empty-info">
              <div className="file-name">{fileName}</div>
            </div>
          </div>
        )}

        {genericFunc && (
          <div className="generic-actions">
            <ButtonDeprecated
              theme={doc ? 'secondary' : 'primary'}
              loading={isLoading}
              loaderClass={doc ? 'blue-loader' : ''}
              onClick={genericFile}
            >
              {doc ? 'Перегенерировать' : 'Сгенерировать'}
            </ButtonDeprecated>
          </div>
        )}
      </div>

      {isLoading && <Loader />}
    </div>
  );
}

GenericElemDoc.contextTypes = {
  observer: PropTypes.object,
};

GenericElemDoc.propTypes = {
  doc: PropTypes.object,
  useIcon: PropTypes.node,
  fileName: PropTypes.string.isRequired,
  genericFunc: PropTypes.func,
};

export default GenericElemDoc;
