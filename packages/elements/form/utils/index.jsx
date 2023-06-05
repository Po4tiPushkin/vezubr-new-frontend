import React from 'react';

export function isHasError(error) {
  return Array.isArray(error) ? error.length > 0 : !!error;
}

export function createAsyncValidator(validator) {
  return (...params) => {
    return [
      {
        validator: (rule, value, callback) => {
          try {
            const error = validator.apply(null, [value, ...params]);
            if (error) {
              return callback(error);
            }
            callback();
          } catch (e) {
            callback(e);
          }
        },
      },
    ];
  };
}

export function createAsyncRules(validators) {
  const rules = {};

  for (const fieldName of Object.keys(validators)) {
    rules[fieldName] = createAsyncValidator(validators[fieldName]);
  }

  return new Proxy(rules, {
    get: (target, name) => {
      if (!target[name]) {
        return () => undefined;
      }
      return target[name];
    },

    set: (obj, prop, value) => {
      throw new Error('rules only fo read');
    },
  });
}

export function validateFieldsFromAntForm(form, ...otherParams) {
  return new Promise((resolve) => {
    try {
      const params = [...otherParams, (errors, values) => resolve({ errors, values })];
      form.validateFields.apply(null, params);
    } catch (errors) {
      resolve({ errors });
    }
  });
}

export const handleApiFormErrors = (e, form) => {
  if (Array.isArray(e?.errors)) {
    const fields = form.getFieldsValue();
    const objValues = {};
    e?.errors.forEach(el => {
      if (el.invalid_value) {
        Object.keys(el.invalid_value).map(item => {
          objValues[item] = { value: fields[item] , errors: [new Error(el.message)] }
        })
      }
      if (el.propertyName) {
        objValues[el.propertyName] = { value: fields[el.propertyName], errors: [new Error(el.message)] }
      }
      return null
    })
    form.setFields({
      ...objValues
    })
  }
}
