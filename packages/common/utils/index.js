export * from './dictionary';
export * from './uuid';
export * from './tree';
export * from './file';
export * from './md5';
export * from './date';
export * from './string';
export * from './number'

export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}
