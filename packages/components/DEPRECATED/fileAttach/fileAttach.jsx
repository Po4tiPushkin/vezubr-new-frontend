import React from 'react';
import autobind from 'autobind-decorator';
import { ButtonIconDeprecated, IconDeprecated } from '@vezubr/elements'
import Static from '@vezubr/common/constants/static';
import t from '@vezubr/common/localization';
import { Common as CommonService } from '@vezubr/services';
import Utils from '@vezubr/common/common/utils';

const patterns = Static.patterns;
const times = Static.times;

import AdobeIcon from '@vezubr/common/assets/img/adobe-pdf-icon.png';

class FileAttach extends React.Component {
  state = {
    tmpFile: false,
    fileData: false,
    fileName: '',
  };

  async componentWillMount() {
    const { fileData, uploadedFile } = this.props;
    if (fileData && Object.keys(fileData).length > 1) {
      let tmpFile = false;
      const url = Utils.concatImageUrl(fileData?.previews?.find((el) => el.widthInPx === 84)?.downloadUrl);
      const file = await CommonService.getImage(url);
      if (file && file.data.type === 'application/pdf') {
        tmpFile = AdobeIcon;
      } else {
        tmpFile = url;
      }
      this.setState({
        fileData: fileData,
        tmpFile,
        fileName: Utils.removeExtension(fileData?.file?.name || fileData?.originalName),
      });
    } else if (uploadedFile) {
      this.setState({ tmpFile: uploadedFile.tmpFile, fileName: uploadedFile.fileName });
    }
  }

  @autobind
  removeFileData() {
    const input = document.getElementById('file-upload');
    const { onFileUploadComplete, onRemove } = this.props;
    if (input) input.value = '';
    if (onRemove) {
      onRemove(this.state.fileData);
    }
    this.setState({
      fileData: false,
      tmpFile: false,
      fileName: '',
    });
    if (onFileUploadComplete) {
      onFileUploadComplete(false);
    }
  }

  @autobind
  onChange(e) {
    const { forceUpload = true, onFileUploadComplete } = this.props;
    this.file = e.target.files[0];
    if (forceUpload) {
      this.uploadFile(e.target.files[0]);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({
          tmpFile: this.file.type === 'application/pdf' ? AdobeIcon : e.target.result,
          fileName: Utils.removeExtension(this.file.name),
        });
        onFileUploadComplete({ file: this.file, tmpFile: e.target.result });
      };

      reader.readAsDataURL(this.file);
    }
  }

  @autobind
  openInNewTab() {
    let newTab = window.open('', '_blank', '', '');
    const url = this.state.fileData?.fileId
      ? this.state.tmpFile
      : Utils.concatImageUrl(this.state.fileData?.downloadUrl);
    newTab.document.body.innerHTML = `<img src="${url}"/>`;
  }

  async uploadFile(file) {
    const { onFileUploadComplete } = this.props;
    const { observer } = this.context;
    try {
      const response = await Utils.uploadFile(file);
      const fileData = response.fileData;
      Object.assign(fileData, { fileId: response.response.fileId });
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({
          fileData: fileData,
          tmpFile: e.target.result,
          fileName: fileData.fileName,
        });
        onFileUploadComplete(fileData, e.target.result);
      };

      reader.readAsDataURL(file);
    } catch (e) {
      observer.emit('alert', {
        title: t.error('error'),
        message: e.message || t.error(413),
      });
    }
  }

  render() {
    const { fileName, tmpFile, fileData } = this.state;
    const { className, onEdit, onRemove, forceUpload = true, error, placeholder, title } = this.props;

    let classNames = (className || '').split(' ');

    classNames.push('vz-input attachment');

    if (error) {
      classNames.push('error');
    }

    classNames = classNames.join(' ');
    return (
      <div className={classNames}>
        {!fileData && !tmpFile && (
          <input
            id={'file-upload'}
            type="file"
            accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
            onChange={this.onChange}
          />
        )}
        {tmpFile || (fileData && Object.keys(fileData).length > 1) ? (
          <>
            <div
              className={'icon-wrap'}
              style={{ zIndex: 1000, cursor: 'pointer' }}
              onClick={(e) => (onEdit ? onEdit(e) : this.openInNewTab())}
            >
              <img src={tmpFile} />
            </div>
            <div className={'file-data full-width'}>
              <p className={'vz-title'}>{t.common('name')}</p>
              <div className={'vz-file-name flexbox align-center'}>
                <p className={'size-1'}>{fileName}</p>
                <ButtonIconDeprecated
                  default={true}
                  style={{ zIndex: 1000, marginTop: '-16px' }}
                  onClick={this.removeFileData}
                  svgIcon={'xSmall'}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={'icon-wrap'} onClick={(e) => (onEdit ? onEdit(e) : null)}>
              <IconDeprecated name={'plusBlue'} />
            </div>
            <div className={'file-data full-width'}>
              <p className={'vz-title'}>{title ? title : t.order('fileAttach')}</p>
              <p className={'opacity-7'}>{placeholder ? placeholder : ''}</p>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default FileAttach;
