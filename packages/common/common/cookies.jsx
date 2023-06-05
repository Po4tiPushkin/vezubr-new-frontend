class Cookies {
  static set(name, value, days = 7) {
    const date = new Date(Date.now() + days * 864e5);
    const expires = date.toGMTString();
    const urlArr = location.host.split('.');
    document.cookie =
      name +
      '=' +
      encodeURIComponent(value) +
      '; expires=' +
      expires +
      '; path=/;' +
      (urlArr.length === 3 ? ' domain=.' + urlArr[1] + '.' + urlArr[2] : 'vezubr.local');
  }

  static get(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  }

  static delete(name) {
    const urlArr = location.host.split('.');
    document.cookie =
      name +
      '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;' +
      (urlArr.length === 3 ? ' domain=.' + urlArr[1] + '.' + urlArr[2] : 'vezubr.local');
  }
}

export default Cookies;
