import defaultStore from './defaultStore';

const customPropertiesReducer = (state = defaultStore.customProperties, action) => {
  switch (action.type) {
    case 'SET_CUSTOM_PROPERTIES':
      return action.payload;
    default:
      return state;
  }
}

export default customPropertiesReducer;