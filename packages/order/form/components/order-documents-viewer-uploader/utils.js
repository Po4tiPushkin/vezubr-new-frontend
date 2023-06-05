import _pullAll from 'lodash/pullAll';

export function getGroupDocuments(documents, groups) {

  let remainingDocuments = [...documents];

  const groupDocuments = new Map();

  for (const [key, group] of groups) {

    const { title } = group;
    let currentDocuments = remainingDocuments;

    if (group?.filter) {
      currentDocuments = currentDocuments.filter(group.filter)
      _pullAll(remainingDocuments, currentDocuments);
    }

    groupDocuments.put(key, {
      title,
      documents: currentDocuments
    })
  }

  return groupDocuments;
}



export const getGroupKey = (group) => (`${group.article}`)

