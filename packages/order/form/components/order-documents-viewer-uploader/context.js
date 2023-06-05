import { createContext } from 'react';

const OrderDocumentViewerUploaderContext = createContext({
  store: null,
  documentCategories: {},
});

export { OrderDocumentViewerUploaderContext };
