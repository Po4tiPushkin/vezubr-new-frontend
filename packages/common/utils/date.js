import moment from 'moment';

export function dateSecToMs(seconds) {
  return Number(seconds + '000');
}

export function dateCreateMoment(value) {
  if (!value) {
    return null;
  }

  const momentObject = typeof value === 'number' ? moment(dateSecToMs(value)) : moment(value);

  if (!momentObject.isValid()) {
    return null;
  }

  return momentObject;
}

export function createDateTimeZoneZero(value) {
  if (!value) {
    return null;
  }

  const momentObject = typeof value === 'number' ? moment.utc(dateSecToMs(value)) : moment.utc(value);

  if (!momentObject.isValid()) {
    return null;
  }

  return momentObject;
}

export const validateDateForDriver = (date, format, maxDateToday = false, minDateToday = false, required = false) => {
  if (required && !date) {
    return 'Не указана дата';
  } 
  const dateMoment = moment(date, format);
  if (!dateMoment.isValid()) {
    return 'Неверный формат даты'
  }
  if (dateMoment.isBefore('1900-01-01')) {
    return 'Дата не может быть меньше 1900 года'
  }
  if (maxDateToday && dateMoment.isAfter(moment())) {
    return 'Дата не может быть больше сегодняшней'
  }
  if (minDateToday && dateMoment.isBefore(moment())) {
    return 'Дата не может быть меньше сегодняшней'
  }

  return false;
}