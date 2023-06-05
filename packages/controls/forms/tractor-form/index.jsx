import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Ant, VzForm, ButtonDeprecated, GeoZonesElement, IconDeprecated } from '@vezubr/elements';
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
import _range from 'lodash/range';
import { history } from '../../infrastructure';
const currentYear = new Date().getFullYear();
const FIELDS = {
  plateNumber: 'plateNumber',
  vin: 'vin',
  markAndModel: 'markAndModel',
  yearOfManufacture: 'yearOfManufacture',
  ownerType: 'ownerType',
  registrationCertificateFrontSideFile: 'registrationCertificateFrontSideFile',
  photo: 'photo',
  registrationCertificateReverseSideFile: 'registrationCertificateReverseSideFile',
};

function TractorForm(props) {
  const { onSave, form, disabled = false, values = {}, saveButtonText } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user);
  const { geozones } = dictionaries || {};
  const { getFieldError, getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue } = form;
  const [geozonePasses, setGeozonePasses] = useState([]);
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
  const [linkedDrivers, setLinkedDrivers] = useState([]);
  useEffect(() => {
    if (Array.isArray(values?.linkedDrivers) && values?.linkedDrivers.length) {
      setLinkedDrivers(values.linkedDrivers);
    }
    if (Array.isArray(values?.geozonePasses) && values?.geozonePasses.length) {
      setGeozonePasses(
        values?.geozonePasses.map((el) => {
          el.geozoneId = String(el.id);
          return el;
        }),
      );
    }
  }, [values?.linkedDrivers, values?.geozonePasses]);

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
      setPhoto(getInitialValueOfAFile(FIELDS.photo));
    }
  }, [values]);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      const files = {
        registrationCertificateFrontSideFile,
        registrationCertificateReverseSideFile,
        photo,
      };
      const extraData = {
        linkedDriversIds: linkedDrivers.map((el) => String(el.id)),
        geozonePasses,
      };
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
              <VzForm.Item disabled={disabled} label={'vin'} error={getFieldError(FIELDS.vin)} required={false}>
                {getFieldDecorator(FIELDS.vin, {
                  initialValue: values?.[FIELDS.vin] || '',
                  rules: rules[FIELDS.vin](getFieldsValue()),
                })(<Ant.Input disabled={disabled} placeholder={'vin'} />)}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
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
                required={true}
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
                label={'Собственник'}
                required={true}
                error={getFieldError(FIELDS.ownerType)}
              >
                {getFieldDecorator(FIELDS.ownerType, {
                  initialValue: values?.[FIELDS.ownerType] || null,
                  rules: rules[FIELDS.ownerType](getFieldsValue()),
                })(<Ant.Select disabled={disabled}>{renderOwnerTypes}</Ant.Select>)}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <GeozonesAdditional
            geozones={Object.keys(geozones).map((el) => {
              return { ...geozones[el], id: el };
            })}
            geozonePasses={geozonePasses}
            setGeozonePasses={setGeozonePasses}
          />
        </VzForm.Group>
        <VzForm.Group title="Фотография Тягача (номерные знаки на фотографии должны быть четко видны)">
          <h6 className={'box-title'}>{t.order('importantBothFiles')}</h6>
          <div className={'flexbox margin-top-20'}>
            <div className={'flexbox size-1'}>
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
            </div>
          </div>
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
              {saveButtonText || 'Добавить тягач'}
            </ButtonDeprecated>
          </VzForm.Actions>
        </VzForm.Group>
      </div>
    </div>
  );
}

export default Ant.Form.create({})(TractorForm);
