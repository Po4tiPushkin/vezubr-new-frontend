import moment from "moment";
import React, { Fragment } from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, VzForm, Ant } from '@vezubr/elements';
import InputField from '../../../inputField/inputField';
import { Utils, Validators } from '@vezubr/common/common';
import { Profile as ProfileService } from '@vezubr/services';
import Static from '@vezubr/common/constants/static';
import Cookies from '@vezubr/common/common/cookies';
import { showAlert } from "@vezubr/elements";

class CreateEditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: _cloneDeep(Static.producerUserFields),
      isMe: false,
      errors: {
        type: false,
        name: false,
        surname: false,
        phone: false,
        email: false,
      },
      digitalSignatureType: {},
      editAddress: false,
      passData: {},
      passErrors: {},
      address: false,
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
    const { store, readOnly } = this.props;
    const { userRoles = {}, digitalSignatureType = {} } = store.getState().dictionaries;
    await this.setState({ userRoles, digitalSignatureType, readOnly });
    this.setEditableUserData();
  }

  async setEditableUserData() {
    const { user, store } = this.props;
    const { data, userRoles, digitalSignatureType } = this.state;
    const userData = (await ProfileService.user(user.id));
    const isMe = store.getState().user.decoded.userId === userData.id;
    this.setState({ isMe });
    if (user && Object.keys(userRoles).length) {
      const formatted = Utils.convertUserDataToEditDataForProducer(
        data,
        userData,
        userRoles,
        isMe,
        digitalSignatureType,
      );
      this.setState({ data: formatted });
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
    errors.email = this.validators.email(data.email);
    this.setState({ data, errors });
  }

  handleChangePass(type, val) {
    const { passData, passErrors } = this.state;
    const value = val.target ? val.target.value : val;
    passData[type] = value;
    passErrors[type] = false;
    this.setState({ passData, passErrors });
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
    this.setState({ errors });
    const totalErrors = Object.values(errors).filter((e) => !e);
    return totalErrors.length === Object.keys(errors).length;
  }

  async validatePasswordFields() {
    const { passData, passErrors } = this.state;
    if (!passData.oldPassword) {
      passErrors.oldPassword = t.error('requiredField');
    }
    if (!passData.newPassword) {
      passErrors.newPassword = t.error('requiredField');
    }
    if (!passData.newPasswordConfirm) {
      passErrors.newPasswordConfirm = t.error('requiredField');
    }
    if (passData.newPassword && passData.newPasswordConfirm && passData.newPassword !== passData.newPasswordConfirm) {
      passErrors.newPasswordConfirm = `Пароли не совпадают.`;
    }
    await this.setState({ passErrors });
  }

  async updatePassword() {
    const { observer } = this.context;
    await this.validatePasswordFields();
    const { passData, passErrors } = this.state;
    if (Object.values(passErrors).filter((e) => e).length) return;
    this.setState({ passwordLoading: true });
    try {
      await ProfileService.passwordChange({
        currentPassword: passData.oldPassword,
        password: {
          new: passData.newPassword,
          confirm: passData.newPasswordConfirm
        }
      });
      // Cookies.delete(APP + 'Token');
      // Cookies.set(APP + 'Token', token);
      observer.emit('alert', {
        title: `Готово`,
        message: `Пароль обновлен`,
      });
      this.setState({ passwordLoading: false });
    } catch (e) {
      console.error(e);
      observer.emit('alert', {
        title: `Ошибка`,
        message: t.error(e.data.message),
      });
      this.setState({ passwordLoading: false });
    }
  }

  async submit(noCallback = false, sectionName = 'loading') {
    const { data, errors, passwordLoading } = this.state;
    const { onComplete, user } = this.props;
    const { observer } = this.context;
    const valid = this.validate();
    this.setState({ [sectionName]: true });
    if (valid) {
      try {
        const _data = _cloneDeep(data);
        _data.role = parseInt(data.type.key);
        _data.phone = data.phone.replace(/\D/g, '');
        if (_data.digitalSignatureType) {
          _data.digitalSignatureType = _data.digitalSignatureType.key;
          _data.digitalSignatureValidTill = Utils.reformatStringDate(_data.digitalSignatureValidTill);
          _data.digitalSignatureIssuedAtDate = Utils.reformatStringDate(_data.digitalSignatureIssuedAtDate);
        }
        if (user) {
          await ProfileService.contractorUserUpdate(user.id, _data);
        } else {
          await ProfileService.contractorUserAdd(_data);
        }
        observer.emit('alert', {
          title: `Готово`,
          message: `Профиль пользователя успешно ${user ? 'обновлен' : 'создан'}`,
          cb: () => {
            if (!noCallback) {
              onComplete();
            }
            this.setState({ [sectionName]: false });
          },
        });
      } catch (e) {
        if (e.error_no === 454) {
          errors.email = t.error(454);
        } else if (e.error_no === 406) {
          errors.phone = t.error(406);
        }
        
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
        this.setState({ [sectionName]: false, errors });
      }
    }
    this.setState({ [sectionName]: false });
  }

  get timezoneOptions() {
    let currentTimezone = moment.tz.guess();
    
    const timezones = moment.tz.names().filter(timezone => timezone !== currentTimezone );
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
    const {
      data,
      errors,
      userRoles,
      loading,
      isMe,
      digitalSignatureType,
      readOnly = false,
      passErrors,
      passData,
      passwordLoading = false,
    } = this.state;
    const { user } = this.props;


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
                  shortInfo={{
                    title: t.order('infoContactNameTitle'),
                    description: t.order('infoContactNameDescr'),
                  }}
                  error={errors.surname}
                  value={data.surname}
                  showSuggestions={'surname'}
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
                  value={data.type.val || ''}
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
                  //error={errors.patronymic}
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
                    disabled={readOnly}
                    name={'timezone'}
                    allowClear={true}
                    optionFilterProp={'children'}
                    searchPlaceholder={'Выберите таймзону'}
                    value={data.timezone || ''}
                    onBlur={() => this.onBlur('timezone')}
                    onChange={(value) => this.handleChange('timezone', value)}
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
                  value={data.email || ''}
                  onBlur={() => this.onBlur('email')}
                  onChange={(e) => this.handleChange('email', e)}
                />
              </div>
            </div>
            {/* <div className={'area flexbox'}>
              <InputField
                title={t.order('Наличие ЭЦП')}
                placeholder={''}
                type={'text'}
                readonly={readOnly}
                name={'sanitaryPassport'}
                checkbox={{
                  checked: data.hasDigitalSignature,
                }}
                shortInfo={{}}
                value={data.hasDigitalSignature}
                className={`${data.hasDigitalSignature ? 'size-1' : 'size-0_492'}`}
                onChange={(e) =>
                  readOnly ? void 0 : this.handleChange('hasDigitalSignature', !data.hasDigitalSignature)
                }
              />
              {data.hasDigitalSignature ? (
                <Fragment>
                  <InputField
                    title={t.profile('Тип ЭЦП')}
                    placeholder={t.order('Название типа ЭЦП')}
                    type={'text'}
                    name={'type'}
                    readonly={readOnly}
                    className={'size-1 margin-left-8'}
                    //readonly={readOnly}
                    dropDown={{
                      data: digitalSignatureType,
                    }}
                    shortInfo={{
                      title: t.order('infoLoadingMethodTitle'),
                      description: t.order('infoLoadingMethodDescr'),
                    }}
                    error={errors.digitalSignatureType}
                    value={data.digitalSignatureType.val || ''}
                    onBlur={() => this.onBlur('digitalSignatureType')}
                    onChange={(e) => this.handleChange('digitalSignatureType', e)}
                  />
                  <InputField
                    style={{ height: '56px' }}
                    className={'size-1 margin-left-8'}
                    title={t.order('Срок действия до')}
                    type={'text'}
                    name={'digitalSignatureValidTill'}
                    shortInfo={{}}
                    datePicker={true}
                    readonly={readOnly}
                    error={errors['digitalSignatureValidTill']}
                    placeholder={'дд.мм.гггг'}
                    mask={'99.99.9999'}
                    allowManual={true}
                    strictFormat={true}
                    value={data.digitalSignatureValidTill || ''}
                    onChange={(e) => this.handleChange('digitalSignatureValidTill', e)}
                  />
                </Fragment>
              ) : null}
            </div> */}
          </div>
        </div>
        {!readOnly ? (
          <div className={'flexbox'}>
            <div className={'area full-width'}>
              <div className={'flexbox align-right justify-right full-width'}>
                <ButtonDeprecated theme={'primary'} loading={loading} onClick={() => this.submit()} className={'mid'}>
                  {user ? t.buttons('saveChanges') : t.profile('addUser')}
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
                      error={passErrors.oldPassword}
                      readonly={readOnly}
                      name={'oldPassword'}
                      value={passData.oldPassword}
                      onChange={(e) => this.handleChangePass('oldPassword', e)}
                    />
                  </div>
                  <div className={'area-right margin-left-8'}></div>
                </div>
                <div className={'area flexbox'}>
                  <div className={'area-left'}>
                    <InputField
                      title={t.profile('Новый пароль')}
                      type={'password'}
                      error={passErrors.newPassword}
                      name={'newPassword'}
                      value={passData.newPassword}
                      onChange={(e) => this.handleChangePass('newPassword', e)}
                    />
                  </div>
                  <div className={'area-right margin-left-8'}>
                    <InputField
                      title={t.profile('повторите новый пароль')}
                      type={'password'}
                      error={passErrors.newPasswordConfirm}
                      name={'newPasswordConfirm'}
                      value={passData.newPasswordConfirm}
                      onChange={(e) => this.handleChangePass('newPasswordConfirm', e)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={'flexbox'}>
              <div className={'area full-width'}>
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
};

export default CreateEditUser;
