import _max from 'lodash/max';
import _min from 'lodash/min';
import moment from 'moment';

const REQUIRED_NOT_REQUIRED_FIELDS = [
  'volume',
  'palletsCapacity',
  'platformHeight',
  'platformLength',
  'carCount',
  'compartmentCount'
]

export const validateTrailerCreateFormValues = (values, extraData = {}) => {
  const validatedValues = { ...values, ...extraData };
  if (validatedValues.bodyType === 2) {
    const oldMin = validatedValues.temperatureMin
    validatedValues["temperatureMin"] = _min([
      parseInt(validatedValues.temperatureMin),
      parseInt(validatedValues.temperatureMax)
    ])
    validatedValues["temperatureMax"] = _max([
      parseInt(oldMin),
      parseInt(validatedValues.temperatureMax)
    ])
  }
  if (validatedValues?.liftingCapacityMin) {
    validatedValues.liftingCapacityMin = String(parseFloat(validatedValues.liftingCapacityMin) * 1000);
  }
  if (validatedValues?.liftingCapacityMax) {
    validatedValues.liftingCapacityMax = String(parseFloat(validatedValues.liftingCapacityMax) * 1000);
  }

  if (validatedValues?.liftingCapacityInKg) {
    validatedValues.liftingCapacityInKg = parseFloat(validatedValues.liftingCapacityInKg) * 1000
  }

  if (validatedValues?.heightFromGroundInCm) {
    validatedValues.heightFromGroundInCm = parseFloat(validatedValues.heightFromGroundInCm) * 100
  }

  if (!validatedValues.bodyHeightInCm || !validatedValues.bodyLengthInCm || !validatedValues.bodyWidthInCm) {
    delete validatedValues.bodyHeightInCm;
    delete validatedValues.bodyLengthInCm;
    delete validatedValues.bodyWidthInCm;
  }
  else {
    validatedValues.bodyHeightInCm = parseFloat(validatedValues.bodyHeightInCm) * 100
    validatedValues.bodyLengthInCm = parseFloat(validatedValues.bodyLengthInCm) * 100
    validatedValues.bodyWidthInCm = parseFloat(validatedValues.bodyWidthInCm) * 100
  }
  validatedValues.isRearLoadingAvailable = true;

  if (validatedValues.category !== 8) {
    delete validatedValues.isCarTransporterCovered;
  }

  if (validatedValues.platformHeight) {
    validatedValues.platformHeight = validatedValues.platformHeight * 100
  }

  if (validatedValues.platformLength) {
    validatedValues.platformLength = validatedValues.platformLength * 100
  }

  REQUIRED_NOT_REQUIRED_FIELDS.forEach(el => {
    if (!validatedValues[el] && validatedValues[el] !== 0) {
      delete validatedValues[el];
    }
  })

  return validatedValues;
}

export const reformatTrailerEditFormValues = (values, dictionaries) => {
  const formattedValues = { ...values };
  if (formattedValues?.liftingCapacityMin) {
    formattedValues.liftingCapacityMin = parseInt(formattedValues.liftingCapacityMin) / 1000;
  }

  if (formattedValues?.liftingCapacityMax) {
    formattedValues.liftingCapacityMax = parseInt(formattedValues.liftingCapacityMax) / 1000;
  }

  if (formattedValues.liftingCapacityInKg) {
    formattedValues.liftingCapacityInKg = parseInt(formattedValues.liftingCapacityInKg) / 1000;
  }

  if (formattedValues.bodyHeightInCm) {
    formattedValues.bodyHeightInCm = parseInt(formattedValues.bodyHeightInCm) / 100;
  }

  if (formattedValues.bodyLengthInCm) {
    formattedValues.bodyLengthInCm = parseInt(formattedValues.bodyLengthInCm) / 100;
  }

  if (formattedValues.bodyWidthInCm) {
    formattedValues.bodyWidthInCm = parseInt(formattedValues.bodyWidthInCm) / 100;
  }

  if (formattedValues?.geozonePasses) {
    formattedValues.geozonePasses = formattedValues.geozonePasses.map(el => {
      return {
        expiresOnDate: el.expiresOnDate,
        geozoneId: String(el.id),
        selected: true,
        title: dictionaries?.geozones?.[el.id]
      }
    })
  }

  if (formattedValues.heightFromGroundInCm) {
    formattedValues.heightFromGroundInCm = parseInt(formattedValues.heightFromGroundInCm) / 100;
  }

  if (formattedValues.photoFiles?.[0]) {
    formattedValues.photoRightSide = formattedValues.photoFiles[0]
  }

  if (formattedValues.photoFiles?.[1]) {
    formattedValues.photoLeftSide = formattedValues.photoFiles[1]
  }

  if (formattedValues.registrationCertificateFrontSideFile && formattedValues.registrationCertificateFrontSideFile?.files) {
    formattedValues.registrationCertificateFrontSideFile = formattedValues.registrationCertificateFrontSideFile.files.find(el => el.actual);
  }

  if (formattedValues.registrationCertificateReverseSideFile && formattedValues.registrationCertificateReverseSideFile?.files) {
    formattedValues.registrationCertificateReverseSideFile = formattedValues.registrationCertificateReverseSideFile.files.find(el => el.actual);
  }

  if (formattedValues.topLoadingAvailable) {
    formattedValues.isTopLoadingAvailable = formattedValues.topLoadingAvailable;
  }

  if (formattedValues.sideLoadingAvailable) {
    formattedValues.isSideLoadingAvailable = formattedValues.sideLoadingAvailable;
  }


  if (formattedValues.platformHeight) {
    formattedValues.platformHeight = formattedValues.platformHeight / 100
  }

  if (formattedValues.platformLength) {
    formattedValues.platformLength = formattedValues.platformLength / 100
  }

  return formattedValues
}