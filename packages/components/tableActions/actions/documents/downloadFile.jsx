import { Utils } from '@vezubr/common/common';
import { fileGetFileData } from '@vezubr/common/utils';
import { Ant, showAlert, showConfirm, showError } from '@vezubr/elements';
import { Orders as OrdersService } from '@vezubr/services';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

function DownloadFile(props) {
  const { record, reload } = props;
  const [loading, setLoading] = useState(false);

  const downloadFile = () => {
    window.open(`${window.API_CONFIGS[APP].host}${record.file.downloadUrl.replace('/', '')}`)
  } 

  const textButton = 'Скачать';

  return (
    <Ant.Button
      loading={loading}
      size="small"
      type={'primary'}
      onClick={downloadFile}
    >
      {textButton}
    </Ant.Button>
  );
}

DownloadFile.propTypes = {
  record: PropTypes.object.isRequired,
};

export default DownloadFile;
