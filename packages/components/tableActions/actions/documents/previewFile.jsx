import { Utils } from '@vezubr/common/common';
import { fileGetFileData } from '@vezubr/common/utils';
import { Ant, showAlert, showConfirm, showError } from '@vezubr/elements';
import { Orders as OrdersService } from '@vezubr/services';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

function PreviewFile(props) {
  const { record, reload } = props;
  const [loading, setLoading] = useState(false);
  const fileData = fileGetFileData(record.pdfFile)

  const previewFile = () => {
    window.open(
      `/rotator/?id=${fileData?.fileId}${
        Utils.queryString(fileData?.download)?.accessKey
          ? `&accessKey=${Utils.queryString(fileData?.download)?.accessKey}`
          : ''
      }${`&fileType=pdf`}`,
      '_blank',
    );
  }

  const textButton = 'Предпросмотр';

  return (
    <Ant.Button
      loading={loading}
      size="small"
      type={'primary'}
      onClick={previewFile}
    >
      {textButton}
    </Ant.Button>
  );
}

PreviewFile.propTypes = {
  record: PropTypes.object.isRequired,
};

export default PreviewFile;
