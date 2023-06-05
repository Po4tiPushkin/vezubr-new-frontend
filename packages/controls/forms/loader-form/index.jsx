import React, { useCallback, useMemo } from 'react';
import { Ant, VzForm, ButtonDeprecated } from '@vezubr/elements';
import moment from 'moment';
import Validators from '@vezubr/common/common/validators';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import { DocViewer } from '@vezubr/uploader';
import { fileGetFileData } from '@vezubr/common/utils';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SpecializationsAdditional from './additionalInfo/specialization';
const FIELDS = {
  surname: 'surname',
  name: 'name',
  patronymic: 'patronymic',
  placeOfBirth: 'placeOfBirth',
  dateOfBirth: 'dateOfBirth',
  passportId: 'passportId',
  passportIssuedAtDate: 'passportIssuedAtDate',
  passportIssuedBy: 'passportIssuedBy',
  passportUnitCode: 'passportUnitCode',
  passportDateOfBirth: 'passportDateOfBirth',
  applicationPhone: 'applicationPhone',
  contactPhone: 'contactPhone',
  registrationAddress: 'registrationAddress',
  factAddress: 'factAddress',
  hasSanitaryBook: 'hasSanitaryBook',
  sanitaryBookExpiresAtDate: 'sanitaryBookExpiresAtDate',
  passportRusResident: 'passportRusResident',
  country: 'country',
  passportPhotoFile: 'passportPhotoFile',
  passportRegistrationFile: 'passportRegistrationFile',
  photoFile: 'photoFile',
  specialities: 'specialities'
};

const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';
const PHONE_MASK = '+7 (999) 999-99-99';

const UNIT_CODE_PLACEHOLDER = '___-___';
const UNIT_CODE_MASK = '999-999';

function LoaderForm(props) {
  const { onSave, form, disabled = false, values = {}, saveButtonText, countryList = [] } = props;
  const history = useHistory();
  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue, setFields } = form;
  const dictionaries = useSelector((state) => state.dictionaries);
  const { loaderSpecialities } = dictionaries || {};
  const [specs, setSpecs] = React.useState([]);

  const rules = VzForm.useCreateAsyncRules(Validators.createEditProducerLoader);

  const countryOptions = useMemo(() => {
    return countryList.map((el) => (
      <Ant.Select.Option title={`${el.title} / ${el.titleEn} / ${el.code}`} key={el.id} value={el.id}>
        {`${el.title} / ${el.titleEn} / ${el.code}`}
      </Ant.Select.Option>
    ));
  }, [countryList]);

  const getInitialValueOfAFile = React.useCallback(
    (fileName) => {
      const file = values[fileName];
      return file?.files ? file?.files[0]?.file : file || null;
    },
    [values],
  );

  const [passportPhotoFile, setPPFile] = React.useState(getInitialValueOfAFile(FIELDS.passportPhotoFile));
  const [passportRegistrationFile, setPRFile] = React.useState(getInitialValueOfAFile(FIELDS.passportRegistrationFile));
  const [photoFile, setPhotoFile] = React.useState(getInitialValueOfAFile(FIELDS.photoFile));

  const defaultFileData = React.useCallback(
    (name) => ({
      fileName: name,
    }),
    [],
  );

  React.useEffect(() => {
    if (!passportPhotoFile) setPPFile(getInitialValueOfAFile(FIELDS.passportPhotoFile));
    if (!passportRegistrationFile) setPRFile(getInitialValueOfAFile(FIELDS.passportRegistrationFile));
    if (!photoFile) setPhotoFile(getInitialValueOfAFile(FIELDS.photoFile));
    if (Array.isArray(values?.specialities) && values?.specialities.length) {
      setSpecs(values?.specialities);
    }
  }, [values]);

  React.useEffect(() => {
    moment.tz.setDefault('Etc/UTC')
    return () => {
      moment.tz.setDefault()
    }
  }, [])

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      form.setFields({
        [FIELDS.specialities]: {
          value: specs?.map(item => item.id)
        }
      })
      const extraData = {
        specialities: specs?.map(item => item.id),
        slingerLicenceValidTill: specs?.find(item => item.id == 'slinger')?.expiresOnDate,
        forkliftOperatorLicenceValidTill: specs?.find(item => item.id == 'forklift_operator')?.expiresOnDate,
        stackerLicenceValidTill: specs?.find(item => item.id == 'stacker')?.expiresOnDate,
      };
      const files = {
        passportRegistrationFile,
        passportPhotoFile,
        photoFile,
      };

      if (onSave) {
        onSave(form, files, extraData);
      }
    },
    [form, onSave, passportRegistrationFile, passportPhotoFile, photoFile, specs],
  );

  React.useEffect(() => {
    form.setFields({
      [FIELDS.specialities]: {
        value: specs?.map(item => item.id)
      }
    })
  }, [specs])

  return (
    <div className={'flexbox'}>
      <div className={'size-1'}>
        <VzForm.Group title="Сканы паспорта специалиста">
          <h6 className={'box-title'}>{t.order('importantBothFiles')}</h6>
          <div className={'flexbox margin-top-20'}>
            <div className={'flexbox size-1'}>
              <DocViewer
                fileData={fileGetFileData(passportPhotoFile) || defaultFileData(t.driver('photoFront'))}
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'passportPhotoFile'}
                editable={true}
                onRemove={() => setPPFile(null)}
                onChange={(fileData) => {
                  setPPFile(fileData);
                }}
              />
            </div>
            <div className={'margin-left-12 flexbox size-1'}>
              <DocViewer
                fileData={fileGetFileData(passportRegistrationFile) || defaultFileData(t.driver('photoBack'))}
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'passportRegistrationFile'}
                editable={true}
                onRemove={() => setPRFile(null)}
                onChange={(fileData) => {
                  setPRFile(fileData);
                }}
              />
            </div>
          </div>
        </VzForm.Group>

        <VzForm.Group title={'Паспортные данные'}>
          <VzForm.Row>
            <VzForm.Col span={8}>
              <VzForm.Item label={'Паспорт РФ'} disabled={disabled} error={getFieldError(FIELDS.passportRusResident)}>
                {getFieldDecorator(FIELDS.passportRusResident, {
                  rules: rules[FIELDS.passportRusResident](getFieldsValue()),
                  initialValue:
                    typeof values?.[FIELDS.passportRusResident] !== 'undefined'
                      ? values?.[FIELDS.passportRusResident]
                      : true,
                })(
                  <VzForm.FieldSwitch
                    disabled={disabled}
                    style={{ padding: '6px 7px' }}
                    checkedTitle={'Да'}
                    unCheckedTitle={'Нет'}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.passportRusResident) || false}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            {!getFieldValue(FIELDS.passportRusResident) ? (
              <>
                <VzForm.Col span={8}>
                  <VzForm.Item
                    disabled={disabled}
                    label={'Страна'}
                    error={getFieldError(FIELDS.country)}
                    required={true}
                  >
                    {getFieldDecorator(FIELDS.country, {
                      rules: rules[FIELDS.country](getFieldsValue()),
                      initialValue: values?.[FIELDS.country] || '',
                    })(
                      <Ant.Select showSearch={true} optionFilterProp={'title'} disabled={disabled} placeholder="Страна">
                        {countryOptions}
                      </Ant.Select>,
                    )}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={8}>
                  <VzForm.Item
                    disabled={disabled}
                    label={'Место рождения'}
                    error={getFieldError(FIELDS.placeOfBirth)}
                    required={true}
                  >
                    {getFieldDecorator(FIELDS.placeOfBirth, {
                      rules: rules[FIELDS.placeOfBirth](getFieldsValue()),
                      initialValue: values?.[FIELDS.placeOfBirth] || '',
                    })(<Ant.Input disabled={disabled} placeholder={'Место рождения'} />)}
                  </VzForm.Item>
                </VzForm.Col>
              </>
            ) : null}
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={8}>
              <VzForm.Item disabled={disabled} label={'Фамилия'} error={getFieldError(FIELDS.surname)} required={true}>
                {getFieldDecorator(FIELDS.surname, {
                  initialValue: values?.[FIELDS.surname] || '',
                  rules: rules[FIELDS.surname](getFieldsValue()),
                })(<Ant.Input disabled={disabled} placeholder={'Фамилия'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item disabled={disabled} label={'Имя'} error={getFieldError(FIELDS.name)} required={true}>
                {getFieldDecorator(FIELDS.name, {
                  rules: rules[FIELDS.name](getFieldsValue()),
                  initialValue: values?.[FIELDS.name] || '',
                })(<Ant.Input disabled={disabled} placeholder={'Имя'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Отчество'}
                error={getFieldError(FIELDS.patronymic)}
                required={getFieldValue(FIELDS.passportRusResident)}
              >
                {getFieldDecorator(FIELDS.patronymic, {
                  initialValue: values?.[FIELDS.patronymic] || '',
                  rules: rules[FIELDS.patronymic](getFieldsValue()),
                })(<Ant.Input disabled={disabled} placeholder={'Отчество'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Серия и номер паспорта'}
                error={getFieldError(FIELDS.passportId)}
                required={true}
              >
                {getFieldDecorator(FIELDS.passportId, {
                  rules: rules[FIELDS.passportId](getFieldsValue()),
                  initialValue: values?.[FIELDS.passportId] || '',
                })(<Ant.Input disabled={disabled} placeholder={'Серия и номер паспорта'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={16}>
              <VzForm.Item
                disabled={disabled}
                label={'Кем выдан'}
                error={getFieldError(FIELDS.passportIssuedBy)}
                required={true}
              >
                {getFieldDecorator(FIELDS.passportIssuedBy, {
                  rules: rules[FIELDS.passportIssuedBy](getFieldsValue()),
                  initialValue: values?.[FIELDS.passportIssuedBy] || '',
                })(<Ant.Input disabled={disabled} placeholder={'Кем выдан'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Дата рождения'}
                error={getFieldError(FIELDS.dateOfBirth)}
                required={true}
              >
                {getFieldDecorator(FIELDS.dateOfBirth, {
                  rules: rules[FIELDS.dateOfBirth](getFieldsValue()),
                  initialValue: moment(values?.[FIELDS.dateOfBirth]).isValid()
                    ? moment(values?.[FIELDS.dateOfBirth])
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
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Дата выдачи'}
                error={getFieldError(FIELDS.passportIssuedAtDate)}
                required={true}
              >
                {getFieldDecorator(FIELDS.passportIssuedAtDate, {
                  rules: rules[FIELDS.passportIssuedAtDate](getFieldsValue()),
                  initialValue: moment(values?.[FIELDS.passportIssuedAtDate]).isValid()
                    ? moment(values?.[FIELDS.passportIssuedAtDate])
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
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Код подразделения'}
                error={getFieldError(FIELDS.passportUnitCode)}
                required={true}
              >
                {getFieldDecorator(FIELDS.passportUnitCode, {
                  rules: rules[FIELDS.passportUnitCode](getFieldsValue()),
                  initialValue: values?.[FIELDS.passportUnitCode] || '',
                })(
                  getFieldValue(FIELDS.passportRusResident) ? (
                    <InputMask mask={UNIT_CODE_MASK}>
                      <Ant.Input placeholder={UNIT_CODE_PLACEHOLDER} allowClear={true} />
                    </InputMask>
                  ) : (
                    <Ant.Input allowClear={true} />
                  ),
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>

        {getFieldDecorator(FIELDS.specialities, {
          rules: rules[FIELDS.specialities](getFieldsValue())
        })(<Ant.Input type={'hidden'} />)}

        <VzForm.Group title={'Специализации'}>
          <SpecializationsAdditional
            error={getFieldError(FIELDS.specialities)}
            loaderSpecialities={loaderSpecialities}
            specs={specs}
            setSpecs={setSpecs}
          />
        </VzForm.Group>

        <VzForm.Group title={'Личные данные'}>
          <VzForm.Row>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Номер телефона для приложения'}
                error={getFieldError(FIELDS.applicationPhone)}
              >
                {getFieldDecorator(FIELDS.applicationPhone, {
                  rules: rules[FIELDS.applicationPhone](getFieldsValue()),
                  initialValue: values?.[FIELDS.applicationPhone] || '',
                })(
                  <InputMask mask={PHONE_MASK}>
                    <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                  </InputMask>,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={16}>
              <VzForm.Item
                disabled={disabled}
                label={'Адрес регистрации'}
                error={getFieldError(FIELDS.registrationAddress)}
                required={true}
              >
                {getFieldDecorator(FIELDS.registrationAddress, {
                  rules: rules[FIELDS.registrationAddress](getFieldsValue()),
                  initialValue: values?.[FIELDS.registrationAddress] || '',
                })(<Ant.Input disabled={disabled} placeholder={'Адрес регистрации'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Номер телефона для связи'}
                error={getFieldError(FIELDS.contactPhone)}
              >
                {getFieldDecorator(FIELDS.contactPhone, {
                  rules: rules[FIELDS.contactPhone](getFieldsValue()),
                  initialValue: values?.[FIELDS.contactPhone] || '',
                })(
                  <InputMask mask={PHONE_MASK}>
                    <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                  </InputMask>,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={16}>
              <VzForm.Item disabled={disabled} label={'Адрес проживания'} error={getFieldError(FIELDS.factAddress)}>
                {getFieldDecorator(FIELDS.factAddress, {
                  rules: rules[FIELDS.factAddress](getFieldsValue()),
                  initialValue: values?.[FIELDS.factAddress] || '',
                })(<Ant.Input disabled={disabled} placeholder={'Адрес проживания'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                label={'Медицинская книжка'}
                disabled={disabled}
                error={getFieldError(FIELDS.hasSanitaryBook)}
              >
                {getFieldDecorator(FIELDS.hasSanitaryBook, {
                  rules: rules[FIELDS.hasSanitaryBook](getFieldsValue()),
                  initialValue:
                    typeof values?.[FIELDS.hasSanitaryBook] !== 'undefined' ? values?.[FIELDS.hasSanitaryBook] : false,
                })(
                  <VzForm.FieldSwitch
                    disabled={disabled}
                    style={{ padding: '6px 7px' }}
                    checkedTitle={'Да'}
                    unCheckedTitle={'Нет'}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.hasSanitaryBook) || false}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            {getFieldValue(FIELDS.hasSanitaryBook) ? (
              <VzForm.Col span={8}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Годен до'}
                  error={getFieldError(FIELDS.sanitaryBookExpiresAtDate)}
                  required={getFieldValue(FIELDS.hasSanitaryBook)}
                >
                  {getFieldDecorator(FIELDS.sanitaryBookExpiresAtDate, {
                    rules: rules[FIELDS.sanitaryBookExpiresAtDate](getFieldsValue()),
                    initialValue: moment(values?.[FIELDS.sanitaryBookExpiresAtDate]).isValid()
                      ? moment(values?.[FIELDS.sanitaryBookExpiresAtDate])
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
            ) : null}
          </VzForm.Row>
        </VzForm.Group>
        <VzForm.Group title="Фото специалиста">
          <h6 className={'box-title'}>{t.order('importantBothFiles')}</h6>
          <div className={'flexbox margin-top-20'}>
            <div className={'flexbox size-1'}>
              <DocViewer
                fileData={fileGetFileData(photoFile) || defaultFileData(t.driver('loaderPhoto'))}
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'photoFile'}
                editable={true}
                onRemove={() => setPhotoFile(null)}
                onChange={(fileData) => {
                  setPhotoFile(fileData);
                }}
              />
            </div>
          </div>
        </VzForm.Group>

        <VzForm.Group>
          <VzForm.Actions>
            <ButtonDeprecated className={'semi-wide'} theme={'secondary'} onClick={() => history.goBack()}>
              {t.order('cancel')}
            </ButtonDeprecated>
            <ButtonDeprecated onClick={handleSave} className={'semi-wide margin-left-16'} theme={'primary'}>
              {saveButtonText || 'Добавить специалиста'}
            </ButtonDeprecated>
          </VzForm.Actions>
        </VzForm.Group>
      </div>
    </div>
  );
}

LoaderForm.propTypes = {
  dictionaries: PropTypes.object,
  values: PropTypes.object,
  form: PropTypes.object,
  onSave: PropTypes.func,
  disabled: PropTypes.bool,
  onPasswordChange: PropTypes.func,
  canChangePassword: PropTypes.bool,
};

export default Ant.Form.create({})(LoaderForm);
