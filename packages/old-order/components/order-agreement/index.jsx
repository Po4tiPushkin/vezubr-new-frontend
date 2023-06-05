import React from 'react';
import transportAgreement from '@vezubr/common/assets/agreements/Общие условия перевозки груза автомобильным транспортом.pdf';
import loaderAgreement from '@vezubr/common/assets/agreements/Общие условия выполненя ПРР.pdf';

function OrderAgreement(props) {
  return (
    <div className={'order-agreement'}>
      Оформляя рейс, вы соглашаетесь с{' '}
      <a href={transportAgreement} target={'_blank'}>
        общими условиями перевозки груза{' '}
      </a>{' '}
      и{' '}
      <a href={loaderAgreement} target={'_blank'}>
        оказания услуг ПРР
      </a>
      .
    </div>
  );
}

export default OrderAgreement;
