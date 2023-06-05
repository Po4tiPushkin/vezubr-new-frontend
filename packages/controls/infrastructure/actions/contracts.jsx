const setDocumets = (payload) => {
  return (dispatch) => {
    dispatch({ type: 'CONTRACTS_SET_DOCUMENTS', payload });
  };
};

const updateDoc = (doc, type) => {
  return (dispatch) => {
    const payload = {
      doc,
      type,
    };
    dispatch({ type: 'CONTRACTS_UPDATE_DOC', payload });
  };
};

const setLoadingDocs = (payload) => {
  return async (dispatch) => {
    return dispatch({ type: 'CONTRACTS_SET_LOADING_DOCS', payload });
  };
};

const setLoadingDoc = (payload) => {
  return async (dispatch) => {
    return dispatch({ type: 'CONTRACTS_SET_LOADING_DOC', payload });
  };
};

export { setDocumets, updateDoc, setLoadingDocs, setLoadingDoc };
