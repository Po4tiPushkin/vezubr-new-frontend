import t from '@vezubr/common/localization';

export default function setModalError(observer, e, cbFunc) {
  const searchError = e.data || e;
  const messageError =
    searchError.error_str || (searchError.error_no && t.error(searchError.error_no)) || searchError.toString();
  observer.emit('alert', {
    title: t.error('error'),
    html: 'center',
    message: messageError,
    ...(cbFunc
      ? {
          cb: cbFunc,
        }
      : {}),
  });
}
