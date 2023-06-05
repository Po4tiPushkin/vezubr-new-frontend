import React from 'react';
import _get from 'lodash/get';
import _isObject from 'lodash/isObject';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import { InputField } from '@vezubr/components';
import { DROPDOWNTIME, STATUS_COLORS } from '@vezubr/common/constants/constants';
import moment from 'moment';
import Utils from '@vezubr/common/common/utils';
import * as Order from '@vezubr/order/form';

const badStatuses = [1, 6, 8];

const TableRow = (props) => {
  const { index, value, keys, dictionaries, navigate, onDropDownChange, type, arrIdCartulary, handleChange } = props;
  const getKeyFromDict = (el) => {
    if (Array.isArray(dictionaries[el.key])) {
      const val = dictionaries[el.key].find((v) => v.id === value[el.name]);
      if (val) {
        return val[el.prop];
      }
      return null;
    } else {
      const val = dictionaries[el.key];
      if (val) {
        if (el.withoutProp) {
          return val[Number(value[el.name])];
        }
        if (val[value[el.name]]) {
          return val[value[el.name]][el.prop];
        }
      }
    }

    return null;
  };

  const colorizeRow = (row) => {
    if (row.uiStatus && badStatuses.some((status) => status === row.uiStatus)) return STATUS_COLORS[row.uiStatus];
    if (row.uiState && badStatuses.some((status) => status === row.uiState)) return STATUS_COLORS[row.uiState];
    if (row.orderUiState && badStatuses.some((status) => status === row.orderUiState))
      return STATUS_COLORS[row.orderUiState];
    if (row.problem) return 'red';
    if (type === 'producer' && row.uiState === 4) {
      return 'red';
    }
    return null;
  };

  const addClasses = (row) => {
    let classes = '';
    if (
      ((type === 'transports' || type === 'producerLoader') && (row.uiStatus === 8 || row.uiStatus === 7)) ||
      (type === 'producer' && row.uiState === 4)
    ) {
      classes += ' inactive';
    }
    if (
      row.problem ||
      (row.uiStatus && badStatuses.some((status) => status === row.uiStatus)) ||
      (row.uiState && badStatuses.some((status) => status === row.uiState))
    ) {
      classes += ' row-shadow';
    }
    return classes;
  };
  const element = keys.map((el, index) => {
    const className = el.className ? el.className : value.problem ? 'bg-white' : 'bg-grey_1';
    let td;
    if (Object.keys(dictionaries).length) {
      switch (el.type) {
        case 'date':
          td = (
            <td key={index} className={className}>
              <p className={'line-clamp-1 no-margin'}>
                {_get(value, el.name)
                  ? moment(_get(value, el.name)).format(
                      el.format && el.format.length
                        ? el.format
                        : `DD.MM.YYYY ${
                            el.name.includes('toStartAtDate') || el.name.includes('to_start_at') ? 'HH:mm' : ''
                          }`,
                    )
                  : '-'}
              </p>
            </td>
          );
          break;
        case 'icon':
          td = (
            <td key={index} className={className}>
              {Order.Icons.renderBitmapIconTruck(_get(value, el.name), value.problem)}
            </td>
          );
          break;
        case 'fromDictionaries':
          td = (
            <td key={index} className={className}>
              <p className={'line-clamp-1 no-margin'}>{getKeyFromDict(el)}</p>
            </td>
          );
          break;
        case 'money':
          td = (
            <td key={index} className={className}>
              <p className={'line-clamp-1 no-margin'}>
                {_get(value, el.name) ? _get(value, el.name) / 100 + ' ' + el.value : ' - '}
              </p>
            </td>
          );
          break;
        case 'sum':
          td = (
            <td key={index} className={className}>
              <p className={'line-clamp-1 no-margin'}>{Utils.moneyFormat(_get(value, el.name))}</p>
            </td>
          );
          break;
        case 'percentage':
          const x = _get(value, el.fullPercent) || 0;
          const y = _get(value, el.name) || 0;
          const z = x === 0 || y === 0 ? 0 : (y * 100) / x;
          td = (
            <td key={index} className={className}>
              <p className={'line-clamp-1 no-margin'}>{z}</p>
            </td>
          );
          break;
        case 'weight':
          td = (
            <td key={index} className={className}>
              <p className={'line-clamp-1 no-margin'}>{parseInt(_get(value, el.name)) / 1000 + 'т'}</p>
            </td>
          );
          break;
        case 'dropdownTime':
          td = (
            <td key={index}>
              <InputField
                className={'white-background'}
                dropDown={{
                  onChange: (e) => onDropDownChange(e, el.name, value),
                  data: DROPDOWNTIME,
                }}
                withBorder={true}
                placeholder={t.settings('to')}
                size={'small'}
                name={'smsSendingTimeTo'}
                type={'text'}
                value={_get(value, el.name) == -1 ? t.settings('notNotify') : DROPDOWNTIME[_get(value, el.name)]}
              />
            </td>
          );
          break;
        case 'nameSurname':
          td = (
            <td key={index} className={className}>
              <p className={'line-clamp-1 no-margin'}>{_get(value, el.name) + ' ' + _get(value, el.secondName)}</p>
            </td>
          );
          break;
        case 'paymentState':
          td = (
            <td key={index} className={className}>
              <p className={'line-clamp-1 no-margin'}>{t.registries('paymentState_' + _get(value, el.name))}</p>
            </td>
          );
          break;
        case 'checkbox':
          const id = _get(value, el.name);
          td = (
            <td key={index} className={className}>
              <div className={'cartulary_add'}>
                <input
                  type="checkbox"
                  checked={arrIdCartulary?.indexOf(id) != -1 ? true : false}
                  className={'cartulary_checkbox'}
                  onChange={() => handleChange(id)}
                />
                {type !== 'operatorNotificationOrders' && <p>{id}</p>}
              </div>
            </td>
          );
          break;
        default:
          const val = Array.isArray(el.name)
            ? el.name.reduce((acc, v) => {
                acc += `${_get(value, v) || ''} `;
                return acc;
              }, '')
            : _get(value, el.name);
          td = (
            <td key={index} className={className}>
              {index === 0 ? <span className={'row-color ' + colorizeRow(value)} /> : null}
              {_isObject(val) ? '' : val}
            </td>
          );
      }
    } else if (el.name === 'isOnline') {
      const val = _get(value, el.name) ? t.common('yes') : t.common('no');
      td = (
        <td key={index} className={className}>
          {index === 0 ? <span className={'row-color ' + colorizeRow(value)} /> : null}
          {val}
        </td>
      );
    } else {
      const val = Array.isArray(el.name)
        ? el.name.reduce((acc, v) => {
            acc += `${_get(value, v) || ''} `;
            return acc;
          }, '')
        : _get(value, el.name);
      td = (
        <td key={index} className={className}>
          {index === 0 ? <span className={'row-color ' + colorizeRow(value)} /> : null}
          {_isObject(val) ? '' : val}
        </td>
      );
    }

    return td;
  });
  return (
    <tr className={'text-center pointer ' + addClasses(value)} onClick={() => navigate(value.order_id)}>
      {element}
    </tr>
  );
};
TableRow.propTypes = {
  dictionaries: PropTypes.object,
  index: PropTypes.number.isRequired,
  value: PropTypes.object.isRequired,
  keys: PropTypes.array.isRequired,
};
export default TableRow;
