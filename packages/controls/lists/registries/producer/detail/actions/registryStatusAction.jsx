import React from 'react';

function RegistryStatusAction(props) {
  const { uiState, hasRejectedOrders } = props;

  if ([412, 414, 416].includes(uiState)) {
    return (
      <div className={'rejected'} title={''}>
        {hasRejectedOrders ? 'Реестр отклонен' : 'Ожидает Подрядчика'}
      </div>
    );
  }

  if (!hasRejectedOrders && uiState === 420) {
    return (
      <div className={'standart'} title={''}>
        Ожидает Заказчика
      </div>
    );
  }

  if ([500, 610].includes(uiState)) {
    return (
      <div className={'accepted'} title={''}>
        {uiState === 500 ? 'Подтвержден' : 'Оплачен полностью'}
      </div>
    );
  }

  if (uiState === 620) {
    return (
      <div className={'rejected'} title={''}>
        Закрыт без расчетов
      </div>
    );
  }

  return null
}


export default RegistryStatusAction;
