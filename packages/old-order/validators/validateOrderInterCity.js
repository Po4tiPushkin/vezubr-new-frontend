import validateOrderBase from './validateOrderBase';
import moment from 'moment';
import _uniq from 'lodash/uniq';
import _difference from 'lodash/difference';
import { getContourProducerFromHash } from '../utils';

export default (regular) => ({
  ...validateOrderBase(regular),

  useClientRate: (useClientRate, data) => {
    const {
      selectingStrategy,
      calculation: { hash: calculationsHash },
      requiredContours,
      requiredProducers,
    } = data;

    if (selectingStrategy !== 1) {
      return null;
    }

    const errorMessage = 'Ставка обязательна: выбранные контуры или подрядчики не имеют расчета';

    if (!useClientRate) {
      if (!calculationsHash) {
        return errorMessage;
      }

      const producersHasCost = _uniq(
        Object.keys(calculationsHash.producers).map((hash) => getContourProducerFromHash(hash).producerId),
      );
      const contoursHasCost = Object.keys(calculationsHash.contours).map((contourIdString) => ~~contourIdString);

      if (
        _difference(requiredContours, contoursHasCost).length !== 0 ||
        _difference(requiredProducers, producersHasCost).length !== 0
      ) {
        return errorMessage;
      }
    }

    return null;
  },

});
