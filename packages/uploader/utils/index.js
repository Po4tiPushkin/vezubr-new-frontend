import Cookies from '@vezubr/common/common/cookies';
import { Ant } from "@vezubr/elements";
import { fileOpenDataUrl, fileOpenInWindow } from "@vezubr/common/utils";
const HOST = window.API_CONFIGS[APP].host;
const API_VERSION = window.API_CONFIGS[APP].apiVersion;

export const getDefaultAction = () => {
  let path = '/api/upload-file';

  if (APP === 'operator') {
    path = '/file/upload';
  }

  return `${HOST}${API_VERSION}${path}`;
};

export function prepareAction(action) {
  if (/^(\/\/|http)/.test(action)) {
    return action;
  }

  return `${HOST}${API_VERSION}${action}`;
}


export const getDefaultAuthHeaders = () => {
  const headers = {};
  const token = Cookies.get(APP + 'Token');
  if (token) {
    headers['Authorization'] = `${token.replace('%20', ' ')}`;
  }
  return headers;
};


export function openFileData(fileData) {
  if (fileData.download) {
    fileOpenInWindow(fileData.download);
  } else if (fileData.preview) {
    fileOpenDataUrl(fileData.preview)
  } else {
    Ant.message.warn('Невозможно просмотреть файл');
  }
}

export function getBase64(img) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });
    reader.readAsDataURL(img);
  });
}
