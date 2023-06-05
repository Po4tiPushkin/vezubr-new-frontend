import PropTypes from 'prop-types';
import { GeoCoding as GooglePlaceService } from '../index';

export const typePlace = PropTypes.oneOf([
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
  let params = {};

  switch (type) {
    case 'address':
      endPoint = 'addressAutocomplete';
      params = {
        q: searchString,
      };
      break;
    default:
      throw new Error(`Has no type: ${type} for dadata`);
  }

  const suggestions = (await GooglePlaceService[endPoint](params)) || [];

  if (type === 'address') {
    return suggestions
      .map((data) => {
        const { value } = data
        const text = value
        return {
          value,
          text,
          data,
        };
      });
  }

  return [];
}
