import React, { useMemo, useState, useCallback } from 'react';
import { Ant, VzForm, showError } from '@vezubr/elements';
import moment from 'moment';
import { useSelector } from 'react-redux';
const IdentifierPreview = (props) => {
  const { columns = [], inputs = [], requestPreview = '', inModalPreview, onClick, setRequestPreview, disabled } = props;
  const user = useSelector((state) => state.user);

  const getVarValue = useCallback(
    (input) => {
      if (!input) {
        return '';
      }
      switch (input) {
        case 'source':
          return 'VZ';
        case 'client':
          return user?.id;
        case 'order_type':
          return '1';
        case 'y':
          return moment().format('YY');
        case 'm':
          return moment().format('MM');
        case 'request_nr':
          return requestPreview;
        case 'contractor_territory':
          return '00';
        case 'contract_attribute':
          return 'FTL';
        case 'employee_unit':
          return '000';
      }
    },
    [requestPreview],
  );

  const renderValue = useMemo(() => {
    let finalValue = '';

    if (columns && Array.isArray(columns)) {
      columns.forEach((el, index) => {
        if (!el.value || (inputs[index] === undefined && inputs[index] === null)) {
          return;
        }
        switch (el.value) {
          case 'separator':
          case 'string':
            finalValue += inputs[index];
            break;
          case 'var':
            finalValue += getVarValue(inputs[index]);
            break;
          case 'sequence_number':
            if (inputs[index]) {
              for (let i = 1; i < inputs[index]; i++) {
                finalValue += '0';
              }
              finalValue += '1';
            }
            break;
        }
      });
    }
    if (setRequestPreview) {
      setRequestPreview(finalValue);
    }
    return finalValue;
  }, [columns, inputs, requestPreview, setRequestPreview]);
  return (
    <div style={{ margin: '10px 0 20px 0px' }}>
      <VzForm.Item
        error={!columns?.find(el => el.value === 'sequence_number')
          ? 'Порядковый номер является обязательным полем.'
          : false
        }
        label="Предпросмотр"
        disabled={disabled}
      >
        <Ant.Input
          {...{
            readOnly: true,
            value: disabled ? '' : renderValue,
            disabled,
            addonAfter:
              (!inModalPreview ? <Ant.Button size={'small'} disabled={disabled} onClick={onClick}>
                Редактировать
              </Ant.Button> : null),
          }}
        />
      </VzForm.Item>
    </div>
  );
};

export default IdentifierPreview;
