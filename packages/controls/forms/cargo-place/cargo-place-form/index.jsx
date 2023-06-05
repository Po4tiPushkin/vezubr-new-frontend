import usePrevious from '@vezubr/common/hooks/usePrevious';
import t from '@vezubr/common/localization';
import { Ant, VzForm } from '@vezubr/elements';
import TooltipError from '@vezubr/elements/form/controls/tooltip-error';
import { Contractor as ContractorService, Organization as DDService } from '@vezubr/services';
import _compact from 'lodash/compact';
import _get from 'lodash/get';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const FIELDS = {
  externalId: 'externalId',
  parentBarCode: 'parentBarCode',
  wmsNumber: 'wmsNumber',
  barCode: 'barCode',
  type: 'type',
  trailer: 'trailer',
  sealNumber: 'sealNumber',
  length: 'length',
  width: 'width',
  height: 'height',
  volume: 'volume',
  weight: 'weight',
  reverseCargoType: 'reverseCargoType',
  reverseCargoReason: 'reverseCargoReason',
  comment: 'comment',

  invoiceNumber: 'invoiceNumber',
  invoiceDate: 'invoiceDate',
  innShipper: 'innShipper',
  kkpShipper: 'kkpShipper',
  cost: 'cost',
  totalCost: 'totalCost',
  innConsignee: 'innConsignee',
  kkpConsignee: 'kkpConsignee',

  departurePoint: 'departurePoint[id]',
  deliveryPoint: 'deliveryPoint[id]',

  status: 'status',
  statusAddress: 'statusAddress[id]',
  contractorOwner: 'contractorOwner',
  createdAt: 'createdAt',
  createdBy: 'createdBy',
  sealNumber: 'sealNumber',
  title: 'title',
  gmCountInside: 'gmCountInside',
};

function getFieldInitialValue(fieldName, values) {
  switch (fieldName) {
    default:
      return values?.[fieldName] || '';
  }
}

export const validators = {
  [FIELDS.status]: (status) => !status && 'Введите статус',
  [FIELDS.type]: (type) => !type && 'Введите тип',
  [FIELDS.departurePoint]: (departurePoint) => !departurePoint && 'Введите адрес отправки',
  [FIELDS.deliveryPoint]: (deliveryPoint) => !deliveryPoint && 'Введите адрес доставки',
};

const dataValidator = (date, required) => {
  if (required && !date) {
    return 'Выберите дату';
  }

  if (date && date.isBefore(moment(), 'date')) {
    return 'Дата не должна быть меньше текущего дня';
  }
};

const CargoForm = ({
  onSave,
  form,
  values = {},
  onCancel,
  onEdit,
  onDelete,
  mode,
  disabled,
  cargoPlaceTypes,
  reverseCargoTypes,
  cargoAddresses,
  cargoPlaceStatuses,
  showClientSelect = APP == 'dispatcher',
  cargoPlaceAdd = false,
}) => {
  const { getFieldError, getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const rules = VzForm.useCreateAsyncRules(validators);
  const user = useSelector((state) => state.user);
  const prevValues = usePrevious(values);
  const [clients, setClients] = useState([]);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form);
      }
    },
    [form, onSave],
  );

  const handleCancel = useCallback(
    (e) => {
      e.preventDefault();
      if (onCancel) {
        onCancel(form);
      }
    },
    [form, onCancel],
  );

  const onRangeChange = (dates, dateStrings) => {
    const fromValue = dateStrings[0];
    const toValue = dateStrings[1];

    setFieldsValue({
      [FIELDS.deliveryIntervalBegin]: fromValue,
      [FIELDS.deliveryIntervalEnd]: toValue,
    });
  };

  React.useEffect(() => {
    const fetchClientUsers = async () => {
      try {
        const response = await ContractorService.clientList();
        const dataSource = response?.data || [];
        setClients(
          dataSource.map((item) => {
            return {
              label: item?.title || item?.inn,
              value: item?.id,
            };
          }),
        );
      } catch (e) {
        console.error(e);
      }
    };
    if (showClientSelect) {
      fetchClientUsers();
    }
  }, [showClientSelect]);

  const contractorOwnerOptions = useMemo(
    () =>
      clients.map((item) => (
        <Ant.Select.Option key={item.value} value={item.value}>
          {item.label}
        </Ant.Select.Option>
      )),
    [clients],
  );

  const cargoPlaceTypesOptions = useMemo(
    () =>
      cargoPlaceTypes.map((item) => (
        <Ant.Select.Option key={item.id} value={item.id}>
          {item.title}
        </Ant.Select.Option>
      )),
    [cargoPlaceTypes],
  );

  const reverseCargoTypesOptions = useMemo(
    () =>
      reverseCargoTypes.map((item) => (
        <Ant.Select.Option key={item.id} value={item.id}>
          {t.order(`reverseCargoTypes.${item.id}`)}
        </Ant.Select.Option>
      )),
    [reverseCargoTypes],
  );

  const cargoPlaceStatusesOptions = useMemo(
    () =>
      cargoPlaceStatuses.map((item) => (
        <Ant.Select.Option key={item.id} value={item.id}>
          {t.order(`cargoPlaceStatuses.${item.id}`)}
        </Ant.Select.Option>
      )),
    [cargoPlaceStatuses],
  );

  const cargoAddressesOptions = useMemo(
    () =>
      cargoAddresses
        .filter((item) => {
          return getFieldValue(FIELDS.contractorOwner)
            ? item.contractorOwner.id == getFieldValue(FIELDS.contractorOwner)
            : true;
        })
        .map((item) => {
          const titleArr = [item.id, item?.externalId, item?.addressString, item?.contractorOwner?.id];
          if (APP === 'client') {
            titleArr.pop();
          }
          return (
            <Ant.Select.Option key={item.id} value={item.id}>
              {_compact(titleArr).join(' / ')}
            </Ant.Select.Option>
          );
        }),
    [cargoAddresses, getFieldValue(FIELDS.contractorOwner)],
  );

  const addressesDisabled = useMemo(() => {
    return disabled || !getFieldValue(FIELDS.contractorOwner);
  }, [disabled, getFieldValue(FIELDS.contractorOwner)]);

  const [innSuggestions, setInnSuggestions] = useState([]);
  const [innConsignee, setInnConsignee] = useState([]);

  const getInnCompanyName = async (value) => {
    try {
      return (await DDService.getOrganization(value)) || [];
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const handleSearch = useCallback(
    async (value, getInn, setInn) => {
      if (!value) {
        return;
      }

      const suggestions = await getInn(value);
      setInn(suggestions);
    },
    [getInnCompanyName],
  );

  const isDisabledVolume =
    disabled || (getFieldValue(FIELDS.length) && getFieldValue(FIELDS.width) && getFieldValue(FIELDS.height));

  const dataSourceInnSuggestions = useMemo(
    () =>
      innSuggestions.map((data) => ({
        value: data?.inn,
        text: `${data?.fullName}${data?.inn && '/' + data?.inn}`,
      })),
    [innSuggestions],
  );

  const dataSourceInnConsignee = useMemo(
    () =>
      innConsignee.map((data) => ({
        value: data?.inn,
        text: `${data?.fullName}${data?.inn && '/' + data?.inn}`,
      })),
    [innConsignee],
  );

  const onChangeContractor = React.useCallback(() => {
    setFieldsValue({
      [FIELDS.departurePoint]: null,
      [FIELDS.deliveryPoint]: null,
    });
  }, []);

  useEffect(() => {
    const fetchInn = async (inn, setInn) => {
      const suggestions = await getInnCompanyName(inn);
      setInn(suggestions);
    };
    if (values && prevValues !== values && values[FIELDS.innShipper]) {
      fetchInn(values[FIELDS.innShipper], setInnSuggestions);
    }
    if (values && prevValues !== values && values[FIELDS.innConsignee]) {
      fetchInn(values[FIELDS.innConsignee], setInnConsignee);
    }
  }, [getInnCompanyName, values, prevValues]);

  const onChangeCost = useCallback((value, type) => {
    if (!value) {
      setFieldsValue({
        [FIELDS.cost]: null,
        [FIELDS.totalCost]: null,
      });
      return;
    }
    if (type === FIELDS.cost) {
      const newCostWithoutVat = parseInt(value);
      const newCostWithVat = newCostWithoutVat + (newCostWithoutVat * parseInt(user.vatRate)) / 100;
      setFieldsValue({
        [FIELDS.cost]: +newCostWithoutVat.toFixed(0),
        [FIELDS.totalCost]: +newCostWithVat.toFixed(0),
      });
    } else if (type === FIELDS.totalCost) {
      const newCostWithVat = parseInt(value);
      const newCostWithoutVat = newCostWithVat * (100 / (100 + parseInt(user.vatRate)));
      setFieldsValue({
        [FIELDS.cost]: +newCostWithoutVat.toFixed(0),
        [FIELDS.totalCost]: +newCostWithVat.toFixed(0),
      });
    }
  }, []);

  return (
    <Ant.Form className="cargo-form" layout="vertical" onSubmit={handleSave}>
      <VzForm.Group title={'Характеристики грузоместа'}>
        <VzForm.Row>
          <VzForm.Col span={6}>
            <VzForm.Item disabled={disabled} label={'Тип'} error={getFieldError(FIELDS.type)}>
              {getFieldDecorator(FIELDS.type, {
                rules: rules[FIELDS.type](),
                initialValue: values?.[FIELDS.type] || '',
              })(
                <Ant.Select allowClear={true} showSearch={true} disabled={disabled}>
                  {cargoPlaceTypesOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item disabled={disabled} label={'Объем, м3'} error={getFieldError(FIELDS.volume)}>
              {getFieldDecorator(FIELDS.volume, {
                rules: rules[FIELDS.volume](),
                initialValue: values?.[FIELDS.volume] || '',
              })(
                <Ant.InputNumber
                  placeholder={''}
                  min={0}
                  disabled={isDisabledVolume}
                  decimalSeparator={','}
                  step={0.000001}
                  allowClear={true}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item disabled={disabled} label={'Вес, кг'} error={getFieldError(FIELDS.weight)}>
              {getFieldDecorator(FIELDS.weight, {
                rules: rules[FIELDS.weight](),
                initialValue: values?.[FIELDS.weight] || '',
              })(
                <Ant.InputNumber
                  placeholder={''}
                  min={0}
                  disabled={disabled}
                  decimalSeparator={','}
                  step={0.001}
                  allowClear={true}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item disabled={disabled} label={'Количество мест в ГМ'} error={getFieldError(FIELDS.gmCountInside)}>
              {getFieldDecorator(FIELDS.gmCountInside, {
                rules: rules[FIELDS.gmCountInside](),
                initialValue: values?.[FIELDS.gmCountInside] || '',
              })(
                <Ant.InputNumber
                  placeholder={''}
                  min={0}
                  disabled={disabled}
                  decimalSeparator={','}
                  step={0.001}
                  allowClear={true}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={disabled} label={'Категория/Наименование'} error={getFieldError(FIELDS.title)}>
              {getFieldDecorator(FIELDS.title, {
                rules: rules[FIELDS.title](),
                initialValue: values?.[FIELDS.title] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item disabled={disabled} label={'Стоимость без НДС, руб'} error={getFieldError(FIELDS.cost)}>
              {getFieldDecorator(FIELDS.cost, {
                rules: rules[FIELDS.cost](),
                initialValue: values?.[FIELDS.cost] || '',
              })(
                <Ant.InputNumber
                  onChange={(e) => {
                    onChangeCost(e, FIELDS.cost);
                  }}
                  placeholder={''}
                  disabled={disabled}
                  allowClear={true}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item disabled={disabled} label={'Номер пломбы'} error={getFieldError(FIELDS.sealNumber)}>
              {getFieldDecorator(FIELDS.sealNumber, {
                rules: rules[FIELDS.sealNumber](),
                initialValue: values?.[FIELDS.sealNumber] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
              <TooltipError error={getFieldError(FIELDS.sealNumber)} />
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item
              disabled={disabled}
              label={'Bar code родительского ГМ'}
              error={getFieldError(FIELDS.parentBarCode)}
            >
              {getFieldDecorator(FIELDS.parentBarCode, {
                rules: rules[FIELDS.parentBarCode](),
                initialValue: values?.[FIELDS.parentBarCode] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
              <TooltipError error={getFieldError(FIELDS.parentBarCode)} />
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={disabled} label={'Bar Code'} error={getFieldError(FIELDS.barCode)}>
              {getFieldDecorator(FIELDS.barCode, {
                rules: rules[FIELDS.barCode](),
                initialValue: values?.[FIELDS.barCode] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col span={6}>
            <VzForm.Item error={getFieldError(FIELDS.reverseCargoType)} disabled={disabled} label={'Тип обратного ГМ'}>
              {getFieldDecorator(FIELDS.reverseCargoType, {
                rules: rules[FIELDS.reverseCargoType](),
                initialValue: values?.[FIELDS.reverseCargoType] || '',
              })(
                <Ant.Select allowClear={true} showSearch={true} disabled={disabled}>
                  {reverseCargoTypesOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item
              error={getFieldError(FIELDS.reverseCargoReason)}
              disabled={disabled}
              label={'Причина обратного ГМ'}
            >
              {getFieldDecorator(FIELDS.reverseCargoReason, {
                rules: rules[FIELDS.reverseCargoReason](),
                initialValue: values?.[FIELDS.reverseCargoReason] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item disabled={disabled} label={'ID грузоместа партнера'} error={getFieldError(FIELDS.externalId)}>
              {getFieldDecorator(FIELDS.externalId, {
                rules: rules[FIELDS.externalId](),
                initialValue: values?.[FIELDS.externalId] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
              <TooltipError error={getFieldError(FIELDS.externalId)} />
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={6}>
            <VzForm.Item disabled={disabled} label={'Номер из WMS'} error={getFieldError(FIELDS.wmsNumber)}>
              {getFieldDecorator(FIELDS.wmsNumber, {
                rules: rules[FIELDS.wmsNumber](),
                initialValue: values?.[FIELDS.wmsNumber] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
              <TooltipError error={getFieldError(FIELDS.wmsNumber)} />
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>
          <VzForm.Col span={cargoPlaceAdd ? 12 : 6}>
            <VzForm.Item disabled={disabled} label={'Номер Тов. Накладной'} error={getFieldError(FIELDS.invoiceNumber)}>
              {getFieldDecorator(FIELDS.invoiceNumber, {
                rules: rules[FIELDS.invoiceNumber](),
                initialValue: values?.[FIELDS.invoiceNumber] || '',
              })(<Ant.InputNumber placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={cargoPlaceAdd ? 12 : 6}>
            <VzForm.Item disabled={disabled} label={'Дата Тов. Накладной'} error={getFieldError(FIELDS.invoiceDate)}>
              {getFieldDecorator(FIELDS.invoiceDate, {
                rules: rules[FIELDS.invoiceDate](),
                initialValue: values?.[FIELDS.invoiceDate] ? moment(values?.[FIELDS.invoiceDate]) : null,
              })(
                <Ant.DatePicker
                  placeholder={'дд.мм.гггг'}
                  disabled={disabled}
                  allowClear={true}
                  format={['DD.MM.YYYY', 'YYYY.MMM.DD']}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          {!cargoPlaceAdd ? (
            <>
              <VzForm.Col span={6}>
                <VzForm.Item disabled={disabled} label={'Создал'} error={getFieldError(FIELDS.createdBy)}>
                  {getFieldDecorator(FIELDS.createdBy, {
                    rules: rules[FIELDS.createdBy](),
                    initialValue: values?.[FIELDS.createdBy] || '',
                  })(<Ant.InputNumber placeholder={''} disabled={disabled} allowClear={true} />)}
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={6}>
                <VzForm.Item disabled={disabled} label={'Дата создания'} error={getFieldError(FIELDS.createdAt)}>
                  {getFieldDecorator(FIELDS.createdAt, {
                    rules: rules[FIELDS.createdAt](),
                    initialValue: values?.[FIELDS.createdAt] ? moment(values?.[FIELDS.createdAt]) : null,
                  })(
                    <Ant.DatePicker
                      placeholder={'дд.мм.гггг'}
                      disabled={disabled}
                      allowClear={true}
                      format={['DD.MM.YYYY', 'YYYY.MMM.DD']}
                    />,
                  )}
                </VzForm.Item>
              </VzForm.Col>
            </>
          ) : null}
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col span={24}>
            <VzForm.Item disabled={disabled} label={'Комментарий'} error={getFieldError(FIELDS.comment)}>
              {getFieldDecorator(FIELDS.comment, {
                rules: rules[FIELDS.comment](),
                initialValue: values?.[FIELDS.comment] || '',
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      {cargoPlaceAdd ? (
        <VzForm.Group title={'Инструкции по доставке'}>
          {showClientSelect ? (
            <VzForm.Row>
              <VzForm.Col span={24}>
                <VzForm.Item disabled={disabled} label={'Владелец груза'} error={getFieldError(FIELDS.contractorOwner)}>
                  {getFieldDecorator(FIELDS.contractorOwner, {
                    rules: rules[FIELDS.contractorOwner](' '),
                    initialValue: _get(values, FIELDS.contractorOwner)?.id || '',
                  })(
                    <Ant.Select
                      allowClear={true}
                      showSearch={true}
                      disabled={disabled}
                      onChange={onChangeContractor}
                      optionFilterProp={'children'}
                    >
                      {contractorOwnerOptions}
                    </Ant.Select>,
                  )}
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Row>
          ) : null}

          <VzForm.Row>
            <VzForm.Col span={24}>
              <VzForm.Item
                disabled={APP === 'dispatcher' ? addressesDisabled : disabled}
                label={'Адрес отправления'}
                error={getFieldError(FIELDS.departurePoint)}
              >
                {getFieldDecorator(FIELDS.departurePoint, {
                  rules: rules[FIELDS.departurePoint](' '),
                  initialValue: _get(values, FIELDS.departurePoint) || '',
                })(
                  <Ant.Select
                    allowClear={true}
                    showSearch={true}
                    disabled={APP === 'dispatcher' ? addressesDisabled : disabled}
                    optionFilterProp={'children'}
                  >
                    {cargoAddressesOptions}
                  </Ant.Select>,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={24}>
              <VzForm.Item disabled={disabled} label={'Отправитель'} error={getFieldError(FIELDS.innShipper)}>
                {getFieldDecorator(FIELDS.innShipper, {
                  rules: rules[FIELDS.innShipper](),
                  initialValue: getFieldInitialValue(FIELDS.innShipper, values),
                })(
                  <Ant.AutoComplete
                    disabled={disabled}
                    dataSource={dataSourceInnSuggestions}
                    onSearch={(e) => handleSearch(e, getInnCompanyName, setInnSuggestions)}
                    placeholder="Введите ИНН"
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={24}>
              <VzForm.Item
                disabled={APP === 'dispatcher' ? addressesDisabled : disabled}
                label={'Адрес доставки'}
                error={getFieldError(FIELDS.deliveryPoint)}
              >
                {getFieldDecorator(FIELDS.deliveryPoint, {
                  rules: rules[FIELDS.deliveryPoint](' '),
                  initialValue: _get(values, FIELDS.deliveryPoint) || '',
                })(
                  <Ant.Select
                    allowClear={true}
                    showSearch={true}
                    disabled={APP === 'dispatcher' ? addressesDisabled : disabled}
                    optionFilterProp={'children'}
                  >
                    {cargoAddressesOptions}
                  </Ant.Select>,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <VzForm.Row>
            <VzForm.Col span={24}>
              <VzForm.Item disabled={disabled} label={'Получатель'} error={getFieldError(FIELDS.innConsignee)}>
                {getFieldDecorator(FIELDS.innConsignee, {
                  rules: rules[FIELDS.innConsignee](),
                  initialValue: values?.[FIELDS.innConsignee] || '',
                })(
                  <Ant.AutoComplete
                    disabled={disabled}
                    dataSource={dataSourceInnConsignee}
                    onSearch={(e) => handleSearch(e, getInnCompanyName, setInnConsignee)}
                    placeholder="Введите ИНН"
                  />,
                )}
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      ) : null}

      <VzForm.Actions>
        {mode === 'view' ? (
          <>
            <Ant.Button onClick={onDelete}>Удалить</Ant.Button>
            <Ant.Button onClick={onEdit} type="primary" className={'semi-wide margin-left-16'} htmlType="submit">
              Редактировать
            </Ant.Button>
          </>
        ) : (
          <>
            <Ant.Button onClick={handleCancel} className={'semi-wide margin-left-16'} theme={'primary'}>
              Отмена
            </Ant.Button>
            <Ant.Button type="primary" onClick={handleSave} className={'semi-wide margin-left-16'}>
              Сохранить
            </Ant.Button>
          </>
        )}
      </VzForm.Actions>
    </Ant.Form>
  );
};

CargoForm.propTypes = {
  values: PropTypes.object,
  onSave: PropTypes.func,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  mode: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  selectedValue: PropTypes.object,
  CalendarMixinWrapper: PropTypes.object,
};

CargoForm.contextTypes = {
  InputNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  cargoPlaceTypes: PropTypes.object,
  reverseCargoTypes: PropTypes.object,
  cargoPlaceStatuses: PropTypes.object,
};

export default Ant.Form.create({ name: 'cargo_form' })(CargoForm);
