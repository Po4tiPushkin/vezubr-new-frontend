import PropTypes from 'prop-types';
import { DaData as DDService } from '../index.client.js';

export const typeDaData = PropTypes.oneOf([
  'inn',
  'email',
  'address',
  'bank',
  'name',
  'surname',
  'patronymic',
  'fio',
  'departmentCode',
  'issueBy',
]);

/**
 *
 * @param searchString
 * @param type  inn, email, address, bank, name, surname, patronymic, fio, departmentCode, issueBy
 * @returns {Promise<{data: *, text, value}[]|{data: *, text: ({roboKassaCreat: string, roboKassaCheck: string}|{roboKassaCreat: string, roboKassaCheck: string}), value}[]|{data: *, text: *, value: *}[]>}
 */

export default async function (searchString, type) {
  let endPoint = null;

  switch (type) {
    case 'inn':
    case 'email':
    case 'address':
    case 'bank':
      endPoint = type;
      break;
    case 'name':
    case 'surname':
    case 'patronymic':
    case 'fio':
      endPoint = 'fio';
      break;
    case 'departmentCode':
    case 'issueBy':
      endPoint = 'fms_unit';
      break;
    default:
      throw new Error(`Has no type: ${type} for dadata`);
  }

  const suggestions = (await DDService[endPoint](searchString)).suggestions;

  if (type === 'email' || type === 'fio' || type === 'patronymic' || type === 'issueBy') {
    return suggestions.filter((s) => s.value).map(({ value, data }) => ({ value, data, text: value }));
  } else if (type === 'address') {
    return suggestions
      .filter((s) => s.value && s?.data?.city && s?.data?.city_fias_id)
      .map(({ value, data }) => ({ value, data, text: value }));
  } else if (type === 'departmentCode') {
    return suggestions
      .filter((s) => s?.data?.code)
      .map(({ data, data: { code: value } }) => ({ value, data, text: value }));
  } else if (type === 'inn') {
    return suggestions
      .filter((s) => s?.data?.inn)
      .map(({ data, data: { inn: value } }) => ({ value, data, text: value }));
  } else if (type === 'bank') {
    return suggestions
      .filter((s) => s?.data?.bic)
      .map(({ data, data: { bic: value } }) => ({ value, data, text: data?.name?.payment || value }));
  } else {
    return suggestions
      .filter((s) => s?.data?.[type])
      .map(({ data, data: { [type]: value } }) => ({ value, data, text: value }));
  }
}
