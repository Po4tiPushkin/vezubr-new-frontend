import { get } from 'lodash';
import ReactDOMServer from 'react-dom/server';

export default function csvRenderCols(data, columns) {
  const divCleaner = document.createElement('div');
  return data.map((record, index) => {
    const renderItem = {};
    for (const column of columns) {
      const { dataIndex, render, renderToExport, key } = column;

      if (renderToExport === false || key === "actions") {
        continue;
      }

      let text;
      if (typeof dataIndex === 'number') {
        text = get(record, dataIndex);
      } else if (!dataIndex || dataIndex.length === 0) {
        text = record;
      } else {
        text = get(record, dataIndex);
      }

      const renderFunc = renderToExport || render;

      let renderedText = text

      if (renderFunc) {
        renderedText = renderFunc(text, record, index);
      }

      try {
        divCleaner.innerHTML = ReactDOMServer.renderToStaticMarkup(renderedText)
      } catch (e) {
        if (!Array.isArray(text) && typeof text === 'object') {
          continue;
        }
        divCleaner.innerHTML = ReactDOMServer.renderToStaticMarkup(text)
      }

      renderItem[column.title] = divCleaner.innerText;
    }

    return renderItem;
  });
}
