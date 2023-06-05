import React from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
import { DEFAULT_LOADING_TYPE } from '../../../constants';

const FIELDS = {
  loadingType: 'loadingType',
};

function LoadingType(props) {
  const { form, address, disabledLoadingTypes, loadingTypes = [], rules, ...otherProps } = props;
  const { getFieldError, getFieldDecorator, getFieldsValue } = form;

  const options = React.useMemo(
    () =>
      loadingTypes.map(({ id, title }) => {
        const disabled = !!disabledLoadingTypes.find(el => el === id);
        return (
          <Ant.Select.Option key={id} value={id} disabled={disabled}>
            {title}
          </Ant.Select.Option>
        );
      }),
    [disabledLoadingTypes, loadingTypes],
  );

  return (
    <VzForm.Item
      label={
        <Ant.Tooltip placement="right" title={"Доступны для выбора только те варианты, которые подходят всем выбранным Вами Типам ТС"}>
          <div className={`order-form__hint`}>
            Тип погрузки / разгрузки {<Ant.Icon type={'info-circle'} />}
          </div>
        </Ant.Tooltip>
      }
      error={getFieldError(FIELDS.loadingType)}
    >
      {getFieldDecorator(FIELDS.loadingType, {
        initialValue: address?.[FIELDS.loadingType] || DEFAULT_LOADING_TYPE,
      })(
        <Ant.Select allowClear={true} placeholder={'Выбрать из списка'} {...otherProps}>
          {options}
        </Ant.Select>,
      )}
    </VzForm.Item>
  );
}

LoadingType.propTypes = {
  form: PropTypes.object.isRequired,
  address: PropTypes.object,
  loadingTypes: PropTypes.object,
  disabledLoadingTypes: PropTypes.arrayOf(PropTypes.number),
};

export default LoadingType;
