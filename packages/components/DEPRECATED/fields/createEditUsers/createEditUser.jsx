import moment from 'moment';
import React, { Fragment } from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, VzForm, Ant, showError, showAlert } from '@vezubr/elements';
import InputField from '../../../inputField/inputField';
import { Utils, Validators } from '@vezubr/common/common';
import { Profile as ProfileService } from '@vezubr/services';
import Static from '@vezubr/common/constants/static';

import ProfileCardBindingList from '../../../profileCardBinding/List';
import ProfileCardFinishCard from '../../../profileCardBinding/FinishCard';


class CreateEditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: _cloneDeep(Static.userFields),
      errors: {
        type: false,
        name: false,
        surname: false,
        phone: false,
        email: false,
        timezone: false,
      },
      passData: {},
      passErrors: {},
      editAddress: false,
      address: false,
      timezone: false,
    };
    this.validators = Validators.createEditUser;
  }

  async componentWillMount() {
    const { store } = this.props;
    this.setUserRoles();
    this.subscriber = store.subscribe(() => {
      this.setUserRoles();
    });
  }

  async setUserRoles() {
    const { store } = this.props;
    const { userRoles = {} } = store.getState().dictionaries;
    await this.setState({ userRoles });
    this.setEditableUserData();
  }

  setEditableUserData() {
    const { user, store } = this.props;
    const { data, userRoles } = this.state;

    const isMe = store.getState().user.decoded.userId === user.id;
    this.setState({ isMe });
    if (user && Object.keys(userRoles).length) {
      const formatted =
        APP === 'producer' || APP === 'operator'
          ? Utils.convertUserDataToEditDataForProducer(data, user, userRoles)
          : Utils.convertUserDataToEditData(data, user, userRoles);
      this.setState({ data: {...formatted, type: {val: userRoles[user?.role], key: user?.role }}, });
    }
  }

  @autobind
  setFileData(fileData) {
    const { data } = this.state;
    data.attachedFiles.push(fileData);
    this.setState({ data });
  }

  handleChange(type, val, integer) {
    const { data: dataPrev, errors: errorsPrev } = this.state;
    const data = { ...dataPrev };
    const errors = { ...errorsPrev };

    errors[type] = false;

    const value = val?.target ? val.target.value : val;
    data[type] = integer ? parseInt(value) : value;
    this.setState({ data, errors });
  }

  onBlur(type) {
    const { data, errors } = this.state;
    if (errors[type]) {
      errors[type] = this.validators[type](data[type]);
      this.setState({ errors });
    }
  }

  validate() {
    const { data, errors } = this.state;
    errors.type = this.validators.type(data.type);
    errors.name = this.validators.name(data.name);
    errors.surname = this.validators.surname(data.surname);
    errors.phone = this.validators.phone(data.phone);
    errors.email = this.validators.email(data.email);
    errors.timezone = this.validators.timezone(data.timezone);
    this.setState({ errors });
    const totalErrors = Object.values(errors).filter((e) => !e);
    return totalErrors.length === Object.keys(errors).length;
  }

  async submit() {
    const { data, errors } = this.state;
    const { onComplete, user } = this.props;
    const { observer } = this.context;
    const valid = this.validate();
    this.setState({ loading: true });
    if (valid) {
      try {
        const _data = _cloneDeep(data);
        _data.role = parseInt(data.type.key);
        _data.phone = data.phone.replace(/\D/g, '');
        if (user) {
          await ProfileService.contractorUserUpdate(user.id, _data);
        } else {
          await ProfileService.contractorUserAdd(_data);
        }
        observer.emit('alert', {
          title: `Готово`,
          message: `Профиль пользователя успешно ${user ? 'обновлен' : 'создан'}`,
          cb: () => {
            onComplete();
            this.setState({ loading: false });
          },
        });
      } catch (e) {
        if (e.error_no === 32) {
          errors.email = t.error(454);
        } else if (e.error_no === 33) {
          errors.phone = t.error('invalidPhone');
        } else if (e.error_no === 406) {
          errors.phone = t.error(406);
        } else {
          if (e.data) {
            let errMesg = '';
            Object.keys(e.data).forEach(el => {
              errors[el] = e.data[el][0];
              errMesg = errMesg + ' ' + e.data[el][0];
            });
            showAlert({
              title: 'Ошибка',
              content: 'Не смог создать пользователя: ' + errMesg,
              onOk: () => {},
            });
          }
        }
        this.setState({ loading: false, errors });
      }
    }
    this.setState({ loading: false });
  }

  async validatePasswordFields() {
    const { passData, passErrors } = this.state;
    if (!passData.currentPassword) {
      passErrors.currentPassword = t.error('requiredField');
    }
    if (!passData.password) {
      passErrors.password = t.error('requiredField');
    }
    if (!passData.passwordConfirm) {
      passErrors.passwordConfirm = t.error('requiredField');
    }
    if (passData.passwordConfirm && passData.passwordConfirm && passData.password !== passData.passwordConfirm) {
      passErrors.passwordConfirm = `Пароли не совпадают.`;
    }
    await this.setState({ passErrors });
  }

  handleChangePass(type, val) {
    const { passData, passErrors } = this.state;
    const value = val.target ? val.target.value : val;
    passData[type] = value;
    passErrors[type] = false;
    this.setState({ passData, passErrors });
  }

  async updatePassword() {
    const { observer } = this.context;
    await this.validatePasswordFields();
    const { passData, passErrors } = this.state;
    if (Object.values(passErrors).filter((e) => e).length) return;
    this.setState({ passwordLoading: true });
    try {
      await ProfileService.passwordChange({
        currentPassword: passData.currentPassword,
        password: {
          new: passData.password,
          confirm: passData.passwordConfirm
        }
      });
      observer.emit('alert', {
        title: `Готово`,
        message: `Пароль обновлен`,
      });
      this.setState({ passwordLoading: false });
    } catch (e) {
      console.warn(e);
      observer.emit('alert', {
        title: `Ошибка`,
        message: t.error(e.data.message),
      });
      this.setState({ passwordLoading: false });
    }
  }

  get timezoneOptions() {
    let currentTimezone = moment.tz.guess();

    const timezones = moment.tz.names().filter((timezone) => timezone !== currentTimezone);
    timezones.unshift(currentTimezone);

    return timezones.map((timeZoneName) => (
      <Ant.Select.Option key={timeZoneName} value={timeZoneName}>
        {timeZoneName}
      </Ant.Select.Option>
    ));
  }

  get employeeRolesOptions(){
    const { store } = this.props;
    const { employeeRoles = [] } = store.getState().dictionaries 
    return employeeRoles.map(({ id, title }) => (
      <Ant.Select.Option key={id} value={id} title={title}>
        {title}
      </Ant.Select.Option>
    ));
  }

  render() {
    const { data, errors, userRoles, loading, isMe, passwordLoading, passErrors, passData, timezone } = this.state;
    const { actions, user, readOnly = false, profileCardBinding, cardComponent } = this.props;

    return (
      <div style={{ width: '100%' }}>
        <div className={'flexbox'}>
          <div className={'flexbox column size-1'}>
            <div className={'area flexbox'}>
              <div className={'area-left'}>
                <InputField
                  title={t.profile('lastName')}
                  type={'text'}
                  readonly={readOnly}
                  name={'lastName'}
                  showSuggestions={'surname'}
                  shortInfo={{
                    title: t.order('infoContactNameTitle'),
                    description: t.order('infoContactNameDescr'),
                  }}
                  error={errors.surname}
                  value={data.surname}
                  onBlur={() => this.onBlur('surname')}
                  onChange={(e) => this.handleChange('surname', e)}
                />
              </div>
              <div className={'area-right margin-left-8'}>
                <InputField
                  title={t.profile('userType')}
                  placeholder={t.order('selectFromList')}
                  type={'text'}
                  name={'type'}
                  readonly={readOnly}
                  dropDown={{
                    data: userRoles,
                  }}
                  shortInfo={{
                    title: t.order('infoLoadingMethodTitle'),
                    description: t.order('infoLoadingMethodDescr'),
                  }}
                  error={errors.type}
                  value={data.type.val || userRoles[user?.role] || ''}
                  onBlur={() => this.onBlur('type')}
                  onChange={(e) => this.handleChange('type', e)}
                />
              </div>
            </div>
            <div className={'area flexbox'}>
              <div className={'area-left'}>
                <InputField
                  title={t.profile('firstName')}
                  type={'text'}
                  readonly={readOnly}
                  name={'firstName'}
                  shortInfo={{
                    title: t.order('infoContactNameTitle'),
                    description: t.order('infoContactNameDescr'),
                  }}
                  error={errors.name}
                  value={data.name}
                  showSuggestions={'name'}
                  onBlur={() => this.onBlur('name')}
                  onChange={(e) => this.handleChange('name', e)}
                />
              </div>
              <div className={'area-right margin-left-8'}>
                <VzForm.Item label={'Роль пользователя'} error={errors.employeeRoles} disabled={readOnly}>
                  <Ant.Select 
                    disabled={readOnly} 
                    name={'employeeRoles'}
                    value={data.employeeRoles}
                    mode={"multiple"}
                    showSearch={true} 
                    placeholder={t.order('selectFromList')}
                    onChange={(value) => this.handleChange('employeeRoles', value)}
                    onBlur={() => this.onBlur('employeeRoles')}
                    optionFilterProp={'children'}
                  >
                    {this.employeeRolesOptions}
                  </Ant.Select>
                </VzForm.Item>
              </div>
            </div>
            <div className={'area flexbox'}>
              <div className={'area-left'}>
                <InputField
                  title={t.profile('middleName')}
                  type={'text'}
                  readonly={readOnly}
                  name={'middleName'}
                  shortInfo={{
                    title: t.order('infoContactNameTitle'),
                    description: t.order('infoContactNameDescr'),
                  }}
                  value={data.patronymic || ''}
                  showSuggestions={'patronymic'}
                  onBlur={() => this.onBlur('patronymic')}
                  onChange={(e) => this.handleChange('patronymic', e)}
                />
              </div>
              <div className={'area-right margin-left-8'}>
                <InputField
                  title={`${t.reg('phoneNumber')}`}
                  placeholder={'+7 (___) ___-__-__'}
                  mask={'+7 (999) 999-99-99'}
                  telephone={true}
                  type={'text'}
                  readonly={readOnly}
                  name={'phone'}
                  className={data.phone.length ? 'active' : ''}
                  value={data.phone}
                  error={errors.phone}
                  shortInfo={{
                    title: t.order('infoPhoneTitle'),
                    description: t.order('infoPhoneDescr'),
                  }}
                  onBlur={() => this.onBlur('phone')}
                  onChange={(e) => this.handleChange('phone', e)}
                />
              </div>
            </div>
            <div className={'area flexbox'}>
              <div className={'area-left'}>
                <VzForm.Item label={'Часовой пояс'} error={errors.timezone} disabled={readOnly}>
                  <Ant.Select
                    type={'text'}
                    disabled={readOnly}
                    name={'timezone'}
                    allowClear={true}
                    showSearch={true}
                    optionFilterProp={'children'}
                    placeholder={t.order('selectFromList')}
                    onChange={(value) => this.handleChange('timezone', value)}
                    onBlur={() => this.onBlur('timezone')}
                    value={data.timezone}
                  >
                    {this.timezoneOptions}
                  </Ant.Select>
                </VzForm.Item>
              </div>
              <div className={'area-right margin-left-8'}>
                <InputField
                  title={t.order('contactEmail')}
                  type={'text'}
                  readonly={readOnly}
                  name={'contactEmail'}
                  shortInfo={{
                    title: t.order('infoContactEmailTitle'),
                    description: t.order('infoContactEmailDescr'),
                  }}
                  error={errors.email}
                  showSuggestions={'email'}
                  value={data.email || ''}
                  onBlur={() => this.onBlur('email')}
                  onChange={(e) => this.handleChange('email', e)}
                />
              </div>
            </div>
          </div>
        </div>
        {!readOnly ? (
          <div className={'flexbox'}>
            <div className={'area full-width'}>
              <div className={'flexbox align-right justify-right full-width'}>
                <ButtonDeprecated theme={'primary'} loading={loading} onClick={() => this.submit()} className={'mid'}>
                  {user ? t.profile('editUser') : t.profile('addUser')}
                </ButtonDeprecated>
              </div>
            </div>
          </div>
        ) : null}

        {isMe && !readOnly ? (
          <Fragment>
            <div className={'flexbox'}>
              <div className={'flexbox column size-1'}>
                <div className={'area flexbox'}>
                  <div className={'area-left'}>
                    <InputField
                      title={t.profile('Старый пароль')}
                      type={'password'}
                      error={passErrors.currentPassword}
                      readonly={readOnly}
                      name={'currentPassword'}
                      value={passData.currentPassword}
                      onChange={(e) => this.handleChangePass('currentPassword', e)}
                    />
                  </div>
                  <div className={'area-right margin-left-8'}></div>
                </div>
                <div className={'area flexbox'}>
                  <div className={'area-left'}>
                    <InputField
                      title={t.profile('Новый пароль')}
                      type={'password'}
                      error={passErrors.password}
                      name={'password'}
                      value={passData.password}
                      onChange={(e) => this.handleChangePass('password', e)}
                    />
                  </div>
                  <div className={'area-right margin-left-8'}>
                    <InputField
                      title={t.profile('повторите новый пароль')}
                      type={'password'}
                      error={passErrors.passwordConfirm}
                      name={'passwordConfirm'}
                      value={passData.passwordConfirm}
                      onChange={(e) => this.handleChangePass('passwordConfirm', e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={'flexbox'}>
              <div className={'area no-border full-width'}>
                <div className={'flexbox align-right justify-right full-width'}>
                  <ButtonDeprecated
                    theme={'primary'}
                    loading={passwordLoading}
                    onClick={() => this.updatePassword()}
                    className={'mid'}
                  >
                    {t.buttons('Изменить пароль')}
                  </ButtonDeprecated>
                </div>
              </div>
            </div>
          </Fragment>
        ) : null}
      </div>
    );
  }
}

CreateEditUser.contextTypes = {
  observer: PropTypes.object,
};

CreateEditUser.propTypes = {
  //onCancel: PropTypes.func.isRequired,
  //onAdd: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  profileCardBinding: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  cardComponent: PropTypes.elementType.isRequired,
};

export default CreateEditUser;
