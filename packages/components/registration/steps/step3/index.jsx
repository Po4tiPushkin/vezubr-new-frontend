import React, { useCallback, useMemo, useState } from 'react';
import { Ant, showError, VzForm } from "@vezubr/elements";
import PropTypes from 'prop-types';
import { validateRequiredInput, validateConfirmPassword, validateInn, validatePassword, validateKpp } from './validate';
import DataUsage from "@vezubr/common/assets/agreements/Согласие на обработку персональных данных.pdf";
import PrivacyPolicy from '@vezubr/common/assets/agreements/Политика конфиденциальности.pdf';
import UserAgreement from '@vezubr/common/assets/agreements/Правила пользования платформой.pdf';
import { Organization as DDService, Register as RegisterService } from "@vezubr/services";
import Loader from '../../../loader';

const FIELDS = {
  email: 'email',
  inn: 'inn',
  kpp: 'kpp',
  name: 'name',
  surname: 'surname',
  password: 'password',
  confirm: 'confirm',
}

function RegisterStep3({ form, onSave, role, registerManual }) {
  const { getFieldDecorator, getFieldError, getFieldValue } = form;
  const [innSuggestions, setInnSuggestions] = useState([]);
  const [checkInn, setCheckInn] = useState(false);
  const [innCheckText, setInnCheckText] = useState('');
  const [innError, setInnError] = useState(false);
  const validators = {
    [FIELDS.inn]: (value) => validateInn(value, true),
    [FIELDS.name]: (value) => validateRequiredInput(value, true),
    [FIELDS.surname]: (value) => validateRequiredInput(value, true),
    [FIELDS.password]: (value) => validatePassword(value),
    [FIELDS.confirm]: (value) => validateConfirmPassword(value, getFieldValue(FIELDS.password), true),
    [FIELDS.kpp]: (value) => validateKpp(value),
  };

  const openFile = (file) => {
    window.open(file);
  }

  const getInnSuggestions = async (value) => {
    try {
      return (await DDService.getOrganization(value)) || [];
    } catch (e) {
      if (e?.message !== undefined) {
        console.error(e);
        showError(e);
      }
    }
    return [];
  };

  const handleSearch = useCallback(
    async (value) => {
      if (!value || value.length < 10) {
        return;
      }

      const suggestions = await getInnSuggestions(value);
      setInnSuggestions(suggestions);
    },
    [getInnSuggestions],
  );

  const dataSourceInnSuggestions = useMemo(
    () =>
      innSuggestions.map((data) => ({
        value: data?.inn,
        text: `${data?.shortName} / ${data?.inn}`,
      })),
    [innSuggestions],
  );

  const initInnCheck = async () => {
    const inn = getFieldValue('inn');
    const kpp = getFieldValue('kpp');
    if (inn && !checkInn && (inn.length === 12 || inn.length === 10) && (!kpp || kpp?.length === 9)) {
      try {
        setCheckInn(true);
        const payload = { inn, role: +role }
        if (kpp) {
          payload.kpp = kpp
        }
        await RegisterService.checkInn(payload)
        setCheckInn(false);
        setInnError(false);
        setInnCheckText('');
      } catch (e) {
        if (e.data?.status === false) {
          setInnCheckText(`Такой ИНН${kpp ? ' и КПП ' : ' '}уже существует`);
          setInnError(true);
          setCheckInn(false);
        }
        else {
          showError(e);
          console.error(e);
        }

      }

    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (checkInn) {
      showError('Дождитесь проверки уникальности ИНН');
      return;
    }

    if (getFieldValue('inn')?.length !== 12 && getFieldValue('inn')?.length !== 10) {
      showError('ИНН должен состоять из 10 или 12 цифр');
      return;
    }

    if (innError) {
      showError('Задайте уникальный ИНН');
      return;
    }

    const response = await getInnSuggestions(getFieldValue('inn'));
    const org = response[0] || null;
    if (onSave) {
      onSave(form, org);
    }
  }

  const rules = VzForm.useCreateAsyncRules(validators);

  return (
    <Ant.Form className={'registration-form'} onSubmit={handleSubmit} >
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item label={'ИНН Компании или ИП'} error={getFieldError(FIELDS.inn) || innCheckText}>
              {getFieldDecorator(FIELDS.inn, {
                rules: rules[FIELDS.inn](),
              })(
                <Ant.AutoComplete
                  dataSource={dataSourceInnSuggestions}
                  onSearch={handleSearch}
                  placeholder="Введите ИНН"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: '515px' }}
                  onBlur={() => initInnCheck()}
                  onSelect={() => initInnCheck()}
                />
              )}
              {checkInn ? <div className="inn-check"><Loader /> Идет проверка ИНН</div> : ''}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'КПП'} error={getFieldError(FIELDS.kpp)}>
              {getFieldDecorator(FIELDS.kpp, {
                rules: rules[FIELDS.kpp](),
              })(
                <Ant.Input
                  placeholder="Введите КПП"
                  onBlur={() => initInnCheck()}
                />
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Электронная почта'} error={getFieldError(FIELDS.email)}>
              {getFieldDecorator(FIELDS.email, {
                rules: [
                  {
                    type: 'email',
                    message: 'Введите правильную почту',
                  },
                  {
                    required: true,
                    message: 'Заполните поле',
                  }
                ],
              })(
                <Ant.Input />
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Имя пользователя'} error={getFieldError(FIELDS.name)}>
              {getFieldDecorator(FIELDS.name, {
                rules: rules[FIELDS.name](),
              })(
                <Ant.Input autoComplete="new-name" />
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Фамилия пользователя'} error={getFieldError(FIELDS.surname)}>
              {getFieldDecorator(FIELDS.surname, {
                rules: rules[FIELDS.surname](),
              })(
                <Ant.Input />
              )}
            </VzForm.Item>
          </VzForm.Col>
          <div className="form-inputs-line" />
          <VzForm.Col span={12}>
            <VzForm.Item label={'Введите пароль'} error={getFieldError(FIELDS.password)}>
              {getFieldDecorator(FIELDS.password, {
                rules: rules[FIELDS.password](),
              })(
                <Ant.Input.Password autoComplete="new-password" />
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Повторите пароль'} error={getFieldError(FIELDS.confirm)}>
              {getFieldDecorator(FIELDS.confirm, {
                rules: rules[FIELDS.confirm](),
              })(
                <Ant.Input.Password />
              )}
            </VzForm.Item>
          </VzForm.Col>

          <div className='margin-top-15' style={{ 'textAlign': 'center', 'width': '100%' }}>
            {registerManual}
          </div>

          <div
            className={'vz-input margin-top-20 flexbox tos'}
            style={{ backgroundColor: '#fff', border: '1px solid #fff' }}
          >
            <span className={'margin-top-13'}>
              Регистрируясь в системе &ldquo;Vezubr&rdquo;, вы даете &nbsp;
              <span className={'download-document'} onClick={() => openFile(DataUsage)}>Согласие на обработку персональных данных</span>
              &nbsp; и соглашаетесь с&nbsp;
              <span className={'download-document'} onClick={() => openFile(PrivacyPolicy)}>Политикой конфиденциальности</span>
              ,&nbsp;
              <span className={'download-document'} onClick={() => openFile(UserAgreement)}>Правилами пользования платформой</span>
              .
            </span>
          </div>
          <VzForm.Col span={24}>
            <Ant.Button type={'primary'} htmlType="submit" >
              Завершить регистрацию
            </Ant.Button>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
    </Ant.Form>
  )
}

RegisterStep3.propTypes = {
  form: PropTypes.object,
  onSave: PropTypes.func,
}

export default Ant.Form.create({ name: 'register_form' })(RegisterStep3);
