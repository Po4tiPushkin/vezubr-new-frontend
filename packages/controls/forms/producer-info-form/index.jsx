import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
import EmployeesTable from './employeesTable';
import InputMask from 'react-input-mask';

const dictionary = {
  id: 'ID',
  inn: 'ИНН',
  kpp: 'КПП',
  fullName: 'Полное наименование',
  phone: 'Телефон',
  addressLegal: 'Юридический адрес',
  addressFact: 'Фактический адрес',
  addressPost: 'Почтовый адрес',
  checkingAccount: 'Расчетный счет',
  correspondentAccount: ' Корреспондентский счет',
  bankName: 'Название банка',
  bik: 'БИК банка',
  name: 'Короткое наименование',
};

const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';
const PHONE_MASK = '+7 (999) 999-99-99';

const FIELDS_ALL_DETAILS = {
  inn: 'inn',
  kpp: 'kpp',
  phone: 'phone',
  fullName: 'fullName',
  name: 'name',
  addressLegal: 'addressLegal',
  addressFact: 'addressFact',
  addressPost: 'addressPost',
};


const BANK_DETAILS = {
  checkingAccount: 'checkingAccount',
  bik: 'bik',
  bankName: 'bankName',
  correspondentAccount: 'correspondentAccount',
};

const FIELDS = {
  ...FIELDS_ALL_DETAILS,
  ...BANK_DETAILS,
  vatRate: 'vatRate',
};

const ProducerInfo = ({ data, dictionaries }) => {
  const makeField = useCallback(
    (key) => {
      const field = FIELDS[key];
      return (
        <VzForm.Col span={field === FIELDS.fullName || field === FIELDS.name ? 12 : 8} key={key}>
          <VzForm.Item label={dictionary[key]} disabled>
            {field == FIELDS.phone ? (
              <InputMask value={data[field]} mask={PHONE_MASK} disabled={true}>
                <Ant.Input placeholder={PHONE_PLACEHOLDER} />
              </InputMask>
            ) : (
              <Ant.Input value={data[field]} placeholder={''} disabled={true} />
            )}  
          </VzForm.Item>
        </VzForm.Col>
      );
    },
    [data],
  );

  return (
    <Ant.Form className="counterparty-main-form" layout="vertical">
      <VzForm.Group title={<h2 className="bold">Данные компании</h2>}>
        <VzForm.Row>{Object.keys(FIELDS_ALL_DETAILS).map((key) => makeField(key))}</VzForm.Row>
      </VzForm.Group>
      <VzForm.Group title={<h2 className="bold">Банковские реквизиты</h2>}>
        <VzForm.Row>{Object.keys(BANK_DETAILS).map((key) => makeField(key))}</VzForm.Row>
      </VzForm.Group>
      <VzForm.Group title={<h2 className="bold">Комментарий</h2>}>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <VzForm.Item label={'Комментарий'} disabled>
              <Ant.Input.TextArea rows={2} value={data?.contourContractorComment} disabled />
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
      <VzForm.Group title={<h2 className="bold">Контактные данные ответственных сотрудников</h2>}>
        <VzForm.Row>
          <EmployeesTable employeesList={data?.contourContractorResponsibleEmployees || []} />
        </VzForm.Row>
      </VzForm.Group>

    </Ant.Form>
  );
};

ProducerInfo.propTypes = {
  data: PropTypes.object,
  dictionaries: PropTypes.object,
};

export default ProducerInfo;
