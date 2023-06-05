import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import Store from './store/Store';
import { CLS_ROOT } from './constant';
import { OrderDocumentViewerUploaderContext } from './context';
import Groups from './groups';


const OrderDocumentsViewerUploader = (props) => {
  const {
    documents,
    documentCategories,
    editable,
    onChange,
    groups,
    onInit,
    showComments = false,
    showAccept = false,
    newApi = false,
    reload } = props;
  const prevDocuments = usePrevious(documents);
  const prevGroups = usePrevious(groups);
  const prevEditable = usePrevious(editable);
  const prevOnChange = usePrevious(onChange);
  const prevOnInit = usePrevious(onInit);
  const prevShowComments = usePrevious(showComments);
  const prevShowAccept = usePrevious(showAccept);

  const [store] = useState(() => new Store({ documents, groups, editable, onChange, onInit, showComments, showAccept, newApi }));

  useEffect(() => {
    const hasPrevious = !!prevDocuments && !!prevGroups;
    const isUpdatedInput = prevDocuments !== documents || prevDocuments !== documents;

    if (prevEditable !== editable) {
      store.setEditable(editable);
    }

    if (prevOnChange && prevOnChange !== onChange) {
      store.setOnChange(onChange);
    }

    if (prevOnInit && prevOnInit !== onInit) {
      store.setOnInit(onInit);
    }

    if (hasPrevious && isUpdatedInput) {
      store.setDocsAndGroups(documents, groups);
    }

    if (prevShowComments && prevShowComments !== showComments) {
      store.setShowComments(showComments);
    }

    if (prevShowAccept && prevShowAccept !== showAccept) {
      store.setShowComments(showAccept);
    }

  }, [
    prevDocuments,
    prevGroups,
    groups,
    documents,
    editable,
    prevEditable,
    prevOnChange,
    onChange,
    prevOnInit,
    onInit,
    prevShowComments,
    showComments,
    showAccept,
  ]);

  const contextValue = useMemo(() => ({ store, documentCategories }), [store, documentCategories]);

  return (
    <OrderDocumentViewerUploaderContext.Provider value={contextValue}>
      <div className={CLS_ROOT}>
        <Groups reload={reload} parentId={null} level={0} />
      </div>
    </OrderDocumentViewerUploaderContext.Provider>
  );
};

OrderDocumentsViewerUploader.defaultProps = {
  editable: false,
};

OrderDocumentsViewerUploader.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.object),
  documentCategories: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  onInit: PropTypes.func,
  showComments: PropTypes.bool,
  showAccept: PropTypes.bool,
};

export default OrderDocumentsViewerUploader;
