export const validateDriverCreateFormValues = (values, extraData = {}) => {
  const validatedValues = { ...values };
  if (validatedValues.dlRusResident) {
    validatedValues.driverLicenseDateOfBirth = validatedValues.dateOfBirth;
    validatedValues.driverLicenseName = validatedValues.name;
    validatedValues.driverLicenseSurname = validatedValues.surname;
    validatedValues.driverLicensePatronymic = validatedValues.patronymic
  }
  validatedValues.producer = extraData?.producer ? String(extraData.producer.id) : null;
  return validatedValues;
}