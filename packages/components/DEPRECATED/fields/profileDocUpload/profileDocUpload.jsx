import React from 'react';
import { IconDeprecated } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { Common as CommonService } from '@vezubr/services';
import PropTypes from 'prop-types';
import Utils from '@vezubr/common/common/utils';
import AdobeIcon from '@vezubr/common/assets/img/adobe-pdf-icon.png';

const API_VERSION = window.API_CONFIGS[APP].apiVersion;

class ProfileDocUpload extends React.Component {
  state = {
    doc: false,
    img: '',
  };

  async componentDidMount() {
    await this.init();
  }

  async init() {
    const { doc } = this.props;
    if (doc) {
      let extension = false;
      if (doc.originalName) {
        extension = doc.originalName.split('.').pop();
      } else if (doc.files && doc.files.length) {
        const actual = doc.files.find((file) => file.actual === 1);
        extension = (actual || doc?.files[0])?.original_name?.split('.').pop();
        doc.originalName = (actual || doc?.files[0])?.original_name;
      }
      this.setState({ doc });
      if (extension === 'pdf' || doc?.fileData?.file.type === 'application/pdf') {
        this.setState({ img: AdobeIcon });
      } else if (doc?.fileData?.tmpFile) {
        this.setState({ img: doc?.fileData?.tmpFile });
      } else {
        let fileName = doc?.fileData?.tmpFile || doc?.downloadUrl || doc?.file?.download_url;
        if (doc.files && doc.files.length) {
          const actual = doc.files.find((file) => file.actual === 1);
          fileName = actual
            ? actual?.previews?.preview_84_url || actual.download_url || actual.downloadUrl
            : doc.files[0].previews?.preview_84_url || doc.files[0].download_url || doc.files[0].downloadUrl;
          const url = Utils.concatImageUrl(fileName);
          this.setState({ img: url });
        } else {
          const url = Utils.concatImageUrl(fileName);
          let img = await CommonService.getImage(url);
          img = URL.createObjectURL(img.data);
          this.setState({ img });
        }
        //const fileName = doc?.fileData?.tmpFile || doc?.downloadUrl || doc?.file?.download_url || doc?.files[0]?.download_url;
      }
    }
  }

  async removeDocType(data) {
    const { removeDocType } = this.props;
    await this.setState({ img: false, doc: false });
    removeDocType(data);
  }

  componentWillReceiveProps(nextProp) {
    const { doc } = this.state;
    if (nextProp.doc) {
      if (!_.isEqual(nextProp.doc, doc)) this.init();
    } else if (doc && !nextProp.doc) {
      this.setState({ img: false, doc: false });
    }
  }

  async downloadDoc() {
    const { doc: fileData } = this.state;
    if (fileData.fileData) {
      const link = document.createElement('a');
      link.href = fileData.fileData.tmpFile;
      link.download = `${fileData.originalName}`;
      link.click();
    } else {
      const downloadUrl = fileData.downloadUrl ? fileData.downloadUrl : fileData.files[0]?.download_url;
      const file = await CommonService.getImage(downloadUrl.replace(`/${API_VERSION}`, ''));
      const blob = new Blob([file.data], { type: file.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${fileData.originalName}`;
      link.click();
    }
  }

  openFile = () => {
    const { doc: fileData } = this.state;
    const downloadUrl = fileData?.download_url || fileData?.downloadUrl || fileData?.files[0]?.download_url;
    const fileUrl = Utils.concatRootImageUrl(downloadUrl.replace(`/${API_VERSION}`, ''));
    const win = window.open(fileUrl, '_blank');
    win.focus();
  };

  render() {
    const {
      docType,
      addDocType,
      addButtonText,
      removeDocType,
      editDocType,
      docTitle,
      className = 'flexbox file-input-wrapper input-doc size-1',
      error,
    } = this.props;
    const { img, doc } = this.state;
    const { store } = this.context;
    const { documentTypes } = store.getState().dictionaries;
    return (
      <div className={className}>
        <div className={'empty-attach-input ' + (error ? 'divError' : '')}>
          {doc && img ? (
            <img
              style={{ maxWidth: '84px', maxHeight: '84px' }}
              onClick={() => this.openFile(docType)}
              className={'wrapper'}
              src={img}
            />
          ) : (
            <IconDeprecated name={'plusOrange'} onClick={() => addDocType(docType)} />
          )}
        </div>
        <div className={'flexbox column align-left justify-center margin-left-16'}>
          {doc && doc.originalName ? <span>{doc.originalName}</span> : null}
          {doc && docType && documentTypes[docType] ? (
            <div className={'support-format'}>{docTitle || documentTypes[docType]}</div>
          ) : null}
          {!doc && addDocType ? (
            <a onClick={() => addDocType(docType)}>{addButtonText || t.profile('addUstav')}</a>
          ) : null}
          {!doc ? (
            <div className={'support-format'}>
              {' '}
              {t.common('supportFormat')}
              PDF
            </div>
          ) : null}
        </div>
        {doc ? (
          <div className={'flexbox size-1 justify-right center'}>
            {editDocType ? <IconDeprecated onClick={() => editDocType(docType)} name={'editOrange'} /> : null}
            <IconDeprecated onClick={() => this.downloadDoc(docType)} name={'chevronRightOrange'} />
          </div>
        ) : null}
      </div>
    );
  }
}

ProfileDocUpload.propTypes = {
  docType: PropTypes.number.isRequired,
  addDocType: PropTypes.func,
  removeDocType: PropTypes.func,
  editDocType: PropTypes.func,
  addButtonText: PropTypes.string,
};

ProfileDocUpload.contextTypes = {
  store: PropTypes.object,
};

export default ProfileDocUpload;
