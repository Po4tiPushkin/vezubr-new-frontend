import { Profile as ProfileService } from '@vezubr/services';

const loadCards = () => {
  return async (dispatch) => {
    dispatch({ type: 'PROFILE_CARD_BINDING_LIST_SET_LOADING', payload: true });
    const payload = await ProfileService.contractorBindingList();
    dispatch({ type: 'PROFILE_CARD_BINDING_SET_CARDS', payload });
    return dispatch({ type: 'PROFILE_CARD_BINDING_LIST_SET_LOADING', payload: false });
  };
};

const finishCard = (payload) => {
  return async (dispatch) => {
    return dispatch({ type: 'PROFILE_CARD_BINDING_FINISH', payload });
  };
};

const setLoadingInitialUrl = (payload) => {
  return async (dispatch) => {
    return dispatch({ type: 'PROFILE_CARD_BINDING_INITIAL_URL_LOADING', payload });
  };
};

const removeCard = (bindingId) => {
  return async (dispatch) => {
    dispatch({ type: 'PROFILE_CARD_BINDING_UPDATE_LOADING', payload: true });
    try {
      await ProfileService.contractorBindingDelete({ bindingId });
      dispatch({ type: 'PROFILE_CARD_BINDING_REMOVE', payload: bindingId });
      dispatch({ type: 'PROFILE_CARD_BINDING_UPDATE_LOADING', payload: false });
    } catch (e) {
      console.error(e);
    }
  };
};

const setPrimaryCard = (bindingId) => {
  return async (dispatch) => {
    dispatch({ type: 'PROFILE_CARD_BINDING_UPDATE_LOADING', payload: true });
    try {
      await ProfileService.contractorBindingSetPrimaryCard({ bindingId });
      dispatch({ type: 'PROFILE_CARD_BINDING_SET_PRIMARY', payload: bindingId });
      dispatch({ type: 'PROFILE_CARD_BINDING_UPDATE_LOADING', payload: false });
    } catch (e) {
      console.error(e);
    }
  };
};

export { loadCards, setLoadingInitialUrl, setPrimaryCard, removeCard, finishCard };
