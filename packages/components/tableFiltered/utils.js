import { setLocalStorageItem } from "@vezubr/common/common/utils";

export async function getDBConfig(key) {
  try {
    const raw = await localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}

export function getKey(key) {
  return `config-table-${key}`;
}


export async function setColumnsWidth(key, columns) {
  const config = {...(await getDBConfig(getKey(key)))};
  columns?.map(({key, width}) => {
    if (config.columns && config.columns[key]) {
      config.columns[key].width = width
    }
  })
  setDBConfig(getKey(key), config)
}

export async function setDBConfig(key, obj) {
  const objString = JSON.stringify(obj);

  try {
    setLocalStorageItem(key, objString);
  } catch (e) {
    console.error(e);
  }
}
