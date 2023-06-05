import { uuid } from "./uuid";

export function treeConvertTreeToList({ tree, idName = 'id', parentName = 'parentId'} = {}) {
  function _convert(tree, parrentId) {
    let list = [];

    for (const item of tree) {
      const id = item[idName] || uuid();
      const { children, ...otheProps } = item;
      list.push({
        ...otheProps,
        [idName]: id,
        [parentName]: parrentId,
      })

      if (children) {
        list = list.concat(_convert(children, id));
      }
    }

    return list;
  }
  return _convert(tree, null);
}