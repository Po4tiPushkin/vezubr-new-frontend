import React from 'react';
import t from '@vezubr/common/localization';
import * as Ant from '../antd';

export default function (e, props) {
  const searchError = e?.data || e;
  let messageError = '';
  

  messageError = searchError
    ?
    (
      searchError.error_str &&
      (
        t.error(searchError.error_str) ||
        searchError.error_str
      )
    ) ||
    (
      searchError.message &&
      (
        t.error(searchError.message) ||
        searchError.message
      )
    ) ||
    (
      searchError.error_no &&
      t.error(searchError.error_no)
    ) ||
    searchError
    :
    undefined;

  if (typeof messageError === 'object') {
    switch (e?.code) {
      case 403:
        messageError = 'Ошибка доступа'
        break;
      case 503:
        messageError = "Сервис временно недоступен. Пожалуйста, повторите действие через некоторое время"
        break;

      default:
        messageError = 'Необработанная ошибка';
        break;
    }
  }

  if (searchError?.errors && Array.isArray(searchError?.errors) && searchError?.errors.length > 0) {
    messageError = searchError.errors;
  }

  Ant.Modal.error({
    className: 'vz-show-error-modal',
    title: 'Ошибка',
    content: Array.isArray(messageError) ?
      messageError.map((el, index) => {
        return <div key={index}>{el.message}</div>
      })
      :
      messageError,
    width: 900,
    style: {
      maxWidth: '100%',
    },
    ...props,
  });
}
