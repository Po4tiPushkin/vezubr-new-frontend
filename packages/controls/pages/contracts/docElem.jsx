import React from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../infrastructure/actions';
import { Utils } from '@vezubr/common/common';
import DocUpload from '@vezubr/components/DEPRECATED/fields/docUpload/docUpload';
import { Common as CommonService } from '@vezubr/services';
import { Loader } from '@vezubr/elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

function DocElem(props) {
  const { doc, mode, docId, type, actions, isLoading, defaultButtonText } = props;

  const isNew = docId === 'new';

  const canUpload = mode === 'admin';

  const onStartUpload = (file) => {
    actions.setLoadingDoc(docId);
  };

  const onEndUpload = (doc, error) => {
    if (error) {
      actions.setLoadingDoc(docId);
    }
  };

  const onDocsUpload = async (file) => {
    const docSaving = {
      ...doc,
      ...{
        file: file.response.data,
        type: type,
        name: file.name,
        versionName: file.name,
        fileData: {
          tmpFile: file.file.tmpFile,
        },
        originalName: file.file.file.name,
      },
    };

    try {
      const updatedDoc = await CommonService.saveContract(docSaving);
      actions.updateDoc(updatedDoc.data, type);
    } catch (e) {
      console.error(e);
    }

    actions.setLoadingDoc(null);
  };

  const onDocDownload = async (doc) => {
    const url = Utils.concatImageUrl(doc.downloadUrl);
    const win = window.open(url, '_blank');
    win.focus();
  };

  return (
    <div className="doc-item">
      <DocUpload
        disableAddEdit={isNew ? !canUpload : true}
        doc={doc}
        className={'doc-preview'}
        name={'documents'}
        addDocType={onDocsUpload}
        startUpload={onStartUpload}
        endUpload={onEndUpload}
        onDocDownload={onDocDownload}
        viewDateCreatedByFormat={'DD.MM.YYYY'}
        addButtonText={isNew ? 'Загрузить документ' : doc?.name || defaultButtonText}
      />
      {isLoading && <Loader />}
    </div>
  );
}

DocElem.propTypes = {
  docId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultButtonText: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  mode: PropTypes.oneOf(['admin', 'viewer']).isRequired,
  actions: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const { type, docId } = ownProps;
  const doc = state.contracts.documents[type]?.filesById[docId];
  const loadingDoc = state.contracts.loadingDoc;

  const isLoading = docId === loadingDoc;

  return {
    doc,
    isLoading,
  };
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.contracts }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DocElem);
