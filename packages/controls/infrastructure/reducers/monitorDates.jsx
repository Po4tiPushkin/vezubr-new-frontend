import defaultStore from './defaultStore';

const monitorDatesReducer = (state = defaultStore.monitorDates, action) => {
  switch (action.type) {
    case 'SET_MONITOR_DATES_STATE':
      return action.payload;
    default:
      return state;
  }
};

export default monitorDatesReducer;
