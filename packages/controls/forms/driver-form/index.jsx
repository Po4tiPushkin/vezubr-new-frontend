import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { Ant, VzForm, ButtonDeprecated, Modal } from '@vezubr/elements';
import moment from 'moment';
import Validators from '@vezubr/common/common/validators';
import InputMask from 'react-input-mask';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import { DocViewer } from '@vezubr/uploader';
import { fileGetFileData } from '@vezubr/common/utils';
import VehiclesAdditional from './additional/vehicles';
import { history } from '../../infrastructure';
import ProducersList from '../../lists/modals/producersPrivate';

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
  driverLicenseSurname: 'driverLicenseSurname',
  driverLicenseName: 'driverLicenseName',
  driverLicensePatronymic: 'driverLicensePatronymic',
  driverLicensePlaceOfBirth: 'driverLicensePlaceOfBirth',
  driverLicenseDateOfBirth: 'driverLicenseDateOfBirth',
  driverLicenseIssuedBy: 'driverLicenseIssuedBy',
  driverLicenseId: 'driverLicenseId',
  driverLicenseIssuedAtDate: 'driverLicenseIssuedAtDate',
  driverLicenseExpiresAtDate: 'driverLicenseExpiresAtDate',
  applicationPhone: 'applicationPhone',
  contactPhone: 'contactPhone',
  registrationAddress: 'registrationAddress',
  factAddress: 'factAddress',
  hasSanitaryBook: 'hasSanitaryBook',
  sanitaryBookExpiresAtDate: 'sanitaryBookExpiresAtDate',
  canWorkAsLoader: 'canWorkAsLoader',
  neverDelegate: 'neverDelegate',
  passportRusResident: 'passportRusResident',
  dlRusResident: 'dlRusResident',
  country: 'country',
  driverLicenseFrontSideFile: 'driverLicenseFrontSideFile',
  driverLicenseReverseSideFile: 'driverLicenseReverseSideFile',
  passportPhotoFile: 'passportPhotoFile',
  passportRegistrationFile: 'passportRegistrationFile',
  photoFile: 'photoFile',
  canWorkAsLoader: 'canWorkAsLoader',
  neverDelegate: 'neverDelegate',
};

const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';
const PHONE_MASK = '+7 (999) 999-99-99';

const UNIT_CODE_PLACEHOLDER = '___-___';
const UNIT_CODE_MASK = '999-999';

function DriverForm(props) {
  const { onSave, form, disabled = false, values = {}, saveButtonText, countryList = [] } = props;

  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue } = form;

  const rules = VzForm.useCreateAsyncRules(Validators.createEditProducerDriver);
  const getInitialValueOfAFile = useCallback(
    (fileName) => {
      const file = values[fileName];
      return file?.files ? file?.files[0]?.file : file || null;
    },
    [values],
  );

  const countryOptions = useMemo(() => {
    return countryList.map((el) => (
      <Ant.Select.Option title={`${el.title} / ${el.titleEn} / ${el.code}`} key={el.id} value={el.id}>
        {`${el.title} / ${el.titleEn} / ${el.code}`}
      </Ant.Select.Option>
    ));
  }, [countryList]);

  const [driverLicenseFrontSideFile, setDLFSFile] = useState(getInitialValueOfAFile(FIELDS.driverLicenseFrontSideFile));
  const [driverLicenseReverseSideFile, setDLRSFile] = useState(
    getInitialValueOfAFile(FIELDS.driverLicenseReverseSideFile),
  );
  const [passportPhotoFile, setPPFile] = useState(getInitialValueOfAFile(FIELDS.passportPhotoFile));
  const [passportRegistrationFile, setPRFile] = useState(getInitialValueOfAFile(FIELDS.passportRegistrationFile));
  const [photoFile, setPhotoFile] = useState(getInitialValueOfAFile(FIELDS.photoFile));
  const [producer, setProducer] = useState(null);
  const [showProducersModal, setShowProducersModal] = useState(false);
  const defaultFileData = useCallback(
    (name) => ({
      fileName: name,
    }),
    [],
  );

  useEffect(() => {
    if (!driverLicenseFrontSideFile) setDLFSFile(getInitialValueOfAFile(FIELDS.driverLicenseFrontSideFile));
    if (!driverLicenseReverseSideFile) setDLRSFile(getInitialValueOfAFile(FIELDS.driverLicenseReverseSideFile));
    if (!passportPhotoFile) setPPFile(getInitialValueOfAFile(FIELDS.passportPhotoFile));
    if (!passportRegistrationFile) setPRFile(getInitialValueOfAFile(FIELDS.passportRegistrationFile));
    if (!photoFile) setPhotoFile(getInitialValueOfAFile(FIELDS.photoFile));
  }, [values]);

  const [linkedVehicles, setLinkedVehicles] = useState([]);
  useEffect(() => {
    if (Array.isArray(values?.linkedVehicles)) {
      setLinkedVehicles(values?.linkedVehicles);
    }
  }, [values?.linkedVehicles]);
  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      const files = {
        passportRegistrationFile,
        passportPhotoFile,
        driverLicenseFrontSideFile,
        driverLicenseReverseSideFile,
        photoFile,
      };
      const extraData = {
        vehicles: linkedVehicles.map((el) => String(el.id)),
        producer
      };
      if (APP === 'producer') {
        delete extraData.producer;
      }
      if (onSave) {
        onSave(form, files, extraData);
      }
    },
    [
      form,
      onSave,
      passportRegistrationFile,
      passportPhotoFile,
      driverLicenseFrontSideFile,
      driverLicenseReverseSideFile,
      photoFile,
      producer,
      linkedVehicles,
    ],
  );

  React.useEffect(() => {
    moment.tz.setDefault('Etc/UTC')
    return () => {
      moment.tz.setDefault()
    }
  }, [])

  const syncPassportDl = useCallback((value, type, isDl) => {
    if (!getFieldValue(FIELDS.dlRusResident) && value !== null) {
      const currentType = isDl ? 'driverLicense' + type.charAt(0).toUpperCase() + type.slice(1) : type;
      const syncType = !isDl ? 'driverLicense' + type.charAt(0).toUpperCase() + type.slice(1) : type
      setFieldsValue({
        [FIELDS[currentType]]: value,
        [FIELDS[syncType]]: value,
      });
    }
  }, [getFieldValue(FIELDS.dlRusResident)]);

  const syncPassportDlAll = useCallback(() => {
    syncPassportDl(getFieldValue(FIELDS.name), FIELDS.name, false);
    syncPassportDl(getFieldValue(FIELDS.surname), FIELDS.surname, false);
    syncPassportDl(getFieldValue(FIELDS.patronymic), FIELDS.patronymic, false);
    if (moment(getFieldValue(FIELDS.dateOfBirth)).diff(moment(), 'day')) {
      syncPassportDl(getFieldValue(FIELDS.dateOfBirth), FIELDS.dateOfBirth, false)
    }
  },
    [getFieldValue(FIELDS.name), getFieldValue(FIELDS.surname), getFieldValue(FIELDS.patronymic), getFieldValue(FIELDS.dateOfBirth)], values);

  useEffect(() => {
    if (!getFieldValue(FIELDS.dlRusResident)) {
      syncPassportDlAll()
    }
  }, [getFieldValue(FIELDS.dlRusResident)])

  const onSaveProducer = useCallback((e) => {
    setProducer(e);
    setShowProducersModal(false);
  }, [])

  return (
    <div className={'flexbox'}>
      <div className={'size-1'}>
        <VzForm.Group title="Сканы паспорта водителя">
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

        {APP !== 'producer' && (
          <VzForm.Group>
            <VzForm.Row>
              <VzForm.Col span={12}>
                <button className={'vz-form-item'}
                  onClick={() => setShowProducersModal(true)}
                  style={{ height: "100%", width: "100%" }}
                >
                  <Ant.Tooltip placement="right" title={t.driver('hint.privateOwners')}>
                    <div className={'vz-form-item__label'}>
                      Компания-владелец {<Ant.Icon type={'info-circle'} />}
                    </div>
                  </Ant.Tooltip>
                  <div className={'ant-input flexbox'} style={{ 'height': '100%', "justifyContent": "space-between" }}>
                    {
                      producer
                        ?
                        <>
                          <span>{producer.title || producer.inn}</span>
                          <span>
                            <Ant.Icon
                              className="transpots__close-icon"
                              type={"close-circle"}
                              onClick={(e) => { e.stopPropagation(); setProducer(null) }}
                            />
                          </span>

                        </>
                        :
                        "Собственный водитель"
                    }
                  </div>
                </button>
              </VzForm.Col>
            </VzForm.Row>
          </VzForm.Group>
        )}

        <VzForm.Group title={'Паспортные данные'}>
          <VzForm.Row className={'margin-bottom-3'}>
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
                    required={!producer}
                  >
                    {getFieldDecorator(FIELDS.country, {
                      rules: rules[FIELDS.country](getFieldsValue(), { producer }),
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
                    label={'Место рождения (Населенный пункт)'}
                    error={getFieldError(FIELDS.placeOfBirth)}
                    required={!producer}
                  >
                    {getFieldDecorator(FIELDS.placeOfBirth, {
                      rules: rules[FIELDS.placeOfBirth](getFieldsValue(), { producer }),
                      initialValue: values?.[FIELDS.placeOfBirth] || '',
                    })(<Ant.Input disabled={disabled} placeholder={'Место рождения'} />)}
                  </VzForm.Item>
                </VzForm.Col>
              </>
            ) : null}
          </VzForm.Row>
          <VzForm.Row className={'margin-top-0'}>
            <VzForm.Col span={8}>
              <VzForm.Item disabled={disabled} label={'Фамилия'} error={getFieldError(FIELDS.surname)} required={true}>
                {getFieldDecorator(FIELDS.surname, {
                  initialValue: values?.[FIELDS.surname] || null,
                  rules: rules[FIELDS.surname](getFieldsValue()),
                })(
                  <Ant.Input
                    onChange={(e) => syncPassportDl(e.target.value, FIELDS.surname, false)}
                    disabled={disabled}
                    placeholder={'Фамилия'}
                  />
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item disabled={disabled} label={'Имя'} error={getFieldError(FIELDS.name)} required={true}>
                {getFieldDecorator(FIELDS.name, {
                  rules: rules[FIELDS.name](getFieldsValue()),
                  initialValue: values?.[FIELDS.name] || null,
                })(
                  <Ant.Input
                    onChange={(e) => syncPassportDl(e.target.value, FIELDS.name, false)}
                    disabled={disabled}
                    placeholder={'Имя'}
                  />
                )}
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
                  initialValue: values?.[FIELDS.patronymic] || null,
                  rules: rules[FIELDS.patronymic](getFieldsValue()),
                })(<Ant.Input
                  onChange={(e) => syncPassportDl(e.target.value, FIELDS.patronymic, false)}
                  disabled={disabled}
                  placeholder={'Отчество'}
                />
                )}
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
                required={!producer}
              >
                {getFieldDecorator(FIELDS.passportIssuedBy, {
                  rules: rules[FIELDS.passportIssuedBy](getFieldsValue(), { producer }),
                  initialValue: values?.[FIELDS.passportIssuedBy] || '',
                })(<Ant.Input disabled={disabled} placeholder={'Кем выдан'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Дата рождения'}
                error={getFieldError(FIELDS.dateOfBirth)}
                required={!producer}
              >
                {getFieldDecorator(FIELDS.dateOfBirth, {
                  rules: rules[FIELDS.dateOfBirth](getFieldsValue(), { producer }),
                  initialValue: moment(values?.[FIELDS.dateOfBirth]).isValid()
                    ? moment(values?.[FIELDS.dateOfBirth])
                    : null,
                })(
                  <Ant.DatePicker
                    disabled={disabled}
                    allowClear={true}
                    placeholder={'дд.мм.гггг'}
                    format={'DD.MM.YYYY'}
                    onChange={(e => syncPassportDl(e, FIELDS.dateOfBirth, false))}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Дата выдачи'}
                error={getFieldError(FIELDS.passportIssuedAtDate)}
                required={!producer}
              >
                {getFieldDecorator(FIELDS.passportIssuedAtDate, {
                  rules: rules[FIELDS.passportIssuedAtDate](getFieldsValue(), { producer }),
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
                required={!producer}
              >
                {getFieldDecorator(FIELDS.passportUnitCode, {
                  rules: rules[FIELDS.passportUnitCode](getFieldsValue(), { producer }),
                  initialValue: values?.[FIELDS.passportUnitCode] || '',
                })(
                  getFieldValue(FIELDS.passportRusResident)
                    ?
                    <InputMask mask={UNIT_CODE_MASK}>
                      <Ant.Input placeholder={UNIT_CODE_PLACEHOLDER} allowClear={true} />
                    </InputMask>
                    :
                    <Ant.Input allowClear={true} />
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>

        <VzForm.Group title="Сканы водительского удостоверения">
          <h6 className={'box-title'}>{t.order('importantBothFiles')}</h6>
          <div className={'flexbox margin-top-20'}>
            <div className={'flexbox size-1'}>
              <DocViewer
                fileData={fileGetFileData(driverLicenseFrontSideFile) || defaultFileData(t.driver('photoFront'))}
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'driverLicenseFrontSideFile'}
                editable={true}
                onRemove={() => setDLFSFile(null)}
                onChange={(fileData) => {
                  setDLFSFile(fileData);
                }}
              />
            </div>
            <div className={'margin-left-12 flexbox size-1'}>
              <DocViewer
                fileData={fileGetFileData(driverLicenseReverseSideFile) || defaultFileData(t.driver('backSide'))}
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'driverLicenseReverseSideFile'}
                editable={true}
                onRemove={() => setDLRSFile(null)}
                onChange={(fileData) => {
                  setDLRSFile(fileData);
                }}
              />
            </div>
          </div>
        </VzForm.Group>

        <VzForm.Group title={'Данные водительского удостоверения'}>
          <VzForm.Row className={'margin-bottom-3'}>
            <VzForm.Col span={8}>
              <VzForm.Item label={'Вод. удостоверение РФ'} disabled={disabled} error={getFieldError(FIELDS.dlRusResident)}>
                {getFieldDecorator(FIELDS.dlRusResident, {
                  rules: rules[FIELDS.dlRusResident](getFieldsValue()),
                  initialValue:
                    typeof values?.[FIELDS.dlRusResident] !== 'undefined'
                      ? values?.[FIELDS.dlRusResident]
                      : true,
                })(
                  <VzForm.FieldSwitch
                    disabled={disabled}
                    style={{ padding: '6px 7px' }}
                    checkedTitle={'Да'}
                    unCheckedTitle={'Нет'}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.dlRusResident) || false}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          {!getFieldValue(FIELDS.dlRusResident) ? (
            <VzForm.Row className={'margin-top-0'}>
              <VzForm.Col span={8}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Фамилия'}
                  error={getFieldError(FIELDS.driverLicenseSurname)}
                  required={!producer}
                >
                  {getFieldDecorator(FIELDS.driverLicenseSurname, {
                    rules: rules[FIELDS.driverLicenseSurname](getFieldsValue(), { producer }),
                    initialValue: values?.[FIELDS.driverLicenseSurname] || '',
                  })(
                    <Ant.Input
                      onChange={(e) => syncPassportDl(e.target.value, 'surname', true)}
                      disabled={disabled}
                      placeholder={'Фамилия'}
                    />
                  )}
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={8}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Имя'}
                  error={getFieldError(FIELDS.driverLicenseName)}
                  required={!producer}
                >
                  {getFieldDecorator(FIELDS.driverLicenseName, {
                    rules: rules[FIELDS.driverLicenseName](getFieldsValue(), { producer }),
                    initialValue: values?.[FIELDS.driverLicenseName] || '',
                  })(
                    <Ant.Input
                      onChange={(e) => syncPassportDl(e.target.value, 'name', true)}
                      disabled={disabled}
                      placeholder={'Имя'}
                    />
                  )}
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={8}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Отчество'}
                  error={getFieldError(FIELDS.driverLicensePatronymic)}
                >
                  {getFieldDecorator(FIELDS.driverLicensePatronymic, {
                    rules: rules[FIELDS.driverLicensePatronymic](getFieldsValue()),
                    initialValue: values?.[FIELDS.driverLicensePatronymic] || '',
                  })(
                    <Ant.Input
                      onChange={(e) => syncPassportDl(e.target.value, 'patronymic', true)}
                      disabled={disabled}
                      placeholder={'Отчество'}
                    />
                  )}
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={8}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Серия и номер ВУ'}
                  error={getFieldError(FIELDS.driverLicenseId)}
                  required={true}
                >
                  {getFieldDecorator(FIELDS.driverLicenseId, {
                    rules: rules[FIELDS.driverLicenseId](getFieldsValue()),
                    initialValue: values?.[FIELDS.driverLicenseId] || '',
                  })(<Ant.Input disabled={disabled} placeholder={'Серия и номер ВУ'} />)}
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={16}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Кем выдан'}
                  error={getFieldError(FIELDS.driverLicenseIssuedBy)}
                  required={!producer}
                >
                  {getFieldDecorator(FIELDS.driverLicenseIssuedBy, {
                    rules: rules[FIELDS.driverLicenseIssuedBy](getFieldsValue(), { producer }),
                    initialValue: values?.[FIELDS.driverLicenseIssuedBy] || '',
                  })(<Ant.Input disabled={disabled} placeholder={'Кем выдан'} />)}
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={8}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Место рождения в ВУ'}
                  error={getFieldError(FIELDS.driverLicensePlaceOfBirth)}
                  required={!producer}
                >
                  {getFieldDecorator(FIELDS.driverLicensePlaceOfBirth, {
                    rules: rules[FIELDS.driverLicensePlaceOfBirth](getFieldsValue(), { producer }),
                    initialValue: values?.[FIELDS.driverLicensePlaceOfBirth] || '',
                  })(<Ant.Input disabled={disabled} placeholder={'Место рождения'} />)}
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={8}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Дата рождения в ВУ'}
                  error={getFieldError(FIELDS.driverLicenseDateOfBirth)}
                  required={!producer}
                >
                  {getFieldDecorator(FIELDS.driverLicenseDateOfBirth, {
                    rules: rules[FIELDS.driverLicenseDateOfBirth](getFieldsValue(), { producer }),
                    initialValue: moment(values?.[FIELDS.driverLicenseDateOfBirth]).isValid()
                      ? moment(values?.[FIELDS.driverLicenseDateOfBirth])
                      : null,
                  })(
                    <Ant.DatePicker
                      disabled={disabled}
                      allowClear={true}
                      placeholder={'дд.мм.гггг'}
                      format={'DD.MM.YYYY'}
                      onChange={(e => syncPassportDl(e, FIELDS.dateOfBirth, true))}
                    />,
                  )}
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={8}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Дата выдачи'}
                  error={getFieldError(FIELDS.driverLicenseIssuedAtDate)}
                >
                  {getFieldDecorator(FIELDS.driverLicenseIssuedAtDate, {
                    rules: rules[FIELDS.driverLicenseIssuedAtDate](getFieldsValue()),
                    initialValue: moment(values?.[FIELDS.driverLicenseIssuedAtDate]).isValid()
                      ? moment(values?.[FIELDS.driverLicenseIssuedAtDate])
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
                  label={'ВУ годен до'}
                  error={getFieldError(FIELDS.driverLicenseExpiresAtDate)}
                  required={!producer}
                >
                  {getFieldDecorator(FIELDS.driverLicenseExpiresAtDate, {
                    rules: rules[FIELDS.driverLicenseExpiresAtDate](getFieldsValue(), { producer }),
                    initialValue: moment(values?.[FIELDS.driverLicenseExpiresAtDate]).isValid()
                      ? moment(values?.[FIELDS.driverLicenseExpiresAtDate])
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
          ) : (
            <VzForm.Row className={'margin-top-0'}>
              <VzForm.Col span={12}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Серия и номер ВУ'}
                  error={getFieldError(FIELDS.driverLicenseId)}
                  required={true}
                >
                  {getFieldDecorator(FIELDS.driverLicenseId, {
                    rules: rules[FIELDS.driverLicenseId](getFieldsValue()),
                    initialValue: values?.[FIELDS.driverLicenseId] || '',
                  })(<Ant.Input disabled={disabled} placeholder={'Серия и номер ВУ'} />)}
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={12}>
                <VzForm.Item
                  disabled={disabled}
                  label={'ВУ годен до'}
                  error={getFieldError(FIELDS.driverLicenseExpiresAtDate)}
                  required={!producer}
                >
                  {getFieldDecorator(FIELDS.driverLicenseExpiresAtDate, {
                    rules: rules[FIELDS.driverLicenseExpiresAtDate](getFieldsValue(), { producer }),
                    initialValue: moment(values?.[FIELDS.driverLicenseExpiresAtDate]).isValid()
                      ? moment(values?.[FIELDS.driverLicenseExpiresAtDate])
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
          )}
        </VzForm.Group>
        <VzForm.Group title={'Личные данные'}>
          <VzForm.Row>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Номер телефона для приложения'}
                error={getFieldError(FIELDS.applicationPhone)}
                required={!producer}
              >
                {getFieldDecorator(FIELDS.applicationPhone, {
                  rules: rules[FIELDS.applicationPhone](getFieldsValue(), { producer }),
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
                required={!producer}
              >
                {getFieldDecorator(FIELDS.registrationAddress, {
                  rules: rules[FIELDS.registrationAddress](getFieldsValue(), { producer }),
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
              <VzForm.Item label={'Медицинская книжка'} disabled={disabled} error={getFieldError(FIELDS.hasSanitaryBook)}>
                {getFieldDecorator(FIELDS.hasSanitaryBook, {
                  rules: rules[FIELDS.hasSanitaryBook](getFieldsValue()),
                  initialValue:
                    typeof values?.[FIELDS.hasSanitaryBook] !== 'undefined'
                      ? values?.[FIELDS.hasSanitaryBook]
                      : true,
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
                  required={!!getFieldValue(FIELDS.hasSanitaryBook)}
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
        <VzForm.Group title="Фото водителя">
          <h6 className={'box-title'}>{t.driver('importantPhotoFile')}</h6>
          <div className={'flexbox margin-top-20'}>
            <div className={'flexbox size-1'}>
              <DocViewer
                fileData={fileGetFileData(photoFile) || defaultFileData(t.driver('photoFile'))}
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
        <VzForm.Group title="Настройки">
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item disabled={disabled} error={getFieldError(FIELDS.canWorkAsLoader)}>
                {getFieldDecorator(FIELDS.canWorkAsLoader, {
                  rules: rules[FIELDS.canWorkAsLoader](getFieldsValue()),
                  initialValue: values?.[FIELDS.canWorkAsLoader] || false,
                })(
                  <VzForm.FieldSwitch
                    disabled={disabled}
                    style={{ padding: '6px 7px' }}
                    checkedTitle={t.driver('canWorkAsLoader')}
                    unCheckedTitle={t.driver('canWorkAsLoader')}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.canWorkAsLoader) || false}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item disabled={disabled} error={getFieldError(FIELDS.neverDelegate)}>
                {getFieldDecorator(FIELDS.neverDelegate, {
                  rules: rules[FIELDS.neverDelegate](getFieldsValue()),
                  initialValue: values?.[FIELDS.neverDelegate] || false,
                })(
                  <VzForm.FieldSwitch
                    disabled={disabled}
                    style={{ padding: '6px 7px' }}
                    checkedTitle={t.driver('neverDelegate')}
                    unCheckedTitle={t.driver('neverDelegate')}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.neverDelegate) || false}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
        <VzForm.Group>
          <VehiclesAdditional linkedVehicles={linkedVehicles} setLinkedVehicles={setLinkedVehicles} />
        </VzForm.Group>
        <VzForm.Group>
          <VzForm.Actions>
            <ButtonDeprecated className={'semi-wide'} theme={'secondary'} onClick={() => history.goBack()}>
              {t.order('cancel')}
            </ButtonDeprecated>
            <ButtonDeprecated onClick={handleSave} className={'semi-wide margin-left-16'} theme={'primary'}>
              {saveButtonText || 'Добавить водителя'}
            </ButtonDeprecated>
          </VzForm.Actions>
        </VzForm.Group>
      </div>
      <Modal
        width={'80vw'}
        visible={showProducersModal}
        destroyOnClose={true}
        onCancel={() => setShowProducersModal(false)}
        footer={[]}
      >
        <ProducersList onCancel={() => setShowProducersModal(false)} onSave={(e) => onSaveProducer(e)} />
      </Modal>
    </div>
  );
}

DriverForm.propTypes = {
  dictionaries: PropTypes.object,
  values: PropTypes.object,
  form: PropTypes.object,
  onSave: PropTypes.func,
  disabled: PropTypes.bool,
  onPasswordChange: PropTypes.func,
  canChangePassword: PropTypes.bool,
};

export default Ant.Form.create({})(DriverForm);
