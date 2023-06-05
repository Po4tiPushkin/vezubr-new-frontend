import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Ant, VzForm, ButtonDeprecated, GeoZonesElement, IconDeprecated, showConfirm } from '@vezubr/elements';
import moment from 'moment';
import Validators from '@vezubr/common/common/validators';
import InputMask from 'react-input-mask';
import t from '@vezubr/common/localization';
import { DocViewer } from '@vezubr/uploader';
import { fileGetFileData } from '@vezubr/common/utils';
import { useSelector } from 'react-redux';
import { AssignDriverNew } from '@vezubr/components';
import DriversAdditional from './additionalInfo/drivers';
import BasingAddress from './additionalInfo/basingAddress';
import _range from 'lodash/range';
import { Utils } from '@vezubr/common/common';
import { history } from '../../infrastructure';
import AdditionalData from './additionalInfo/additionalData';
const currentYear = new Date().getFullYear();
const FIELDS = {
  plateNumber: 'plateNumber',
  vin: 'vin',
  markAndModel: 'markAndModel',
  yearOfManufacture: 'yearOfManufacture',
  ownerType: 'ownerType',
  bodyType: 'bodyType',
  liftingCapacityInKg: 'liftingCapacityInKg',
  palletsCapacity: 'palletsCapacity',
  bodyLengthInCm: 'bodyLengthInCm',
  bodyWidthInCm: 'bodyWidthInCm',
  bodyHeightInCm: 'bodyHeightInCm',
  volume: 'volume',
  liftingCapacityMin: 'liftingCapacityMin',
  liftingCapacityMax: 'liftingCapacityMax',
  isSideLoadingAvailable: 'isSideLoadingAvailable',
  isTopLoadingAvailable: 'isTopLoadingAvailable',
  heightFromGroundInCm: 'heightFromGroundInCm',
  isThermograph: 'isThermograph',
  temperatureMin: 'temperatureMin',
  temperatureMax: 'temperatureMax',
  registrationCertificateFrontSideFile: 'registrationCertificateFrontSideFile',
  photoLeftSide: 'photoLeftSide',
  photoRightSide: 'photoRightSide',
  registrationCertificateReverseSideFile: 'registrationCertificateReverseSideFile',
  hasSanitaryPassport: 'hasSanitaryPassport',
  sanitaryPassportExpiresAtDate: 'sanitaryPassportExpiresAtDate',
  compartmentCount: 'compartmentCount',
  isCarTransporterCovered: 'isCarTransporterCovered',
  carCount: 'carCount',
  platformHeight: 'platformHeight',
  platformLength: 'platformLength',
  category: 'category',
};

const DISABLED_FIELDS_FROM_CATEGORIES = {
  1: {
    [FIELDS.volume]: true,
    [FIELDS.palletsCapacity]: true,
  },
  5: {
    [FIELDS.platformHeight]: true,
    [FIELDS.platformLength]: true,
  },
  6: {
    [FIELDS.volume]: true,
    [FIELDS.compartmentCount]: true,
  },
  7: {
    [FIELDS.volume]: true,
  },
  8: {
    [FIELDS.carCount]: true,
    [FIELDS.isCarTransporterCovered]: true,
  },
  9: {
    [FIELDS.platformHeight]: true,
    [FIELDS.platformLength]: true,
  },
};

const FIELDS_RANGE_FROM_CATEGORIES = {
  1: {
    [FIELDS.volume]: {
      min: 0.5,
      max: 120,
    },
    [FIELDS.palletsCapacity]: {
      min: 0,
      max: 35,
    },
    [FIELDS.liftingCapacityInKg]: {
      min: 0.5,
      max: 100,
    },
  },
  5: {
    [FIELDS.platformHeight]: {
      min: 1.1,
      max: 1.5,
    },
    [FIELDS.platformLength]: {
      min: 8,
      max: 35,
    },
    [FIELDS.liftingCapacityInKg]: {
      min: 15,
      max: 80,
    },
  },
  6: {
    [FIELDS.volume]: {
      min: 20,
      max: 50,
    },
    [FIELDS.compartmentCount]: {
      min: 1,
      max: 5,
    },
    [FIELDS.liftingCapacityInKg]: {
      min: 10,
      max: 40,
    },
  },
  7: {
    [FIELDS.volume]: {
      min: 7,
      max: 40,
    },
    [FIELDS.liftingCapacityInKg]: {
      min: 10,
      max: 50,
    },
  },
  8: {
    [FIELDS.carCount]: {
      min: 5,
      max: 10,
    },
    [FIELDS.liftingCapacityInKg]: {
      min: 10,
      max: 40,
    },
  },
  9: {
    [FIELDS.platformHeight]: {
      min: 1.1,
      max: 1.5,
    },
    [FIELDS.platformLength]: {
      min: 6,
      max: 15,
    },
    [FIELDS.liftingCapacityInKg]: {
      min: 25,
      max: 50,
    },
  },
};

function TrailerForm(props) {
  const { onSave, form, disabled = false, values = {}, saveButtonText, disabledFields = [] } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user);
  const { vehicleBodies = [], vehicleTypes = [] } = dictionaries || {};
  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue } = form;
  const [vehicleType, setVehicleType] = useState(null);
  const [address, setAddress] = useState(null);
  const [loadingsAvailable, setLoadingsAvailable] = useState({
    isTopLoadingAvailable: true,
    isSideLoadingAvailable: true,
  });
  const [disabledFromCategories, setDisabledFromCategories] = useState({
    platformLength: true,
    platformHeight: true,
    carCount: true,
    isCarTransporterCovered: true,
    compartmentCount: true,
    volume: true,
    palletsCapacity: true,
  });
  const [fieldsRange, setFieldsRange] = useState({
    [FIELDS.volume]: {
      min: null,
      max: null,
    },
    [FIELDS.liftingCapacityInKg]: {
      min: null,
      max: null,
    },
    [FIELDS.compartmentCount]: {
      min: null,
      max: null,
    },
    [FIELDS.carCount]: {
      min: null,
      max: null,
    },
    [FIELDS.platformHeight]: {
      min: null,
      max: null,
    },
    [FIELDS.platformLength]: {
      min: null,
      max: null,
    },
    [FIELDS.palletsCapacity]: {
      min: null,
      max: null,
    },
  });
  const rules = VzForm.useCreateAsyncRules(Validators.createEditTrailer);

  // YearPicker нет в Ant до 4 версии, легче всего сделать через Select
  const yearRange = useMemo(() => {
    return _range(1981, currentYear + 1)
      .reverse()
      .map((el) => {
        return (
          <Ant.Select.Option key={el} value={el}>
            {el}
          </Ant.Select.Option>
        );
      });
  }, []);

  const categoryOptions = useMemo(() => {
    const filteredCategories = dictionaries.vehicleTypeCategories.filter(
      (el) => dictionaries.trailerBodyTypeToCategoryTrailerTypeMap[el.id],
    );
    return filteredCategories.map((el) => (
      <Ant.Select.Option key={el.id} value={el.id}>
        {el.title}
      </Ant.Select.Option>
    ));
  }, []);

  useEffect(() => {
    const category = getFieldValue(FIELDS.category);
    const bodyType = getFieldValue(FIELDS.bodyType);
    if (!category) {
      return;
    }
    const disabledFields = { ...disabledFromCategories };
    const range = { ...fieldsRange };
    Object.keys(disabledFields).forEach((el) => {
      disabledFields[el] = true;
      if (DISABLED_FIELDS_FROM_CATEGORIES[category]?.[el]) {
        disabledFields[el] = false;
      }
      if (disabledFields[el]) {
        setFieldsValue({
          [el]: '',
        });
      }
    });
    Object.keys(range).forEach((el) => {
      range[el].max = null;
      range[el].min = null;
      if (FIELDS_RANGE_FROM_CATEGORIES[category]?.[el]) {
        if (!range[el].max || range[el].max < FIELDS_RANGE_FROM_CATEGORIES[category][el].max) {
          range[el].max = FIELDS_RANGE_FROM_CATEGORIES[category][el].max;
        }
        if (!range[el].min || range[el].min > FIELDS_RANGE_FROM_CATEGORIES[category][el].min) {
          range[el].min = FIELDS_RANGE_FROM_CATEGORIES[category][el].min;
        }
      }
    });
    if ((bodyType === 1 || bodyType === 6) && !disabledFields.volume) {
      disabledFields.volume = true;
    }
    if (disabledFields.volume) {
      setFieldsValue({
        [FIELDS.bodyHeightInCm]: '',
        [FIELDS.bodyLengthInCm]: '',
        [FIELDS.bodyWidthInCm]: '',
      });
    }
    if ([6, 7, 9].includes(category)) {
      setFieldsValue({
        [FIELDS.isTopLoadingAvailable]: true
      })
    }
    if (category === 9) {
      setFieldsValue({
        [FIELDS.isSideLoadingAvailable]: true
      })
    }
    setDisabledFromCategories(disabledFields);
    setFieldsRange(range);

  }, [getFieldValue(FIELDS.category)]);

  const vehicleBodiesComputed = useMemo(() => {
    const category = getFieldValue(FIELDS.category);
    if (!vehicleType && !category) {
      return vehicleBodies;
    }
    let availableBodyTypes = [];
    if (vehicleType) {
      const vehicle = vehicleTypes.find((el) => vehicleType === el.id);
      availableBodyTypes = vehicleBodies.filter((el) => vehicle.availableBodyTypes?.[el.id]);
    } else {
      availableBodyTypes = vehicleBodies;
    }
    if (category) {
      availableBodyTypes = availableBodyTypes.filter((el) =>
        dictionaries.trailerBodyTypeToCategoryTrailerTypeMap[category].includes(el.id),
      );
    }
    return availableBodyTypes;
  }, [vehicleType, vehicleBodies, vehicleTypes, getFieldValue(FIELDS.category)]);

  useEffect(() => {
    const liftingPalletsMin = getFieldValue(FIELDS.palletsCapacity);
    const liftingCapacityMin = getFieldValue(FIELDS.liftingCapacityInKg);
    const volumeMin = getFieldValue(FIELDS.volume);
    const bodyType = getFieldValue(FIELDS.bodyType);
    const category = getFieldValue(FIELDS.category);
    let categoriesAvailableBodyTypes = [];
    if (category) {
      categoriesAvailableBodyTypes = [
        ...categoriesAvailableBodyTypes,
        ...dictionaries.trailerBodyTypeToCategoryTrailerTypeMap[category],
      ];
    }
    let vehicleTypeNew = null;
    if (liftingCapacityMin && liftingPalletsMin && volumeMin) {
      vehicleTypeNew = Utils.getVehicleType({
        category,
        vehicleTypes,
        liftingCapacityMin,
        volumeMin,
        liftingPalletsMin,
      });
      if (
        vehicleTypeNew &&
        bodyType &&
        !vehicleTypes.find((el) => el.id === vehicleTypeNew)?.availableBodyTypes[bodyType]
      ) {
        setFieldsValue({
          [FIELDS.bodyType]: '',
        });
      }
    }
    if (!categoriesAvailableBodyTypes.includes(bodyType)) {
      setFieldsValue({
        [FIELDS.bodyType]: '',
      });
    }
    if (categoriesAvailableBodyTypes.length == 1) {
      setFieldsValue({
        [FIELDS.bodyType]: categoriesAvailableBodyTypes[0],
      });
    }
    setVehicleType(vehicleTypeNew);
  }, [
    vehicleTypes,
    getFieldValue(FIELDS.palletsCapacity),
    getFieldValue(FIELDS.liftingCapacityInKg),
    getFieldValue(FIELDS.volume),
    getFieldValue(FIELDS.category),
  ]);

  const onBodyVolumeChange = useCallback((value) => {
    setFieldsValue({
      [FIELDS.bodyHeightInCm]: '',
      [FIELDS.bodyLengthInCm]: '',
      [FIELDS.bodyWidthInCm]: '',
      [FIELDS.volume]: value,
    });
  }, []);

  const onLWHChange = useCallback((value, type) => {
    setFieldsValue({
      [FIELDS[type]]: value,
    });
    const height = getFieldValue(FIELDS.bodyHeightInCm);
    const length = getFieldValue(FIELDS.bodyLengthInCm);
    const width = getFieldValue(FIELDS.bodyWidthInCm);
    let newBodyVolume = '';
    if (height && length && width) {
      newBodyVolume = height * length * width;
    }
    setFieldsValue({
      [FIELDS.volume]: newBodyVolume,
    });
  }, []);

  const bodyTypes = useMemo(() => {
    return vehicleBodiesComputed.map(({ id, title }) => (
      <Ant.Select.Option key={id} value={id}>
        {title}
      </Ant.Select.Option>
    ));
  }, [vehicleBodiesComputed]);

  const palletsCapacity = useMemo(() => {
    return _range(0, 37).map((item) => (
      <Ant.Select.Option key={item} value={item}>
        {item}
      </Ant.Select.Option>
    ));
  }, []);

  const renderOwnerTypes = useMemo(() => {
    return dictionaries?.vehicleOwnerTypes.map((el) => {
      return (
        <Ant.Select.Option key={el.id} value={el.id}>
          {el.title}
        </Ant.Select.Option>
      );
    });
  }, [dictionaries]);

  const getInitialValueOfAFile = useCallback(
    (fileName) => {
      const file = values[fileName];
      return file || null;
    },
    [values],
  );

  const [registrationCertificateFrontSideFile, setRCFSFile] = useState(
    getInitialValueOfAFile(FIELDS.registrationCertificateFrontSideFile),
  );
  const [registrationCertificateReverseSideFile, setRCRSFile] = useState(
    getInitialValueOfAFile(FIELDS.registrationCertificateReverseSideFile),
  );
  const [photoRightSide, setPhotoRightSide] = useState(getInitialValueOfAFile(FIELDS.photoRightSide));
  const [photoLeftSide, setPhotoLeftSide] = useState(getInitialValueOfAFile(FIELDS.photoLeftSide));
  const [linkedDrivers, setLinkedDrivers] = useState([]);
  useEffect(() => {
    if (Array.isArray(values?.linkedDrivers) && values?.linkedDrivers.length) {
      setLinkedDrivers(values.linkedDrivers);
    }
    if (values?.bodyType) {
      setFieldsValue({ [FIELDS.bodyType]: values?.bodyType });
    }
  }, [values?.linkedDrivers, values?.bodyType]);

  const defaultFileData = useCallback(
    (name) => ({
      fileName: name,
    }),
    [],
  );

  useEffect(() => {
    if (Object.values(values).length) {
      setRCFSFile(getInitialValueOfAFile(FIELDS.registrationCertificateFrontSideFile));
      setRCRSFile(getInitialValueOfAFile(FIELDS.registrationCertificateReverseSideFile));
      // setPhoto(getInitialValueOfAFile(FIELDS.photo));
      setPhotoLeftSide(getInitialValueOfAFile(FIELDS.photoLeftSide));
      setPhotoRightSide(getInitialValueOfAFile(FIELDS.photoRightSide));
    }
    if (values?.nightParkingAddress) {
      setAddress({
        fullAddress: values?.nightParkingAddress,
        coordinates: {
          lat: values?.nightParkingLatitude,
          lng: values?.nightParkingLongitude,
        },
      });
    }
  }, [values]);

  useEffect(() => {
    const bodyType = getFieldValue(FIELDS.bodyType);
    if (bodyType === 1 || bodyType === 6) {
      setDisabledFromCategories((prev) => ({ ...prev, volume: true }));
      setFieldsValue({
        [FIELDS.volume]: '',
      });
    } else if (disabledFromCategories.volume) {
      const category = getFieldValue(FIELDS.category);
      if (category === 1) {
        setDisabledFromCategories((prev) => ({ ...prev, volume: false }));
      }
    }
    if (vehicleType && bodyType) {
      if (!vehicleTypes.find((el) => el.id === vehicleType)?.availableBodyTypes?.[bodyType]?.[2]) {
        // data.isSideLoadingAvailable = false;
        setLoadingsAvailable((prev) => {
          return { ...prev, isSideLoadingAvailable: false };
        });
        setFieldsValue({
          [FIELDS.isSideLoadingAvailable]: false,
        });
      } else if (!loadingsAvailable?.isSideLoadingAvailable) {
        // data.isSideLoadingAvailable = true;
        setLoadingsAvailable((prev) => {
          return { ...prev, isSideLoadingAvailable: true };
        });
      }
      if (!vehicleTypes.find((el) => el.id === vehicleType)?.availableBodyTypes?.[bodyType]?.[3]) {
        // data.isTopLoadingAvailable = false;
        setLoadingsAvailable((prev) => {
          return { ...prev, isTopLoadingAvailable: false };
        });
        setFieldsValue({
          [FIELDS.isTopLoadingAvailable]: false,
        });
      } else if (!loadingsAvailable?.isTopLoadingAvailable) {
        // data.isTopLoadingAvailable = true;
        setLoadingsAvailable((prev) => {
          return { ...prev, isTopLoadingAvailable: true };
        });
      }
    }
  }, [vehicleType, getFieldValue(FIELDS.bodyType)]);

  const onLiftingCapacityChange = useCallback((value) => {
    setFieldsValue({
      [FIELDS.liftingCapacityInKg]: value,
      [FIELDS.liftingCapacityMax]: value,
    });
  }, []);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      const files = {
        registrationCertificateFrontSideFile,
        registrationCertificateReverseSideFile,
        photoLeftSide,
        photoRightSide,
      };
      const extraData = {
        linkedDriversIds: linkedDrivers.map((el) => String(el.id)),
      };
      if (address?.fullAddress) {
        extraData.nightParkingAddress = address.fullAddress;
      }
      if (address?.coordinates?.lat) {
        extraData.nightParkingLatitude = address?.coordinates?.lat;
      }
      if (address?.coordinates?.lng) {
        extraData.nightParkingLongitude = address?.coordinates?.lng;
      }
      if (onSave) {
        onSave(form, files, extraData);
      }
    },
    [
      form,
      onSave,
      linkedDrivers,
      registrationCertificateFrontSideFile,
      registrationCertificateReverseSideFile,
      photoLeftSide,
      photoRightSide,
      address,
    ],
  );

  return (
    <div className={'flexbox'}>
      <div className={'size-1'}>
        <VzForm.Group title="Свидетельство о регистрации (СТС)">
          <h6 className={'box-title'}>{t.order('importantBothFiles')}</h6>
          <div className={'flexbox margin-top-20'}>
            <div className={'flexbox size-1'}>
              <DocViewer
                fileData={fileGetFileData(registrationCertificateFrontSideFile) || defaultFileData(t.order('vinSide'))}
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'registrationCertificateFrontSideFile'}
                editable={true}
                onRemove={() => setRCFSFile(null)}
                onChange={(fileData) => {
                  setRCFSFile(fileData);
                }}
              />
            </div>
            <div className={'margin-left-12 flexbox size-1'}>
              <DocViewer
                fileData={
                  fileGetFileData(registrationCertificateReverseSideFile) || defaultFileData(t.order('ownerSide'))
                }
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'registrationCertificateReverseSideFile'}
                editable={true}
                onRemove={() => setRCRSFile(null)}
                onChange={(fileData) => {
                  setRCRSFile(fileData);
                }}
              />
            </div>
          </div>
        </VzForm.Group>

        <VzForm.Group title={'Общие сведения'}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={disabled}
                label={'Госномер'}
                error={getFieldError(FIELDS.plateNumber)}
                required={true}
              >
                {getFieldDecorator(FIELDS.plateNumber, {
                  initialValue: (values?.[FIELDS.plateNumber] || '').toUpperCase(),
                  rules: rules[FIELDS.plateNumber](getFieldsValue()),
                  normalize: (input) => input.toUpperCase().replace(' ', ''),
                })(<Ant.Input disabled={disabled} placeholder={'Госномер'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item disabled={disabled} label={'VIN'} error={getFieldError(FIELDS.vin)} required={false}>
                {getFieldDecorator(FIELDS.vin, {
                  initialValue: (values?.[FIELDS.vin] || '').toUpperCase(),
                  rules: rules[FIELDS.vin](getFieldsValue()),
                  normalize: (input) => input.toUpperCase(),
                })(<Ant.Input disabled={disabled} placeholder={'VIN'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={disabled || disabledFields.includes(FIELDS.markAndModel)}
                label={'Марка и модель'}
                error={getFieldError(FIELDS.markAndModel)}
                required={true}
              >
                {getFieldDecorator(FIELDS.markAndModel, {
                  initialValue: values?.[FIELDS.markAndModel] || '',
                  rules: rules[FIELDS.markAndModel](getFieldsValue()),
                })(
                  <Ant.Input
                    disabled={disabled || disabledFields.includes(FIELDS.markAndModel)}
                    placeholder={'Укажите марку и модель'}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={disabled || disabledFields.includes(FIELDS.yearOfManufacture)}
                label={'Год выпуска'}
                error={getFieldError(FIELDS.yearOfManufacture)}
                required={true}
              >
                {getFieldDecorator(FIELDS.yearOfManufacture, {
                  initialValue: values?.[FIELDS.yearOfManufacture] || null,
                  rules: rules[FIELDS.yearOfManufacture](getFieldsValue()),
                })(
                  <Ant.Select
                    disabled={disabled || disabledFields.includes(FIELDS.yearOfManufacture)}
                    placeholder={'Укажите год выпуска'}
                  >
                    {yearRange}
                  </Ant.Select>,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
        <VzForm.Group title={'Дополнительные данные'}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={disabled}
                label={'Собственник'}
                error={getFieldError(FIELDS.ownerType)}
                required={true}
              >
                {getFieldDecorator(FIELDS.ownerType, {
                  initialValue: values?.[FIELDS.ownerType] || null,
                  rules: rules[FIELDS.ownerType](getFieldsValue()),
                })(<Ant.Select disabled={disabled}>{renderOwnerTypes}</Ant.Select>)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item>
                <BasingAddress address={address} setAddress={setAddress} />
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
        <VzForm.Group title={'Кузов'}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={disabled}
                label={'Тип автоперевозки'}
                required={true}
                error={getFieldError(FIELDS.category)}
              >
                {getFieldDecorator(FIELDS.category, {
                  initialValue: values?.[FIELDS.category],
                  rules: rules[FIELDS.category](getFieldsValue()),
                })(
                  <Ant.Select disabled={disabled} placeholder={'Выбрать из списка'}>
                    {categoryOptions}
                  </Ant.Select>,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={disabled}
                label={'Подходящие типы кузова'}
                error={getFieldError(FIELDS.bodyType)}
                required={true}
              >
                {getFieldDecorator(FIELDS.bodyType, {
                  initialValue: values?.[FIELDS.bodyType],
                  rules: rules[FIELDS.bodyType](getFieldsValue()),
                })(
                  <Ant.Select disabled={disabled} placeholder={'Выбрать из списка'}>
                    {bodyTypes}
                  </Ant.Select>,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                required={true}
                disabled={disabled}
                label={'Грузоподъемность по документам, т'}
                error={getFieldError(FIELDS.liftingCapacityInKg)}
              >
                {getFieldDecorator(FIELDS.liftingCapacityInKg, {
                  initialValue: values?.[FIELDS.liftingCapacityInKg] || '',
                  rules: rules[FIELDS.liftingCapacityInKg](getFieldsValue(), {
                    range: fieldsRange[FIELDS.liftingCapacityInKg],
                  }),
                  normalize: (input) => input.toString().replace(',', '.'),
                })(
                  <Ant.Input
                    onChange={(e) => onLiftingCapacityChange(e.target.value)}
                    disabled={disabled}
                    placeholder={
                      fieldsRange[FIELDS.liftingCapacityInKg].max && fieldsRange[FIELDS.liftingCapacityInKg].min
                        ? `от ${fieldsRange[FIELDS.liftingCapacityInKg].min} до ${fieldsRange[FIELDS.liftingCapacityInKg].max
                        }`
                        : ''
                    }
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Получать заказы с грузоподьемностью ТС, от т.'}
                error={getFieldError(FIELDS.liftingCapacityMin)}
              >
                {getFieldDecorator(FIELDS.liftingCapacityMin, {
                  initialValue: values?.[FIELDS.liftingCapacityMin] || 0,
                  rules: rules[FIELDS.liftingCapacityMin](getFieldsValue(), {
                    max: fieldsRange[FIELDS.liftingCapacityInKg]?.max,
                  }),
                })(<Ant.Input disabled={disabled} placeholder={'От'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Получать заказы с грузоподьемностью ТС, до т.'}
                error={getFieldError(FIELDS.liftingCapacityMax)}
              >
                {getFieldDecorator(FIELDS.liftingCapacityMax, {
                  initialValue: values?.[FIELDS.liftingCapacityMax] || '',
                  rules: rules[FIELDS.liftingCapacityMax](getFieldsValue(), {
                    min: fieldsRange[FIELDS.liftingCapacityInKg]?.min,
                  }),
                })(<Ant.Input disabled={disabled} placeholder={'До'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={disabledFromCategories.volume || disabled}
                label={'Объем, м³'}
                error={disabledFromCategories.volume ? false : getFieldError(FIELDS.volume)}
                required={!disabledFromCategories.volume}
              >
                {getFieldDecorator(FIELDS.volume, {
                  initialValue: values?.[FIELDS.volume],
                  rules: rules[FIELDS.volume](getFieldsValue(), {
                    disabled: disabledFromCategories.volume,
                    range: fieldsRange[FIELDS.volume],
                  }),
                })(
                  <Ant.InputNumber
                    onChange={(e) => onBodyVolumeChange(e)}
                    decimalSeparator={','}
                    min={0}
                    disabled={disabledFromCategories.volume || disabled}
                    placeholder={
                      fieldsRange[FIELDS.volume].max && fieldsRange[FIELDS.volume].min
                        ? `от ${fieldsRange[FIELDS.volume].min} до ${fieldsRange[FIELDS.volume].max}`
                        : ''
                    }
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={disabledFromCategories.volume || disabled}
                label={'Внутренняя длина кузова (до 15м)'}
                error={getFieldError(FIELDS.bodyLengthInCm)}
              >
                {getFieldDecorator(FIELDS.bodyLengthInCm, {
                  initialValue: values?.[FIELDS.bodyLengthInCm],
                  rules: rules[FIELDS.bodyLengthInCm](getFieldsValue()),
                })(
                  <Ant.Input
                    onChange={(e) => onLWHChange(e.target.value, 'bodyLengthInCm')}
                    disabled={disabledFromCategories.volume || disabled}
                    placeholder={'Укажите в метрах'}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={disabledFromCategories.volume || disabled}
                label={'Внутренняя ширина кузова (до 4м)'}
                error={getFieldError(FIELDS.bodyWidthInCm)}
              >
                {getFieldDecorator(FIELDS.bodyWidthInCm, {
                  initialValue: values?.[FIELDS.bodyWidthInCm],
                  rules: rules[FIELDS.bodyWidthInCm](getFieldsValue()),
                })(
                  <Ant.Input
                    onChange={(e) => onLWHChange(e.target.value, 'bodyWidthInCm')}
                    disabled={disabledFromCategories.volume || disabled}
                    placeholder={'Укажите в метрах'}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={disabledFromCategories.volume || disabled}
                label={'Внутренняя высота кузова (до 4м)'}
                error={getFieldError(FIELDS.bodyHeightInCm)}
              >
                {getFieldDecorator(FIELDS.bodyHeightInCm, {
                  initialValue: values?.[FIELDS.bodyHeightInCm],
                  rules: rules[FIELDS.bodyHeightInCm](getFieldsValue()),
                })(
                  <Ant.Input
                    onChange={(e) => onLWHChange(e.target.value, 'bodyHeightInCm')}
                    disabled={disabledFromCategories.volume || disabled}
                    placeholder={'Укажите в метрах'}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={5}>
              <VzForm.Item
                disabled={disabledFromCategories.palletsCapacity || disabled}
                label={'Паллетовместимость, шт.'}
                error={disabledFromCategories.palletsCapacity ? false : getFieldError(FIELDS.palletsCapacity)}
                required={!disabledFromCategories.palletsCapacity}
              >
                {getFieldDecorator(FIELDS.palletsCapacity, {
                  initialValue: values?.[FIELDS.palletsCapacity],
                  rules: rules[FIELDS.palletsCapacity](getFieldsValue(), {
                    disabled: disabledFromCategories.palletsCapacity,
                    range: fieldsRange[FIELDS.palletsCapacity],
                  }),
                })(
                  <Ant.Input
                    disabled={disabledFromCategories.palletsCapacity || disabled}
                    placeholder={
                      fieldsRange[FIELDS.palletsCapacity].max &&
                        (fieldsRange[FIELDS.palletsCapacity].min || fieldsRange[FIELDS.palletsCapacity].min === 0)
                        ? `от ${fieldsRange[FIELDS.palletsCapacity].min} до ${fieldsRange[FIELDS.palletsCapacity].max}`
                        : ''
                    }
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={4}>
              <VzForm.Item
                disabled={disabledFromCategories.platformLength || disabled}
                label={t.trailer('platformLength')}
                error={getFieldError(FIELDS.platformLength)}
                required={!disabledFromCategories.platformLength}
              >
                {getFieldDecorator(FIELDS.platformLength, {
                  initialValue: values?.[FIELDS.platformLength] || '',
                  rules: rules[FIELDS.platformLength](getFieldsValue(), {
                    disabled: disabledFromCategories.platformLength,
                    range: fieldsRange[FIELDS.platformLength],
                  }),
                  normalize: (input) => input.toString().replace(',', '.'),
                })(
                  <Ant.Input
                    disabled={disabledFromCategories.platformLength || disabled}
                    placeholder={
                      fieldsRange[FIELDS.platformLength].max && fieldsRange[FIELDS.platformLength].min
                        ? `от ${fieldsRange[FIELDS.platformLength].min} до ${fieldsRange[FIELDS.platformLength].max}`
                        : ''
                    }
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={5}>
              <VzForm.Item
                disabled={disabledFromCategories.platformHeight || disabled}
                label={t.trailer('platformHeight')}
                error={getFieldError(FIELDS.platformHeight)}
                required={!disabledFromCategories.platformHeight}
              >
                {getFieldDecorator(FIELDS.platformHeight, {
                  initialValue: values?.[FIELDS.platformHeight] || '',
                  rules: rules[FIELDS.platformHeight](getFieldsValue(), {
                    disabled: disabledFromCategories.platformHeight,
                    range: fieldsRange[FIELDS.platformHeight],
                  }),
                  normalize: (input) => input.toString().replace(',', '.'),
                })(
                  <Ant.Input
                    disabled={disabledFromCategories.platformHeight || disabled}
                    placeholder={
                      fieldsRange[FIELDS.platformHeight].max && fieldsRange[FIELDS.platformHeight].min
                        ? `от ${fieldsRange[FIELDS.platformHeight].min} до ${fieldsRange[FIELDS.platformHeight].max}`
                        : ''
                    }
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={5}>
              <VzForm.Item
                disabled={disabledFromCategories.carCount || disabled}
                label={t.trailer('carCount')}
                error={getFieldError(FIELDS.carCount)}
                required={!disabledFromCategories.carCount}
              >
                {getFieldDecorator(FIELDS.carCount, {
                  initialValue: values?.[FIELDS.carCount],
                  rules: rules[FIELDS.carCount](getFieldsValue(), {
                    disabled: disabledFromCategories.carCount,
                    range: fieldsRange[FIELDS.carCount],
                  }),
                })(
                  <Ant.InputNumber
                    disabled={disabledFromCategories.carCount || disabled}
                    decimalSeparator={','}
                    min={0}
                    placeholder={
                      fieldsRange[FIELDS.carCount].max && fieldsRange[FIELDS.carCount].min
                        ? `от ${fieldsRange[FIELDS.carCount].min} до ${fieldsRange[FIELDS.carCount].max}`
                        : ''
                    }
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={5}>
              <VzForm.Item
                disabled={disabledFromCategories.compartmentCount || disabled}
                label={t.trailer('compartmentCount')}
                error={getFieldError(FIELDS.compartmentCount)}
                required={!disabledFromCategories.compartmentCount}
              >
                {getFieldDecorator(FIELDS.compartmentCount, {
                  initialValue: values?.[FIELDS.compartmentCount],
                  rules: rules[FIELDS.compartmentCount](getFieldsValue(), {
                    disabled: disabledFromCategories.compartmentCount,
                    range: fieldsRange[FIELDS.compartmentCount],
                  }),
                })(
                  <Ant.InputNumber
                    disabled={disabledFromCategories.compartmentCount || disabled}
                    decimalSeparator={','}
                    min={0}
                    placeholder={
                      fieldsRange[FIELDS.compartmentCount].max && fieldsRange[FIELDS.compartmentCount].min
                        ? `от ${fieldsRange[FIELDS.compartmentCount].min} до ${fieldsRange[FIELDS.compartmentCount].max
                        }`
                        : ''
                    }
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={24}>
              <VzForm.Item
                disabled={disabled}
                label={'Максимальная высота ТС от земли'}
                error={getFieldError(FIELDS.heightFromGroundInCm)}
                required={true}
              >
                {getFieldDecorator(FIELDS.heightFromGroundInCm, {
                  initialValue: values?.[FIELDS.heightFromGroundInCm] || '',
                  rules: rules[FIELDS.heightFromGroundInCm](getFieldsValue()),
                  normalize: (input) => input.toString().replace(',', '.'),
                })(<Ant.Input disabled={disabled} placeholder={'Укажите в метрах'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={!loadingsAvailable?.isSideLoadingAvailable || disabled}
                error={getFieldError(FIELDS.isSideLoadingAvailable)}
              >
                {getFieldDecorator(FIELDS.isSideLoadingAvailable, {
                  initialValue: values?.[FIELDS.isSideLoadingAvailable] || false,
                  rules: rules[FIELDS.isSideLoadingAvailable](getFieldsValue()),
                })(
                  <VzForm.FieldSwitch
                    disabled={!loadingsAvailable?.isSideLoadingAvailable || disabled}
                    checkedTitle={'Боковая погрузка'}
                    unCheckedTitle={'Боковая погрузка'}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.isSideLoadingAvailable) || false}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={!loadingsAvailable?.isTopLoadingAvailable || disabled}
                error={getFieldError(FIELDS.isTopLoadingAvailable)}
              >
                {getFieldDecorator(FIELDS.isTopLoadingAvailable, {
                  initialValue: values?.[FIELDS.isTopLoadingAvailable] || false,
                  rules: rules[FIELDS.isTopLoadingAvailable](getFieldsValue()),
                })(
                  <VzForm.FieldSwitch
                    disabled={!loadingsAvailable?.isTopLoadingAvailable || disabled}
                    checkedTitle={'Верхняя погрузка'}
                    unCheckedTitle={'Верхняя погрузка'}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.isTopLoadingAvailable) || false}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={disabledFromCategories.isCarTransporterCovered || disabled}
                error={getFieldError(FIELDS.isCarTransporterCovered)}
              >
                {getFieldDecorator(FIELDS.isCarTransporterCovered, {
                  initialValue: values?.[FIELDS.isCarTransporterCovered] || false,
                  rules: rules[FIELDS.isCarTransporterCovered](getFieldsValue()),
                })(
                  <VzForm.FieldSwitch
                    disabled={disabledFromCategories.isCarTransporterCovered || disabled}
                    checkedTitle={t.trailer('isCarTransporterCovered')}
                    unCheckedTitle={t.trailer('isCarTransporterCovered')}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.isCarTransporterCovered) || false}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            {String(getFieldValue('bodyType')) === '2' && (
              <>
                <VzForm.Col span={8}>
                  <VzForm.Item disabled={disabled} error={getFieldError(FIELDS.isThermograph)}>
                    {getFieldDecorator(FIELDS.isThermograph, {
                      initialValue: values?.[FIELDS.isThermograph] || '',
                      rules: rules[FIELDS.isThermograph](getFieldsValue()),
                    })(
                      <VzForm.FieldSwitch
                        disabled={disabled}
                        checkedTitle={'Наличие термописца'}
                        unCheckedTitle={'Наличие термописца'}
                        colorChecked={false}
                        checked={getFieldValue(FIELDS.isThermograph) || false}
                      />,
                    )}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={8}>
                  <VzForm.Item
                    disabled={disabled}
                    label={'Температура от, ℃'}
                    error={getFieldError(FIELDS.temperatureMin)}
                    required={true}
                  >
                    {getFieldDecorator(FIELDS.temperatureMin, {
                      initialValue: values?.[FIELDS.temperatureMin] || 0,
                      rules: rules[FIELDS.temperatureMin](getFieldsValue()),
                    })(<Ant.Input disabled={disabled} />)}
                  </VzForm.Item>
                </VzForm.Col>
                <VzForm.Col span={8}>
                  <VzForm.Item
                    disabled={disabled}
                    label={'Температура до, ℃'}
                    error={getFieldError(FIELDS.temperatureMax)}
                    required={true}
                  >
                    {getFieldDecorator(FIELDS.temperatureMax, {
                      initialValue: values?.[FIELDS.temperatureMax] || 0,
                      rules: rules[FIELDS.temperatureMax](getFieldsValue()),
                    })(<Ant.Input disabled={disabled} />)}
                  </VzForm.Item>
                </VzForm.Col>
              </>
            )}
          </VzForm.Row>
        </VzForm.Group>
        <AdditionalData form={form} disabled={disabled} rules={rules} values={values} />
        <VzForm.Group title={'Документы'}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item disabled={disabled} error={getFieldError(FIELDS.hasSanitaryPassport)}>
                {getFieldDecorator(FIELDS.hasSanitaryPassport, {
                  rules: rules[FIELDS.hasSanitaryPassport](getFieldsValue()),
                  initialValue: values?.[FIELDS.hasSanitaryPassport] || false,
                })(
                  <VzForm.FieldSwitch
                    disabled={disabled}
                    style={{ padding: '6px 7px' }}
                    checkedTitle={'Договор о санитарной обработке'}
                    unCheckedTitle={'Договор о санитарной обработке'}
                    colorChecked={false}
                    checked={getFieldValue(FIELDS.hasSanitaryPassport) || false}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            {getFieldValue(FIELDS.hasSanitaryPassport) ? (
              <VzForm.Col span={12}>
                <VzForm.Item
                  disabled={disabled}
                  label={'Годен до'}
                  error={getFieldError(FIELDS.sanitaryPassportExpiresAtDate)}
                  required={!!getFieldValue(FIELDS.hasSanitaryPassport)}
                >
                  {getFieldDecorator(FIELDS.sanitaryPassportExpiresAtDate, {
                    rules: rules[FIELDS.sanitaryPassportExpiresAtDate](getFieldsValue()),
                    initialValue: moment(values?.[FIELDS.sanitaryPassportExpiresAtDate]).isValid()
                      ? moment(values?.[FIELDS.sanitaryPassportExpiresAtDate])
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
        <VzForm.Group title="Фотография ТС (номерные знаки на фотографии должны быть четко видны)">
          <h6 className={'box-title'}>{t.order('importantBothFiles')}</h6>
          <div className={'flexbox margin-top-20'}>
            <div className={'flexbox size-1'}>
              <DocViewer
                fileData={fileGetFileData(photoRightSide) || defaultFileData(`${t.order('photo')} (сзади, справа)`)}
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'photoRightSide'}
                editable={true}
                onRemove={() => setPhotoRightSide(null)}
                onChange={(fileData) => {
                  setPhotoRightSide(fileData);
                }}
              />
            </div>
            <div className={'flexbox size-1'}>
              <DocViewer
                fileData={fileGetFileData(photoLeftSide) || defaultFileData(`${t.order('photo')} (сзади, слева)`)}
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'photoLeftSide'}
                editable={true}
                onRemove={() => setPhotoLeftSide(null)}
                onChange={(fileData) => {
                  setPhotoLeftSide(fileData);
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
              {saveButtonText || 'Добавить ТС'}
            </ButtonDeprecated>
          </VzForm.Actions>
        </VzForm.Group>
      </div>
    </div>
  );
}

export default Ant.Form.create({})(TrailerForm);
