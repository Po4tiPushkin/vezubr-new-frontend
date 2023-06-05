import axios from 'axios';
import { getDefaultAction, getDefaultAuthHeaders } from './utils';

export default function request({
  action: actionInput,
  data,
  file,
  filename,
  headers: headersInput,
  onError,
  onProgress,
  onSuccess,
  withCredentials,
}) {
  const action = actionInput || getDefaultAction();

  const formData = new FormData();
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  }

  formData.append('file', file);
  formData.append('filename', filename || file.name);

  const headers = { ...headersInput, ...(withCredentials ? getDefaultAuthHeaders() : {}) };

  axios
    .post(action, formData, {
      withCredentials,
      headers,
      onUploadProgress: ({ total, loaded }) => {
        onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
      },
    })
    .then((resp) => {
      if (APP !== 'operator') {
        onSuccess(resp?.data || resp, file);
      } else {
        const { data } = resp;
        if (data?.status == 'ok') {
          onSuccess(data?.data || data, file);
        } else {
          onError(data?.error_str || data?.message || 'Ошибка');
        }
      }
    })
    .catch((response) => {
      const { data } = response.response
      let err = response.message
      if (data.errors) {
        err = data.errors[0]
      } else {
        err = data
      }
      onError(err || 'Ошибка');
    });

  return {
    abort() {
      console.log('upload progress is aborted.');
    },
  };
}
