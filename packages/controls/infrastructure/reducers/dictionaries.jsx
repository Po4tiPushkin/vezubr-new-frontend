import defaultStore from './defaultStore';

const dictionariesReducer = (state = defaultStore.dictionaries, action) => {
  switch (action.type) {
    case 'SET_DICTIONARIES':
      return action.dictionaries;
    default:
      return state;
  }
};

export default dictionariesReducer;
