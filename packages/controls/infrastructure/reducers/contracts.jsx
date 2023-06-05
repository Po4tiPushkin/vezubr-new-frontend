import defaultStore from './defaultStore';

const contractsReducer = (state = defaultStore.contracts, action) => {
  switch (action.type) {
    case 'CONTRACTS_SET_LOADING_DOCS': {
      const loadingDocs = action.payload;
      return { ...state, loadingDocs };
    }
    case 'CONTRACTS_SET_LOADING_DOC': {
      const loadingDoc = action.payload;
      return { ...state, loadingDoc };
    }
    case 'CONTRACTS_UPDATE_DOC': {
      const { doc, type } = action.payload;

      const isNew = !state.documents[type].filesById[doc.id];

      const documents = {
        ...state.documents,
        [type]: {
          filesById: {
            ...state.documents[type].filesById,
            [doc.id]: doc,
          },
          ...(isNew
            ? {
                filesOrder: [doc.id, ...state.documents[type].filesOrder],
              }
            : {}),
        },
      };

      return { ...state, documents };
    }
    case 'CONTRACTS_SET_DOCUMENTS': {
      const documentsInput = action.payload;
      const documents = {};

      for (const docType of documentsInput) {
        const filesById = {};
        const filesOrder = [];

        const sortedFiles = (docType?.files || []).sort((f1, f2) => {
          if (f1.createdAt > f2.createdAt) {
            return -1;
          } else if (f1.createdAt < f2.createdAt) {
            return 1;
          }
          return 0;
        });

        for (const file of sortedFiles) {
          filesById[file.id] = file;
          filesOrder.push(file.id);
        }

        documents[docType.type] = {
          filesById,
          filesOrder,
        };
      }

      return { ...state, documents };
    }
    default:
      return state;
  }
};

export default contractsReducer;
