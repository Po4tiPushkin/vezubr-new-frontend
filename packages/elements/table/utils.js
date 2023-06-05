export function columnsReduceWidth(cols) {
  function _reduceWidth(cols) {
    return cols.reduce((a, v) => a + (v?.width || (v?.children && _reduceWidth(v.children)) || 0), 0);
  }

  return _reduceWidth(cols);
}

export function columnsDeleteLastWidth(cols) {
  function _deleteLastWidth(colsInput) {
    const cols = [...colsInput];

    let lastIndex = cols.length;
    let last = null;

    do {
      --lastIndex;
      last = cols[lastIndex];
    } while (last && !!last?.fixed && lastIndex > 0);

    cols[lastIndex] = {
      ...last,
      ...(last?.children
        ? {
            children: _deleteLastWidth(last.children),
          }
        : {}),
    };

    delete cols[lastIndex]['width'];

    return cols;
  }

  return _deleteLastWidth(cols);
}
