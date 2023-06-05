import compose from '@vezubr/common/hoc/compose';
import loadGooglePlace, { typePlace } from '@vezubr/services/loader/loadGooglePlace';
import { VzForm } from '@vezubr/elements';
import React from 'react'

function TariffCityElement(props) {

  return (
    <VzForm.FieldAutocompleteSuggestions {...props} />
  )
}

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
])(TariffCityElement);