import React from 'react';
import loadDaData, { typeDaData } from '@vezubr/services/loader/loadDaData';
import { Ant, VzForm } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import AddressFieldAutocomplete, { AddressFieldAutocompleteProps } from '../address-field-autocomplete';

export default compose([
  VzForm.withSuggestions((outProps) => {
    const { type, ...props } = outProps;
    return {
      loader: async (search) => {
        return loadDaData(search, type);
      },
      props,
    };
  }),
])(AddressFieldAutocomplete);
