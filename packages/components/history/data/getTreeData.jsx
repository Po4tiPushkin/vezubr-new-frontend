export default function getTreeData(data, prefix) {
  const returnData = [];

  for (let keyInput = 0; keyInput < data.length; keyInput++) {
    const key = prefix + '-' + keyInput;

    const item = {
      ...data[keyInput],
      key,
    };

    const items = item['items'];
    delete item['items'];

    if (items) {
      item.children = getTreeData(items, key);
    }

    returnData.push(item);
  }

  return returnData;
}
