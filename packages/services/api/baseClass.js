import Axios from '@vezubr/common/common/axiosWrapper';
import autobind from 'autobind-decorator';

class BaseApi {
  constructor(hostType = 'default') {
    this.axios = Axios.create(hostType);
    this.axiosWithHeaders = Axios.create(hostType, true);
  }

  async req(method, url, data = {}, widthHeaders = false, cancelToken, fr, additionalOpts) {
    let options = {}
    if (!method) throw new Error('Method is required');
    if (!url) {
      console.log('method', method);
      console.log('data', data);
      throw new Error('URL is required');
    }
    if (cancelToken && method === 'get') {
      Object.assign(data, { cancelToken: cancelToken.token });
    }
    if (fr) {
      url += `?fakeRequest=1`;
    }
    if (method === 'post' && cancelToken) {
      options.cancelToken = cancelToken.token
    }
    if (additionalOpts) {
      options = {
        ...options,
        ...additionalOpts
      }
    }

    if (data.params) {
      options = {
        ...options,
        params: data.params
      }
      delete data.params
    }

    const resp = await this[widthHeaders ? 'axiosWithHeaders' : 'axios'].request({
      url,
      method,
      data,
      ...options
    });
    return this.serializer(resp);
  }

  async rawRequest(method, url, data = {}) {
    return await this.req(method, url, data, true);
  }

  @autobind
  serializer(response) {
    if (response.status && response.status === 'error') {
      throw response;
    }
    return response || false;
  }
}

export default BaseApi;
