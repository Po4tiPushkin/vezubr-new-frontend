import React from 'react';
import PropTypes from 'prop-types';

import { Ant, VzForm, Loader } from '@vezubr/elements';
import t from '@vezubr/common/localization';

import * as Address from '@vezubr/address';
import * as Order from '@vezubr/order/form';
import moment from 'moment';

const addressValidator = Address.Validators.createValidateAddresses(
  Order.Validators.validateAddressItem,
  (addresses, data) => {
    let field = null;

    if (!addresses.length) {
      field = t.error('provideAddress');
    } else if (addresses.length < 2) {
      field = 'Минимум две точки адреса должно быть';
    }

    return field;
  },
);
const dataValidator = (date, required) => {
  if (required && !date) {
    return 'Выберите дату';
  }

  if (date && date.isBefore(moment(), 'date')) {
    return 'Дата не должна быть меньше текущего дня';
  }
};

const FIELDS = {
  title: 'title',
  producerId: 'producerId',
  dateStart: 'dateStart',
  dateEnd: 'dateEnd',
  rate: 'rate',
  ordersPlanned: 'ordersPlanned',
  addresses: 'addresses',
};

const validators = {
  [FIELDS.title]: (title) => (!title || !title.trim()) && 'Название ставки обязательно',
  [FIELDS.addresses]: addressValidator,
  [FIELDS.producerId]: (producerId) => !producerId && 'Выберите подрядчика',
  [FIELDS.dateStart]: (dateStart) => dataValidator(dateStart, true),
  [FIELDS.rate]: (rate) => !rate && 'Введите ставку',
  [FIELDS.ordersPlanned]: (ordersPlanned) => !ordersPlanned && 'Введите кол-во запланированных рейсов по ставке',
  [FIELDS.dateEnd]: (dateEnd, data) =>
    dataValidator(dateEnd, true) ||
    (dateEnd.isSameOrBefore(data[FIELDS.dateStart], 'date') && 'Дата окончания должна быть больше даты начала'),
};

const disabledLoadingTypes = [];

function RateForm(props) {
  const {
    values = {},
    onSave,
    disabled,
    deleting,
    onDelete,
    saving,
    canceling,
    loading,
    onCancel,
    form,
    producers,
    loadingTypes,
  } = props;

  const { getFieldError, getFieldDecorator, setFieldsValue, getFieldValue, validateFields, getFieldsValue } = form;

  const rules = VzForm.useCreateAsyncRules(validators);

  const disabledDate = React.useCallback((date) => {
    return date.isBefore(moment(), 'date');
  }, []);

  const addressesError = getFieldError(FIELDS.addresses);
  const { field: addressesErrorField, items: addressesErrorItems } = addressesError ? JSON.parse(addressesError) : {};

  const onlyOneProducerId = (producers || []).length === 1 && producers[0].id;

  const producerOptions = React.useMemo(() => {
    return (producers || []).map((producer) => {
      const value = producer.id;
      const key = value;
      const title = producer?.companyName || producer?.inn || 'Неизвестный подрядчик';
      return (
        <Ant.Select.Option key={key} value={value}>
          {title}
        </Ant.Select.Option>
      );
    });
  }, [producers]);

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form);
      }
    },
    [onSave],
  );

  return (
    <Ant.Form className="rate-form" layout="vertical" onSubmit={handleSubmit}>
      <VzForm.Group title={'Общая информация'}>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Название ставки'} error={getFieldError(FIELDS.title)}>
              {getFieldDecorator(FIELDS.title, {
                rules: rules[FIELDS.title]('d'),
                initialValue: values?.[FIELDS.title],
              })(<Ant.Input placeholder={'Название ставки'} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={'Подрядчик'} error={getFieldError(FIELDS.producerId)}>
              {getFieldDecorator(FIELDS.producerId, {
                rules: rules[FIELDS.producerId](),
                initialValue: values?.[FIELDS.producerId] || onlyOneProducerId,
              })(
                <Ant.Select
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                  disabled={disabled}
                  searchPlaceholder={'Выберите подрядчика'}
                >
                  {producerOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group title={'Время действия'}>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Время начала действия ставки'} error={getFieldError(FIELDS.dateStart)}>
              {getFieldDecorator(FIELDS.dateStart, {
                rules: rules[FIELDS.dateStart](),
                initialValue: values?.[FIELDS.dateStart],
              })(
                <Ant.DatePicker
                  placeholder={'дд.мм.гггг'}
                  disabledDate={disabledDate}
                  disabled={disabled}
                  allowClear={true}
                  format={['DD.MM.YYYY', 'YYYY.MMM.DD']}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={'Время окончания действия ставки'} error={getFieldError(FIELDS.dateEnd)}>
              {getFieldDecorator(FIELDS.dateEnd, {
                rules: rules[FIELDS.dateEnd](getFieldsValue()),
                initialValue: values?.[FIELDS.dateEnd],
              })(
                <Ant.DatePicker
                  placeholder={'дд.мм.гггг'}
                  disabledDate={disabledDate}
                  disabled={disabled}
                  allowClear={true}
                  format={['DD.MM.YYYY', 'YYYY.MMM.DD']}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group title={'Информация о ставке'}>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Стоимость, руб.'} error={getFieldError(FIELDS.rate)}>
              {getFieldDecorator(FIELDS.rate, {
                rules: rules[FIELDS.rate](),
                initialValue: values?.[FIELDS.rate],
              })(
                <Ant.InputNumber
                  placeholder={'Введите стоимость'}
                  disabled={disabled}
                  decimalSeparator={','}
                  min={0}
                  allowClear={true}
                  step={500}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={'Кол-во запланированных рейсов по ставке'} error={getFieldError(FIELDS.ordersPlanned)}>
              {getFieldDecorator(FIELDS.ordersPlanned, {
                rules: rules[FIELDS.ordersPlanned](),
                initialValue: values?.[FIELDS.ordersPlanned],
              })(
                <Ant.InputNumber
                  placeholder={'Введите количество'}
                  allowClear={true}
                  disabled={disabled}
                  min={1}
                  step={1}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group title={'Адреса'}>
        {getFieldDecorator(FIELDS.addresses, {
          rules: rules[FIELDS.addresses]({ disabledLoadingTypes }),
          initialValue: values?.[FIELDS.addresses] || [],
        })(<Ant.Input type={'hidden'} />)}

        <Order.FormFieldAddresses
          onChange={(addresses) => {
            setFieldsValue({ [FIELDS.addresses]: addresses });
            validateFields([FIELDS.addresses]);
          }}
          disabled={disabled}
          error={addressesErrorField}
          errors={addressesErrorItems}
          addresses={getFieldValue(FIELDS.addresses) || []}
          validatorAddressItem={Order.Validators.validateAddressItem}
          loadingTypes={loadingTypes}
          disabledLoadingTypes={disabledLoadingTypes}
          useMap={true}
          useFavorite={true}
        />
      </VzForm.Group>

      <VzForm.Actions className={'rate-form__actions'}>
        {onCancel && (
          <Ant.Button type={'ghost'} onClick={onCancel} loading={canceling}>
            {t.order('cancel')}
          </Ant.Button>
        )}

        {onDelete && (
          <Ant.Button type={'ghost'} onClick={onDelete} loading={deleting}>
            Удалить
          </Ant.Button>
        )}

        {onSave && (
          <Ant.Button htmlType="submit" type={'primary'} loading={saving}>
            Сохранить
          </Ant.Button>
        )}
      </VzForm.Actions>

      {(loading || saving || canceling || deleting) && <Loader />}
    </Ant.Form>
  );
}

RateForm.propTypes = {
  values: PropTypes.object,
  producers: PropTypes.arrayOf(PropTypes.object),
  onSave: PropTypes.func,
  disabled: PropTypes.bool,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  saving: PropTypes.bool,
  deleting: PropTypes.bool,
  canceling: PropTypes.bool,
  loading: PropTypes.bool,
  form: PropTypes.object,
  loadingTypes: PropTypes.object.isRequired,
};

export default Ant.Form.create({ name: 'rate_form' })(RateForm);
