/**
 * HOST config comes from webpack and it's not defined
 */

import axios from 'axios';
import Cookies from './cookies';
const HOST = window.API_CONFIGS[window.APP].host;
const API_VERSION = window.API_CONFIGS[window.APP].apiVersion;
const GEO_CODING_HOST = window.API_CONFIGS.geoCodingHost;
const HOSTS = {
  default: {
    url: `${HOST}${API_VERSION}`,
    token: true,
    withCredentials: true,
  },
  geo: {
    url: GEO_CODING_HOST,
    token: true,
    withCredentials: true,
  },
  dadata: {
    url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/',
    headers: {
      Authorization: 'Token 155c96938a79166ef2a0e10f036862da9187aec0',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: false,
  },

  googlePlace: {
    url: 'https://maps.googleapis.com/maps/api/place',
    withCredentials: false,
  },
};

class AxiosInstance {
  static create(hostType, widthHeaders = false) {
    const hosts = HOSTS[hostType];
    const config = {
      baseURL: hosts.url,
      timeout: 60000, // default timeout of 60 seconds
      withCredentials: hosts.withCredentials,
    };

    const axiosInstance = axios.create(config);

    axiosInstance.CancelToken = axios.CancelToken;

    // before the request is sent to the server, add jwt to the Authorization header
    axiosInstance.interceptors.request.use((config) => {
      if (hosts.token) {
        const token = Cookies.get(window.APP + 'Token');
        if (token) {
          config.headers['Authorization'] = `${token.replace('%20', ' ')}`;
        }
      }
      if (hosts.headers) {
        config.headers = hosts.headers;
      }
      return config;
    });

    // whenever a response is received from the node layer
    axiosInstance.interceptors.response.use(
      (response) => {
        if (widthHeaders) {
          return {
            data: response.data,
            headers: response.headers,
          };
        }
        return response.data;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          Cookies.delete(window.APP + 'Token');
          window.location.href = '/login';
        }
        return Promise.reject(
          error.response
            ? { code: error.response.status, data: error.response.data }
            : { message: error?.message.message },
        );
      },
    );
    return axiosInstance;
  }
}

export default AxiosInstance;
