import React from 'react';
import {
  IconDeprecated,
  CustomBoxDeprecated,
  ButtonDeprecated,
} from '@vezubr/elements';
import InputField from '../../../inputField/inputField';
import FileAttachDeprecated from '../../../DEPRECATED/fileAttach/fileAttach';
import t from '@vezubr/common/localization';
import PropTypes from 'prop-types';
import Utils from '@vezubr/common/common/utils';
import moment from 'moment';
import ModalDeprecated from '../../../DEPRECATED/modal/modal';
import autobind from 'autobind-decorator';
import ReactTooltip from 'react-tooltip';

class DocUpload extends React.Component {
  state = {
    doc: {},
    showModal: false,
    docAdded: false,
    img: '',
    loading: false,
  };

  async componentDidMount() {
    this.setDoc();
  }

  async setDoc(d) {
    let doc = this.props.doc || d || {};
    if (doc.file) {
      doc = {
        ...doc.file,
        ...(doc.createdAt ? { createdAt: doc.createdAt } : {}),
        ...(doc.previews ? { previews: doc.previews } : {}),
        orderDocumentId: doc.id,
      };
      delete doc.file;
    }
    if (doc) {
      let url;
      if (doc?.previews) {
        url = doc?.previews.find((el) => el.widthInPx === 84)?.downloadUrl;
      } else if (doc.downloadUrl) {
        url = doc.downloadUrl;
      }
      this.setState({
        doc: doc,
        img: url ? `${window.API_CONFIGS[APP].host}${url.replace('/', '')}` : '',
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { img } = this.state;
    if (nextProps.doc && !img) {
      this.setDoc(nextProps.doc || {});
    }
  }

  setDocName(e) {
    const doc = { ...this.state.doc };
    doc.originalName = e.target.value;
    this.setState({ doc });
  }

  @autobind
  setFileData(fileData) {
    const { doc } = this.state;
    if (!fileData) {
      return this.removeDocType(doc.type);
    }
    doc.fileData = fileData;
    doc.originalName = doc.originalName || Utils.removeExtension(fileData.file.name);
    this.setState({ doc, docAdded: true });
  }

  removeDocType(type) {
    const { removeDocType } = this.props;
    removeDocType &&
      removeDocType(() => {
        this.setState({ doc: {}, img: false });
      });
  }

  editDocType() {
    this.setState({ showModal: true });
  }

  async saveDoc() {
    const { startUpload, addDocType, endUpload } = this.props;
    const { doc } = this.state;
    const { observer } = this.context;
    this.setState({ loading: true });
    try {
      startUpload && startUpload(doc);
      const response = await Utils.uploadFile(doc.fileData.file);
      const updatedFile = { ...response, file: doc.fileData, name: doc.originalName };
      endUpload && endUpload(updatedFile);
      addDocType(updatedFile);

      this.setState({ showModal: false, docAdded: false, loading: false });
    } catch (e) {
      observer.emit('alert', {
        title: t.error('error'),
        html: 'center',
        message: e.message || t.error(413),
      });
      endUpload && endUpload(doc, e);
      this.setState({ showModal: false, docAdded: false, doc: {}, loading: false });
    }
  }

  downloadFile(doc) {
    if (doc.fileData) {
      const link = document.createElement('a');
      link.href = doc.fileData.tmpFile;
      link.download = `${doc.originalName}`;
      link.click();
    }
  }

  openFile(doc) {
    window.open(doc.fileData.tmpFile);
  }

  render() {
    const {
      docType,
      addButtonText,
      className,
      onError,
      name,
      disableAddEdit = false,
      onDocDownload,
      noPreview = false,
      removeDocType,
      supportTypes = false,
      placeholder = false,
      viewDateCreatedByFormat,
      downloadButton,
      useIcon,
    } = this.props;

    let classNames = (className || '').split(' ');

    classNames.push('doc-upload flexbox file-input-wrapper input-doc size-1');

    if (onError) {
      classNames.push('error');
    }

    classNames = classNames.join(' ');

    const { img, showModal, doc, docAdded } = this.state;

    return (
      <div className={classNames}>
        <div
          data-tip="React-tooltip"
          data-for={name}
          className={'empty-attach-input'}
          onClick={() => {
            disableAddEdit
              ? onDocDownload
                ? onDocDownload(doc)
                : void 1
              : doc && doc.fileData && doc.fileData.tmpFile
              ? this.openFile(doc)
              : this.setState({ showModal: true });
          }}
        >
          {(Object.keys(doc).length || img || placeholder) && !noPreview ? (
            useIcon ? (
              useIcon
            ) : (
              <img
                className={'wrapper'}
                src={doc?.fileData?.tmpFile || doc?.file?.previews?.preview_84_url || img || placeholder}
              />
            )
          ) : (
            <IconDeprecated name={`${onError ? 'danger' : 'plusOrange'}`} />
          )}

          {onError && (
            <ReactTooltip id={name} className={'vz-tooltip'} place="bottom" t ype="dark" effect="solid">
              <span>{onError}</span>
            </ReactTooltip>
          )}
        </div>
        <div className={'flexbox column align-left justify-center margin-left-16'}>
          {doc?.originalName && !noPreview && (
            <div>
              <div className={'title'}>{addButtonText}</div>
              <div className={'text-name stitle'}>{doc.originalName}</div>
              {doc.createdAt && viewDateCreatedByFormat && (
                <div className="created-date">{moment.unix(doc.createdAt).format(viewDateCreatedByFormat)}</div>
              )}
            </div>
          )}

          {(!Object.keys(doc).length || noPreview) && (
            <a onClick={() => (disableAddEdit ? void 1 : this.setState({ showModal: true }))}>{addButtonText}</a>
          )}

          {(!Object.keys(doc).length || noPreview) && (
            <div className={'support-format'}>
              {t.common('supportFormat')} {supportTypes || 'JPEG, PNG, PDF'}
            </div>
          )}
        </div>

        {!!Object.keys(doc).length && !noPreview && (
          <div className={'flexbox size-1 justify-right center'}>
            {!disableAddEdit && removeDocType && (
              <IconDeprecated
                className={'pointer'}
                onClick={() => this.removeDocType(docType)}
                name={'trashBinOrange'}
              />
            )}

            {!disableAddEdit && (
              <IconDeprecated
                className={'margin-left-12 pointer'}
                onClick={() => this.editDocType(docType)}
                name={'editOrange'}
              />
            )}

            {downloadButton ? (
              <ButtonDeprecated
                theme={'secondary'}
                icon={'paymentIn'}
                className={'mid margin-left-26'}
                onClick={() => {
                  onDocDownload ? onDocDownload(doc) : this.editDocType(docType);
                }}
              >
                Скачать
              </ButtonDeprecated>
            ) : (
              <IconDeprecated
                className={'margin-left-26 pointer'}
                onClick={() => (onDocDownload ? onDocDownload(doc) : this.editDocType(docType))}
                name={'chevronRightOrange'}
              />
            )}
          </div>
        )}

        <ModalDeprecated
          title={{
            classnames: 'identificator',
            text: t.profile('documentLoad'),
          }}
          options={{ showModal }}
          size={'small'}
          onClose={() => {
            if (docAdded) {
              this.removeDocType(docType);
            }
            this.setState({ showModal: false });
          }}
          animation={false}
          showClose={true}
          content={
            <CustomBoxDeprecated
              content={
                <div>
                  <InputField
                    title={t.profile('docName')}
                    type={'text'}
                    name={'docName'}
                    value={doc?.originalName || ''}
                    onChange={(e) => this.setDocName(e)}
                  />
                  <FileAttachDeprecated
                    forceUpload={false}
                    fileData={doc?.fileData || Object.keys(doc).length ? doc : '' || ''}
                    className={'margin-top-12'}
                    onFileUploadComplete={this.setFileData}
                  />
                </div>
              }
              buttons={[
                {
                  text: t.common('save'),
                  theme: 'primary',
                  event: (e) => this.saveDoc(e),
                  loading: this.state.loading,
                },
              ]}
            />
          }
        />
      </div>
    );
  }
}

DocUpload.contextTypes = {
  observer: PropTypes.object,
};

DocUpload.propTypes = {
  //docType: PropTypes.number.isRequired,
  viewDateCreatedByFormat: PropTypes.string,
  addDocType: PropTypes.func.isRequired,
  removeDocType: PropTypes.func,
  startUpload: PropTypes.func,
  endUpload: PropTypes.func,
  addButtonText: PropTypes.string.isRequired,
  onError: PropTypes.any,
  downloadButton: PropTypes.bool,
  useIcon: PropTypes.node,
};

export default DocUpload;
