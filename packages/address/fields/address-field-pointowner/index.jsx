import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import { useDebouncedCallback } from 'use-debounce/lib';
import { Organization as DDService, GeoCoding as GeoCodingService } from '@vezubr/services';

export default function AddressFieldPointOwner(props) {
  const { form, values, disabled, fields, rules, span } = props;
  const { getFieldError, getFieldDecorator, setFieldsValue, getFieldValue } = form;

  const [innSuggestions, setInnSuggestions] = useState([]);

  const getInnSuggestions = async (value) => {
    if (value == '') return [];
    try {
      return (await DDService.getOrganization(value)) || [];
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        showError(e);
        setLoadingData(false);
      }
    }
    return [];
  };

  const [handleSearch] = useDebouncedCallback(async (value) => {
    if (!value) {
      return;
    }

    const suggestions = await getInnSuggestions(value);
    setInnSuggestions(suggestions);
  }, 200);

  const dataSourceInnSuggestions = useMemo(
    () =>
      innSuggestions.map((data) => {
        return (
          <Ant.AutoComplete.Option kpp={data?.kpp} key={data?.inn + data?.kpp} value={data?.inn}>
            {`${data?.shortName}${data?.inn && '/' + data?.inn}`}
          </Ant.AutoComplete.Option>
        );
      }),
    [innSuggestions],
  );

  const onSelectInn = useCallback((value, { props: { kpp } }) => {
    if (kpp) {
      setFieldsValue({ [fields.pointOwnerKpp]: kpp });
    }
  }, []);

  const fetchInn = React.useCallback(async (inn) => {
    const suggestions = await getInnSuggestions(inn || '');
    setInnSuggestions(suggestions);
  }, []);

  useEffect(() => {
    if (values) {
      if (typeof values[fields.pointOwnerInn] == 'string') {
        fetchInn(getFieldValue(fields.pointOwnerInn));
      }
    }
  }, [fetchInn, values]);

  const onChange = (value) => {
    fetchInn(value);
  };

  return (
    <VzForm.Col span={span}>
      <VzForm.Item disabled={disabled} label={'Отправитель/Получатель'} error={getFieldError(fields.pointOwnerInn)}>
        {getFieldDecorator(fields.pointOwnerInn, {
          rules: rules[fields.pointOwnerInn](),
          initialValue: values[fields.pointOwnerInn],
        })(
          <Ant.AutoComplete
            disabled={disabled}
            onSearch={handleSearch}
            onSelect={onSelectInn}
            onChange={onChange}
            placeholder={disabled ? '' : "Введите ИНН"}
            allowClear={true}
          >
            {dataSourceInnSuggestions}
          </Ant.AutoComplete>,
        )}
      </VzForm.Item>
      {getFieldDecorator(fields.pointOwnerKpp, {
        initialValue: values[fields.pointOwnerKpp],
      })(<Ant.Input type={'hidden'} />)}
    </VzForm.Col>
  );
}
