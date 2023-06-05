import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import { Unit as UnitService } from '@vezubr/services';
import moment from 'moment';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';
import Validators from '@vezubr/common/common/validators';
import UserFormGroups from './components/groups';
import { useSelector } from 'react-redux'

const FIELDS = {
  surname: 'surname',
  name: 'name',
  patronymic: 'patronymic',
  role: 'role',
  email: 'email',
  phone: 'phone',
  timezone: 'timezone',
  currentPassword: 'currentPassword',
  newPassword: 'newPassword',
  confirmPassword: 'confirmPassword',
  employeeRoles: 'employeeRoles',
  hasDigitalSignature: 'hasDigitalSignature',
  digitalSignatureIssuedAtDate: 'digitalSignatureIssuedAtDate',
  digitalSignatureValidTill: 'digitalSignatureValidTill',
  digitalSignatureIdentifier: 'digitalSignatureIdentifier',
  digitalSignatureOperator: 'digitalSignatureOperator',
  unit: 'unit',
};

const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';
const PHONE_MASK = '+7 (999) 999-99-99';

function ProfileUserForm(props) {
  const { onSave, dictionaries, form, disabled = false, values = {}, onPasswordChange, errors, goToEdit } = props;
  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue } = form;
  const user = useSelector(state => state.user)
  const [unitList, setUnitList] = useState([]);
  const [groups, setGroups] = useState(values?.requestGroupIds || []);
  const [loading, setLoading] = useState(false);
  const rules = VzForm.useCreateAsyncRules(Validators.createEditUser);
  const employeeRolesOptions = useMemo(() => {
    return dictionaries?.employeeRoles?.map(({ id, title }) => (
      <Ant.Select.Option key={id} value={id}>
        {title}
      </Ant.Select.Option>
    ));
  }, []);

  const unitsOptions = useMemo(() => {
    return unitList.map((el) => (
      <Ant.Select.Option value={el.id} key={el.id}>
        {el.title}
      </Ant.Select.Option>
    ));
  }, [unitList]);

  const getUnits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await UnitService.list({ itemsPerPage: 1000000 });
      setUnitList(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUnits();
  }, []);

  const timeZoneOptions = useMemo(() => {
    const currentTimezone = moment.tz.guess();
    const timezones = moment.tz.names().filter((timezone) => timezone !== currentTimezone);
    timezones.unshift(currentTimezone);

    return timezones.map((timeZoneName) => (
      <Ant.Select.Option key={timeZoneName} value={timeZoneName}>
        {timeZoneName}
      </Ant.Select.Option>
    ));
  }, []);

  const digitalSignatureOperatorTypes = useMemo(() => {
    return dictionaries?.digitalSignatureOperator?.map(({ id, title }) => (
      <Ant.Select.Option key={id} value={id}>
        {title}
      </Ant.Select.Option>
    ));
  }, [dictionaries?.digitalSignatureOperator]);

  const userRolesOptions = useMemo(
    () =>
      dictionaries?.userRoles?.map(({ id, title }) => (
        <Ant.Select.Option key={id} value={Number(id)}>
          {title}
        </Ant.Select.Option>
      )),
    [dictionaries],
  );

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      const extraData = {
        groups,
      };
      if (onSave) {
        onSave(form, extraData);
      }
    },
    [form, onSave, groups],
  );

  const onChange = useCallback(
    (e) => {
      e.preventDefault();
      if (onPasswordChange) {
        onPasswordChange(form);
      }
    },
    [form, onPasswordChange],
  );

  return (
    <div style={{ width: '100%' }}>
      <div className={'flexbox'}>
        <div className={'flexbox column size-1'}>
          <div className={'company-info'}>
            <VzForm.Group>
              <VzForm.Row>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Фамилия'} error={getFieldError(FIELDS.surname)}>
                    {getFieldDecorator(FIELDS.surname, {
                      // rules: [{ required: true, message: 'Обязательное поле' }],
                      rules: rules[FIELDS.surname](getFieldsValue()),
                      initialValue: values?.[FIELDS.surname] || '',
                    })(<Ant.Input disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Тип пользователя'} error={getFieldError(FIELDS.role)}>
                    {getFieldDecorator(FIELDS.role, {
                      // rules: [{ required: true, message: 'Обязательное поле' }],
                      rules: rules[FIELDS.role](getFieldsValue()),
                      initialValue: values?.[FIELDS.role] || '',
                    })(
                      <Ant.Select disabled={disabled} showSearch={true} optionFilterProp={'children'}>
                        {userRolesOptions}
                      </Ant.Select>,
                    )}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Имя'} error={getFieldError(FIELDS.name)}>
                    {getFieldDecorator(FIELDS.name, {
                      // rules: [{ required: true, message: 'Обязательное поле' }],
                      rules: rules[FIELDS.name](getFieldsValue()),
                      initialValue: values?.[FIELDS.name] || '',
                    })(<Ant.Input disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item
                    disabled={disabled}
                    label={'Роль пользователя'}
                    error={getFieldError(FIELDS.employeeRoles)}
                  >
                    {getFieldDecorator(FIELDS.employeeRoles, {
                      // rules: [{ required: true, message: 'Обязательное поле' }],
                      rules: rules[FIELDS.employeeRoles](getFieldsValue()),
                      initialValue: values?.[FIELDS.employeeRoles],
                    })(
                      <Ant.Select disabled={disabled} showSearch={true} optionFilterProp={'children'} mode={'multiple'}>
                        {employeeRolesOptions}
                      </Ant.Select>,
                    )}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Отчество'} error={getFieldError(FIELDS.patronymic)}>
                    {getFieldDecorator(FIELDS.patronymic, {
                      initialValue: values?.[FIELDS.patronymic] || '',
                      rules: rules[FIELDS.patronymic](getFieldsValue()),
                    })(<Ant.Input disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Номер телефона'} error={getFieldError(FIELDS.phone)}>
                    {getFieldDecorator(FIELDS.phone, {
                      // rules: [{ required: true, message: 'Обязательное поле' }],
                      rules: rules[FIELDS.phone](getFieldsValue()),
                      initialValue: values?.[FIELDS.phone],
                    })(
                      <InputMask disabled={disabled} mask={PHONE_MASK}>
                        <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                      </InputMask>,
                    )}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Часовой пояс'} error={getFieldError(FIELDS.timezone)}>
                    {getFieldDecorator(FIELDS.timezone, {
                      // rules: [{ required: true, message: 'Обязательное поле' }],
                      rules: rules[FIELDS.timezone](getFieldsValue()),
                      initialValue: values?.[FIELDS.timezone] || '',
                    })(
                      <Ant.Select disabled={disabled} showSearch={true} optionFilterProp={'children'}>
                        {timeZoneOptions}
                      </Ant.Select>,
                    )}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item
                    disabled={disabled}
                    label={'Электронная почта'}
                    error={(errors?.email ? errors.email[0] : undefined) || getFieldError(FIELDS.email)}
                  >
                    {getFieldDecorator(FIELDS.email, {
                      // rules: [
                      //   {
                      //     pattern:
                      //       /^([\d\w])+([\d\w".+\-"])*@([\d\w"\-"])*\.([\d\w])*$/,
                      //     message: 'Неверный формат почты',
                      //   },
                      //   {
                      //     required: true, message: 'Обязательное поле'
                      //   }
                      // ],
                      rules: rules[FIELDS.email](getFieldsValue()),
                      initialValue: values?.[FIELDS.email] || '',
                    })(<Ant.Input disabled={disabled} placeholder={''} />)}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} label={'Подразделение'} error={getFieldError(FIELDS.unit)}>
                    {getFieldDecorator(FIELDS.unit, {
                      initialValue: values?.[FIELDS.unit]?.id,
                      rules: rules[FIELDS.unit](getFieldsValue()),
                    })(
                      <Ant.Select loading={loading} disabled={disabled} showSearch={true}>
                        {unitsOptions}
                      </Ant.Select>,
                    )}
                  </VzForm.Item>
                </VzForm.Col>
                {APP === 'dispatcher' && <UserFormGroups groups={groups} setGroups={setGroups} disabled={disabled} />}
              </VzForm.Row>
            </VzForm.Group>
            <VzForm.Group>
              <VzForm.Row>
                <VzForm.Col span={12}>
                  <VzForm.Item disabled={disabled} error={getFieldError(FIELDS.hasDigitalSignature)}>
                    {getFieldDecorator(FIELDS.hasDigitalSignature, {
                      initialValue: values?.[FIELDS.hasDigitalSignature] || false,
                      rules: rules[FIELDS.hasDigitalSignature](getFieldsValue()),
                    })(
                      <VzForm.FieldSwitch
                        disabled={disabled}
                        checkedTitle={'Наличие ЭЦП'}
                        unCheckedTitle={'Наличие ЭЦП'}
                        colorChecked={false}
                        checked={getFieldValue(FIELDS.hasDigitalSignature) || false}
                      />,
                    )}
                  </VzForm.Item>
                </VzForm.Col>
              </VzForm.Row>
              {getFieldValue(FIELDS.hasDigitalSignature) && (
                <>
                  <VzForm.Row>
                    <VzForm.Col span={12}>
                      <VzForm.Item
                        disabled={disabled}
                        label={'Оператоп, выдавший КЭП'}
                        error={getFieldError(FIELDS.digitalSignatureOperator)}
                      >
                        {getFieldDecorator(FIELDS.digitalSignatureOperator, {
                          // rules: [{ required: getFieldValue(FIELDS.hasDigitalSignature), message: 'Обязательное поле' }],
                          rules: rules[FIELDS.digitalSignatureOperator](getFieldsValue()),
                          initialValue: values?.[FIELDS.digitalSignatureOperator] || '',
                        })(
                          <Ant.Select disabled={disabled} showSearch={true} optionFilterProp={'children'}>
                            {digitalSignatureOperatorTypes}
                          </Ant.Select>,
                        )}
                      </VzForm.Item>
                    </VzForm.Col>
                    <VzForm.Col span={12}>
                      <VzForm.Item
                        disabled={disabled}
                        label={'Идентификатор КЭП'}
                        error={getFieldError(FIELDS.digitalSignatureIdentifier)}
                      >
                        {getFieldDecorator(FIELDS.digitalSignatureIdentifier, {
                          // rules: [{ required: getFieldValue(FIELDS.hasDigitalSignature), message: 'Обязательное поле' }],
                          rules: rules[FIELDS.digitalSignatureIdentifier](getFieldsValue()),
                          initialValue: values?.[FIELDS.digitalSignatureIdentifier] || '',
                        })(<Ant.Input disabled={disabled} placeholder={''} />)}
                      </VzForm.Item>
                    </VzForm.Col>
                  </VzForm.Row>
                  <VzForm.Row>
                    <VzForm.Col span={12}>
                      <VzForm.Item
                        disabled={disabled}
                        label={'Начало действия подписи'}
                        error={getFieldError(FIELDS.digitalSignatureIssuedAtDate)}
                      >
                        {getFieldDecorator(FIELDS.digitalSignatureIssuedAtDate, {
                          // rules: { required: getFieldValue(FIELDS.hasDigitalSignature), message: 'Обязательное поле' },
                          rules: rules[FIELDS.digitalSignatureIssuedAtDate](getFieldsValue()),
                          initialValue: moment(values?.[FIELDS.digitalSignatureIssuedAtDate]).isValid()
                            ? moment(values?.[FIELDS.digitalSignatureIssuedAtDate])
                            : null,
                        })(
                          <Ant.DatePicker
                            disabled={disabled}
                            allowClear={true}
                            placeholder={'дд.мм.гггг'}
                            format={'DD.MM.YYYY'}
                          />,
                        )}
                      </VzForm.Item>
                    </VzForm.Col>
                    <VzForm.Col span={12}>
                      <VzForm.Item
                        disabled={disabled}
                        label={'Конец действия подписи'}
                        error={getFieldError(FIELDS.digitalSignatureValidTill)}
                      >
                        {getFieldDecorator(FIELDS.digitalSignatureValidTill, {
                          // rules: { required: getFieldValue(FIELDS.hasDigitalSignature), message: 'Обязательное поле' },
                          rules: rules[FIELDS.digitalSignatureValidTill](getFieldsValue()),
                          initialValue: moment(values?.[FIELDS.digitalSignatureValidTill]).isValid()
                            ? moment(values?.[FIELDS.digitalSignatureValidTill])
                            : null,
                        })(
                          <Ant.DatePicker
                            disabled={disabled}
                            allowClear={true}
                            placeholder={'дд.мм.гггг'}
                            format={'DD.MM.YYYY'}
                          />,
                        )}
                      </VzForm.Item>
                    </VzForm.Col>
                  </VzForm.Row>
                </>
              )}
            </VzForm.Group>
            <VzForm.Group>
              <VzForm.Actions>
                <Ant.Button
                  disabled={disabled}
                  type="primary"
                  onClick={handleSave}
                  className={'semi-wide margin-left-16'}
                >
                  Сохранить
                </Ant.Button>
                {(disabled && goToEdit) ? (
                  <Ant.Button
                    type="primary"
                    onClick={goToEdit}
                    disabled={!IS_ADMIN && user.decoded.userId != values?.id}
                    className={'semi-wide margin-left-16'}
                  >
                    Редактировать
                  </Ant.Button>
                ) : null}
              </VzForm.Actions>
            </VzForm.Group>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ant.Form.create({})(ProfileUserForm);
