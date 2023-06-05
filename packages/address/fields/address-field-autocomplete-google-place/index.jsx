import React from 'react';
import loadGooglePlace, { typePlace } from '@vezubr/services/loader/loadGooglePlace';
import { Ant, VzForm } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import AddressFieldAutocomplete, { AddressFieldAutocompleteProps } from '../address-field-autocomplete';

export default compose([
  VzForm.withSuggestions((outProps) => {
    const { type, ...props } = outProps;
    return {
      loader: async (search) => {
        return loadGooglePlace(search, type);
      },
      props,
    };
  }),
])(AddressFieldAutocomplete);
