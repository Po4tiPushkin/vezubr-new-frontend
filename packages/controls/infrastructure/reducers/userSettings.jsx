import defaultStore from './defaultStore';

const userSettingsReducer = (state = defaultStore.userSettings, action) => {
  switch (action.type) {
    case 'USER_SETTINGS_SET':
      return action.settings;
    case 'USER_SETTINGS_UPDATE':
      return {
        ...state,
        ...action.settings,
      };
    default:
      return state;
  }
};

export default userSettingsReducer;
