import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Ant, VzForm, ButtonDeprecated, Modal } from '@vezubr/elements';
import moment from 'moment';
import Validators from '@vezubr/common/common/validators';
import InputMask from 'react-input-mask';
import t from '@vezubr/common/localization';
import { DocViewer } from '@vezubr/uploader';
import { fileGetFileData } from '@vezubr/common/utils';
import { useSelector } from 'react-redux';
import { AssignDriverNew } from '@vezubr/components';
import GeozonesAdditional from './additionalInfo/geozones';
import DriversAdditional from './additionalInfo/drivers';
import BasingAddress from './additionalInfo/basingAddress';
import _range from 'lodash/range';
import { Utils } from '@vezubr/common/common';
import { history } from '../../infrastructure';
import AdditionalData from './additionalInfo/additionalData';
import ProducersList from '../../lists/modals/producersPrivate';
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
  photo: 'photo',
  registrationCertificateReverseSideFile: 'registrationCertificateReverseSideFile',
  hasSanitaryPassport: 'hasSanitaryPassport',
  sanitaryPassportExpiresAtDate: 'sanitaryPassportExpiresAtDate',
  photoLeftSide: 'photoLeftSide',
  photoRightSide: 'photoRightSide',
  craneLength: 'craneLength',
  craneCapacity: 'craneCapacity',
  passengersCapacity: 'passengersCapacity',
  category: 'category',
};

const CATEGORIES = [1, 2, 4];

function TransportForm(props) {
  const { onSave, form, disabled = false, values = {}, saveButtonText } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user);
  const { geozones, vehicleBodies = [], vehicleTypes = [] } = dictionaries || {};
  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue, setFields } = form;
  const [geozonePasses, setGeozonePasses] = useState([]);
  const [vehicleType, setVehicleType] = useState(null);
  const [address, setAddress] = useState(null);
  const [loadingsAvailable, setLoadingsAvailable] = useState({
    isTopLoadingAvailable: true,
    isSideLoadingAvailable: true,
  });
  const [disabledCategories, setDisabledCategories] = useState([]);
  const [disabledFromCategories, setDisabledFromCategories] = useState({
    craneLength: true,
    craneCapacity: true,
    passengersCapacity: true,
    volume: false,
    palletsCapacity: false,
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
    [FIELDS.craneCapacity]: {
      min: null,
      max: null,
    },
    [FIELDS.craneLength]: {
      min: null,
      max: null,
    },
    [FIELDS.palletsCapacity]: {
      min: null,
      max: null,
    },
  });
  const [producer, setProducer] = useState(null);
  const [showProducersModal, setShowProducersModal] = useState(false);

  const rules = VzForm.useCreateAsyncRules(Validators.createEditProducerVehicle);

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
    const categories = getFieldValue(FIELDS.category);
    let disabled = [];
    if (Array.isArray(categories)) {
      if (categories.includes(2)) {
        disabled.push(4);
      } else if (categories.includes(4)) {
        disabled.push(2);
      }
    }
    const filteredCategories = dictionaries.vehicleTypeCategories.filter((el) => CATEGORIES.includes(el.id));
    return filteredCategories.map((el) => (
      <Ant.Select.Option disabled={disabled.find((item) => item === el.id)} key={el.id} value={el.id}>
        {el.title}
      </Ant.Select.Option>
    ));
  }, [disabledCategories, getFieldValue(FIELDS.category)]);

  const vehicleBodiesComputed = useMemo(() => {
    const categories = getFieldValue(FIELDS.category);
    if (!vehicleType && !categories) {
      return vehicleBodies;
    }
    let availableBodyTypes = [];
    if (vehicleType) {
      const vehicle = vehicleTypes.find((el) => vehicleType === el.id);
      availableBodyTypes = vehicleBodies.filter((el) => vehicle.availableBodyTypes?.[el.id]);
    } else {
      availableBodyTypes = vehicleBodies;
    }
    if (Array.isArray(categories)) {
      categories.forEach((item) => {
        availableBodyTypes = availableBodyTypes.filter((el) =>
          dictionaries.vehicleBodyTypeToCategoryVehicleTypeMap[item].includes(el.id),
        );
      });
    }
    return availableBodyTypes;
  }, [vehicleType, vehicleBodies, vehicleTypes, getFieldValue(FIELDS.category)]);

  useEffect(() => {
    const liftingPalletsMin = getFieldValue(FIELDS.palletsCapacity);
    const liftingCapacityMin = getFieldValue(FIELDS.liftingCapacityInKg);
    const volumeMin = getFieldValue(FIELDS.volume);
    const bodyType = getFieldValue(FIELDS.bodyType);
    const categories = getFieldValue(FIELDS.category);
    let categoriesAvailableBodyTypes = [];
    if (categories && Array.isArray(categories)) {
      categories.forEach((item) => {
        categoriesAvailableBodyTypes = [
          ...categoriesAvailableBodyTypes,
          ...dictionaries.vehicleBodyTypeToCategoryVehicleTypeMap[item],
        ];
      });
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
        !vehicleTypes.find((el) => el.id === vehicleTypeNew)?.availableBodyTypes?.[bodyType]
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

  const onLiftingCapacityChange = useCallback((value) => {
    setFieldsValue({
      [FIELDS.liftingCapacityInKg]: value,
      [FIELDS.liftingCapacityMax]: value,
    });
  }, []);

  const bodyTypes = useMemo(() => {
    return vehicleBodiesComputed.map(({ id, title }) => (
      <Ant.Select.Option key={id} value={id}>
        {title}
      </Ant.Select.Option>
    ));
  }, [vehicleBodiesComputed]);

  const passengerOptions = useMemo(() => {
    return _range(4, 8).map((item) => (
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
  const [photo, setPhoto] = useState(getInitialValueOfAFile(FIELDS.photo));
  const [photoRightSide, setPhotoRightSide] = useState(getInitialValueOfAFile(FIELDS.photoRightSide));
  const [photoLeftSide, setPhotoLeftSide] = useState(getInitialValueOfAFile(FIELDS.photoLeftSide));
  const [linkedDrivers, setLinkedDrivers] = useState([]);
  useEffect(() => {
    if (Array.isArray(values?.linkedDrivers) && values?.linkedDrivers.length) {
      setLinkedDrivers(values.linkedDrivers);
    }
    if (Array.isArray(values?.geozonePasses) && values?.geozonePasses.length) {
      setGeozonePasses(values?.geozonePasses);
    }
    if (values?.bodyType) {
      setFieldsValue({ [FIELDS.bodyType]: values?.bodyType });
    }
    if (values?.producer) {
      setProducer(values?.producer);
    }
  }, [values?.linkedDrivers, values?.geozonePasses, values?.bodyType, values?.producer]);

  const defaultFileData = useCallback(
    (name) => ({
      fileName: name,
    }),
    [],
  );

  const onSaveProducer = useCallback((e) => {
    setProducer(e);
    setShowProducersModal(false);
  }, [])

  useEffect(() => {
    if (Object.values(values).length) {
      setRCFSFile(getInitialValueOfAFile(FIELDS.registrationCertificateFrontSideFile));
      setRCRSFile(getInitialValueOfAFile(FIELDS.registrationCertificateReverseSideFile));
      setPhoto(getInitialValueOfAFile(FIELDS.photo));
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
      const categories = getFieldValue(FIELDS.category);
      if (!categories || categories?.includes(1)) {
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

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (Array.isArray(geozonePasses)) {
        for (let el of geozonePasses) {
          if (!el?.expiresOnDate) {
            return;
          }
        }
      }

      const files = {
        registrationCertificateFrontSideFile,
        registrationCertificateReverseSideFile,
        photo,
        photoLeftSide,
        photoRightSide,
      };
      const extraData = {
        linkedDriversIds: linkedDrivers.map((el) => String(el.id)),
        geozonePasses,
        isRearLoadingAvailable: true,
        producer
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
      linkedDrivers,
      geozonePasses,
      registrationCertificateFrontSideFile,
      registrationCertificateReverseSideFile,
      photo,
      address,
      photoLeftSide,
      photoRightSide,
      producer
    ],
  );

  useEffect(() => {
    const categories = getFieldValue(FIELDS.category);
    const bodyType = getFieldValue(FIELDS.bodyType);
    const disabledCategories = [];
    if (!categories) {
      return;
    }
    const cargo = categories.includes(1);
    const manipulator = categories.includes(2);
    const passenger = categories.includes(4);
    categories.forEach((el) => {
      const categoryAvailableBodyTypes = dictionaries.vehicleBodyTypeToCategoryVehicleTypeMap[el];
      const filteredCategories = dictionaries.vehicleTypeCategories.filter((el) => CATEGORIES.includes(el.id));
      filteredCategories.forEach((item) => {
        const contains = dictionaries.vehicleBodyTypeToCategoryVehicleTypeMap[item.id].some((value) => {
          return categoryAvailableBodyTypes.includes(value);
        });
        if (!contains) {
          disabledCategories.push(item.id);
        }
      });
    });
    setDisabledCategories(disabledCategories);
    const disabledFields = { ...disabledFromCategories };
    const range = { ...fieldsRange };
    if (!passenger) {
      disabledFields.passengersCapacity = true;
      if (getFieldValue(FIELDS.passengersCapacity)) {
        setFieldsValue({
          [FIELDS.passengersCapacity]: '',
        });
      }
    }
    if (!manipulator) {
      disabledFields.craneCapacity = true;
      disabledFields.craneLength = true;
      disabledFields.volume = false;
      range[FIELDS.craneCapacity] = { min: null, max: null };
      range[FIELDS.craneLength] = { min: null, max: null };
      if (getFieldValue(FIELDS.craneCapacity) || getFieldValue(FIELDS.craneLength)) {
        setFieldsValue({
          [FIELDS.craneCapacity]: '',
          [FIELDS.craneLength]: '',
        });
      }
    }
    if (!cargo) {
      range[FIELDS.palletsCapacity] = { min: null, max: null };
    }
    if (manipulator) {
      disabledFields.volume = true;
      disabledFields.craneCapacity = false;
      disabledFields.craneLength = false;
      disabledFields.palletsCapacity = true;
      range[FIELDS.volume] = { min: null, max: null };
      range[FIELDS.liftingCapacityInKg] = { min: 1, max: 30 };
      range[FIELDS.craneCapacity] = { min: 1, max: 10 };
      range[FIELDS.craneLength] = { min: 3, max: 15 };
    }
    if (passenger) {
      disabledFields.passengersCapacity = false;
      disabledFields.volume = true;
      disabledFields.palletsCapacity = true;
      range[FIELDS.volume] = { min: null, max: null };
      range[FIELDS.liftingCapacityInKg] = { min: 1, max: 5 };
    }
    if (cargo) {
      disabledFields.volume = false;
      disabledFields.palletsCapacity = false;
      range[FIELDS.volume] = { min: 0.5, max: 120 };
      range[FIELDS.liftingCapacityInKg] = { min: 0.5, max: 30 };
      range[FIELDS.palletsCapacity] = { min: 0, max: 35 };
      if (bodyType === 7) {
        range[FIELDS.liftingCapacityInKg].max = 5;
      }
    }
    if (cargo && manipulator) {
      range[FIELDS.liftingCapacityInKg] = { min: 1, max: 30 };
    }
    if (cargo && passenger) {
      range[FIELDS.liftingCapacityInKg] = { min: 1, max: 5 };
    }
    if ((manipulator || !passenger) && !cargo) {
      setFieldsValue({
        [FIELDS.bodyHeightInCm]: '',
        [FIELDS.bodyLengthInCm]: '',
        [FIELDS.bodyWidthInCm]: '',
        [FIELDS.volume]: '',
        [FIELDS.palletsCapacity]: null,
      });
    }
    if ((bodyType === 1 || bodyType === 6) && !disabledFields.volume) {
      disabledFields.volume = true;
      setFieldsValue({
        [FIELDS.bodyHeightInCm]: '',
        [FIELDS.bodyLengthInCm]: '',
        [FIELDS.bodyWidthInCm]: '',
        [FIELDS.volume]: '',
      });
    }
    setDisabledFromCategories(disabledFields);
    setFieldsRange(range);
  }, [getFieldValue(FIELDS.category), getFieldValue(FIELDS.bodyType)]);

  useEffect(() => {
    if (values?.category) {
      setFieldsValue({ category: Array.from(new Set(values?.category)) });
    }
  }, [values?.category]);

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
        {APP !== 'producer' && (
          <VzForm.Group>
            <VzForm.Row>
              <VzForm.Col span={12}>
                <button className={'vz-form-item'}
                  onClick={() => setShowProducersModal(true)}
                  style={{ height: "100%", width: "100%" }}
                >
                  <Ant.Tooltip placement="right" title={t.transports('hint.privateOwners')}>
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
                        "Собственное ТС"
                    }
                  </div>
                </button>
              </VzForm.Col>
            </VzForm.Row>
          </VzForm.Group>
        )}
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
                disabled={disabled}
                label={'Марка и модель'}
                error={getFieldError(FIELDS.markAndModel)}
                required={true}
              >
                {getFieldDecorator(FIELDS.markAndModel, {
                  initialValue: values?.[FIELDS.markAndModel] || '',
                  rules: rules[FIELDS.markAndModel](getFieldsValue()),
                })(<Ant.Input disabled={disabled} placeholder={'Укажите марку и модель'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item
                disabled={disabled}
                label={'Год выпуска'}
                error={getFieldError(FIELDS.yearOfManufacture)}
                required={false}
              >
                {getFieldDecorator(FIELDS.yearOfManufacture, {
                  initialValue: values?.[FIELDS.yearOfManufacture] || null,
                  rules: rules[FIELDS.yearOfManufacture](getFieldsValue()),
                })(
                  <Ant.Select disabled={disabled} placeholder={'Укажите год выпуска'}>
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
                required={true}
                label={'Собственник'}
                error={getFieldError(FIELDS.ownerType)}
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
                disabled={false}
                label={'Тип автоперевозки'}
                required={true}
                error={getFieldError(FIELDS.category)}
              >
                {getFieldDecorator(FIELDS.category, {
                  initialValue: Array.isArray(values?.[FIELDS.category])
                    ? [...new Set(values?.[FIELDS.category])]
                    : undefined,
                  rules: rules[FIELDS.category](getFieldsValue()),
                })(
                  <Ant.Select disabled={false} mode={'multiple'}>
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
                label={'Грузоподъемность по документам, т.'}
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
                    disabled={disabled}
                    onChange={(e) => onLiftingCapacityChange(e.target.value)}
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
                required={true}
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
                required={true}
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
                    precision={2}
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
                  <Ant.InputNumber
                    decimalSeparator=','
                    precision={2}
                    min={0}
                    onChange={(value) => onLWHChange(value, 'bodyLengthInCm')}
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
                  <Ant.InputNumber
                    decimalSeparator=','
                    min={0}
                    precision={2}
                    onChange={(value) => onLWHChange(value, 'bodyWidthInCm')}
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
                  <Ant.InputNumber
                    decimalSeparator=','
                    precision={2}
                    min={0}
                    onChange={(value) => onLWHChange(value, 'bodyHeightInCm')}
                    disabled={disabledFromCategories.volume || disabled}
                    placeholder={'Укажите в метрах'}
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={disabledFromCategories.palletsCapacity || disabled}
                label={'Паллетовместимость, шт.'}
                error={disabledFromCategories.palletsCapacity ? false : getFieldError(FIELDS.palletsCapacity)}
                required={!disabledFromCategories.palletsCapacity}
              >
                {getFieldDecorator(FIELDS.palletsCapacity, {
                  initialValue: values?.[FIELDS.palletsCapacity],
                  rules: disabledFromCategories.palletsCapacity
                    ? false
                    : rules[FIELDS.palletsCapacity](getFieldsValue(), {
                      disabled: disabledFromCategories.palletsCapacity,
                      range: fieldsRange[FIELDS.palletsCapacity],
                    }),
                })(
                  <Ant.InputNumber
                    min={0}
                    precision={0}
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
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={disabledFromCategories.passengersCapacity || disabled}
                label={'Пассажиров (без учета водителя)'}
                error={getFieldError(FIELDS.passengersCapacity)}
                required={!disabledFromCategories.passengersCapacity}
              >
                {getFieldDecorator(FIELDS.passengersCapacity, {
                  initialValue: values?.[FIELDS.passengersCapacity],
                  rules: rules[FIELDS.passengersCapacity](getFieldsValue(), {
                    disabled: disabledFromCategories.passengersCapacity,
                  }),
                })(
                  <Ant.Select
                    disabled={disabledFromCategories.passengersCapacity || disabled}
                    placeholder={'Выбрать из списка'}
                  >
                    {passengerOptions}
                  </Ant.Select>,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={disabledFromCategories.craneCapacity || disabled}
                label={'Грузоподъемность крана, т.'}
                error={disabledFromCategories.craneCapacity ? false : getFieldError(FIELDS.craneCapacity)}
                required={!disabledFromCategories.craneCapacity}
              >
                {getFieldDecorator(FIELDS.craneCapacity, {
                  initialValue: values?.[FIELDS.craneCapacity],
                  rules: rules[FIELDS.craneCapacity](getFieldsValue(), {
                    disabled: disabledFromCategories.craneCapacity,
                    range: fieldsRange[FIELDS.craneCapacity],
                  }),
                })(
                  <Ant.Input
                    disabled={disabledFromCategories.craneCapacity || disabled}
                    placeholder={
                      fieldsRange[FIELDS.craneCapacity].max && fieldsRange[FIELDS.craneCapacity].min
                        ? `от ${fieldsRange[FIELDS.craneCapacity].min} до ${fieldsRange[FIELDS.craneCapacity].max}`
                        : ''
                    }
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={6}>
              <VzForm.Item
                disabled={disabledFromCategories.craneLength || disabled}
                label={'Длина стрелы, м.'}
                error={disabledFromCategories.craneLength ? false : getFieldError(FIELDS.craneLength)}
                required={!disabledFromCategories?.craneLength}
              >
                {getFieldDecorator(FIELDS.craneLength, {
                  initialValue: values?.[FIELDS.craneLength],
                  rules: rules[FIELDS.craneLength](getFieldsValue(), {
                    disabled: disabledFromCategories.craneLength,
                    range: fieldsRange[FIELDS.craneLength],
                  }),
                })(
                  <Ant.Input
                    disabled={disabledFromCategories.craneLength || disabled}
                    placeholder={
                      fieldsRange[FIELDS.craneLength].max && fieldsRange[FIELDS.craneLength].min
                        ? `от ${fieldsRange[FIELDS.craneLength].min} до ${fieldsRange[FIELDS.craneLength].max}`
                        : ''
                    }
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={24}>
              <VzForm.Item
                disabled={disabled}
                label={'Максимальная высота ТС от земли, м.'}
                error={getFieldError(FIELDS.heightFromGroundInCm)}
                required={false}
              >
                {getFieldDecorator(FIELDS.heightFromGroundInCm, {
                  initialValue: values?.[FIELDS.heightFromGroundInCm] || '',
                  rules: rules[FIELDS.heightFromGroundInCm](getFieldsValue()),
                  normalize: (input) => input.toString().replace(',', '.'),
                })(<Ant.Input disabled={disabled} placeholder={'Укажите в метрах'} />)}
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={8}>
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
            <VzForm.Col span={8}>
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
                      initialValue: (values?.[FIELDS.temperatureMin]) || 0,
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
          <GeozonesAdditional
            geozones={Object.keys(geozones).map((el) => {
              return { ...geozones[el], id: el };
            })}
            geozonePasses={geozonePasses}
            setGeozonePasses={setGeozonePasses}
          />
        </VzForm.Group>
        <VzForm.Group title="Фотографии ТС (номерные знаки на фотографии должны быть четко видны)">
          <h6 className={'box-title'}>{t.order('importantBothFiles')}</h6>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <DocViewer
                fileData={fileGetFileData(photo) || defaultFileData(`${t.order('photo')} (спереди)`)}
                label={'Поддерживаются форматы: JPEG, PNG, PDF'}
                name={'photo'}
                editable={true}
                onRemove={() => setPhoto(null)}
                onChange={(fileData) => {
                  setPhoto(fileData);
                }}
              />
            </VzForm.Col>
            <VzForm.Col span={12}>
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
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={12}>
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
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
        <VzForm.Group>
          <DriversAdditional linkedDrivers={linkedDrivers} setLinkedDrivers={setLinkedDrivers} />
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

export default Ant.Form.create({})(TransportForm);
