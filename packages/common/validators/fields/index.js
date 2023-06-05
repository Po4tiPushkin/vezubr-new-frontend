export function validateEmail(email, isRequired) {
  if (isRequired && !email) {
    return 'Электронная почта обязательна для заполнения';
  }

  if (email && !/^[^а-яА-Я]+@.+\..+/.test(email)) {
    return 'Некорректный адрес электронной почты';
  }

  return null;
}

export function validateEmpty(field) {
  const message = 'Поле обязательно для заполнения';

  if (Array.isArray(field) && !field.length) {
    return message;
  }

  if (typeof field === 'string' && !field.trim()) {
    return message;
  }

  if (!field) {
    return message;
  }

  return null;
}
