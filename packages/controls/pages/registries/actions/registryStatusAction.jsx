import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function RegistryStatusAction(props) {
  const { canReject, uiState } = props;

  if (uiState === 510 && canReject) {
    return (
      <div className={'rejected'} title={'Реестр отклонен'}>
        Реестр отклонен
      </div>
    )
  }
  if (uiState === 530) {
    return (
      <div className={'rejected'} title={'Реестр отклонен'}>
        Оплата просрочена
      </div>
    )
  }
  if (uiState === 540) {
    return (
      <div className={'standart'} title={'Реестр отклонен'}>
        Оплачен частично
      </div>
    )
  }
  if (uiState === 550) {
    return (
      <div className={'blue'} title={'Реестр отклонен'}>
        Оплачен полностью
      </div>
    )
  }

  return null;
}

export default RegistryStatusAction;
