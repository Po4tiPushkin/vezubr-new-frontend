import { setLocalStorageItem } from "@vezubr/common/common/utils";

export function getKey(key) {
  return `config-table-${key}`;
}

export function getDBConfig(key) {
  try {
    const raw = localStorage.getItem(getKey(key));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}

export function setDBConfig(key, obj) {
  const objString = JSON.stringify(obj);

  try {
    setLocalStorageItem(getKey(key), objString);
  } catch (e) {
    console.error(e);
  }

}