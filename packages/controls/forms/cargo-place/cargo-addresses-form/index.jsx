import usePrevious from '@vezubr/common/hooks/usePrevious';
import { Ant, VzForm } from '@vezubr/elements';
import { Contractor as ContractorService, Organization as DDService } from '@vezubr/services';
import _compact from 'lodash/compact';
import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const FIELDS = {
  innShipper: 'innShipper',
  kkpShipper: 'kkpShipper',
  innConsignee: 'innConsignee',
  kkpConsignee: 'kkpConsignee',

  departurePoint: 'departurePoint[id]',
  deliveryPoint: 'deliveryPoint[id]',
  contractorOwner: 'contractorOwner',
};

function getFieldInitialValue(fieldName, values) {
  switch (fieldName) {
    default:
      return values?.[fieldName] || '';
  }
}

export const validators = {
  [FIELDS.departurePoint]: (departurePoint) => !departurePoint && 'Введите адрес отправки',
  [FIELDS.deliveryPoint]: (deliveryPoint) => !deliveryPoint && 'Введите адрес доставки',
};

const CargoAdressesForm = ({
  onSave,
  form,
  values = {},
  onCancel,
  disabled,
  cargoAddresses,
  showClientSelect = APP == 'dispatcher',
  setAddressesForm,
}) => {
  const { getFieldError, getFieldDecorator, setFieldsValue, getFieldValue, getFieldsValue } = form;
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

  React.useEffect(() => {
    setAddressesForm(getFieldsValue());
  }, []);

  const contractorOwnerOptions = useMemo(
    () =>
      clients.map((item) => (
        <Ant.Select.Option key={item.value} value={item.value}>
          {item.label}
        </Ant.Select.Option>
      )),
    [clients],
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

  return (
    <Ant.Form className="cargo-form" layout="vertical" onSubmit={handleSave}>
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
    </Ant.Form>
  );
};

CargoAdressesForm.propTypes = {
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

CargoAdressesForm.contextTypes = {
  InputNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  cargoPlaceTypes: PropTypes.object,
  reverseCargoTypes: PropTypes.object,
  cargoPlaceStatuses: PropTypes.object,
};

export default Ant.Form.create({
  name: 'cargo_form',
  onValuesChange: (props, _, values) => props.setAddressesForm(values),
})(CargoAdressesForm);
