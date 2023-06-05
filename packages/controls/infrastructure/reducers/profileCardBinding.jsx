import defaultStore from './defaultStore';

const profileCardBindingReducer = (state = defaultStore.profileCardBinding, action) => {
  switch (action.type) {
    case 'PROFILE_CARD_BINDING_LIST_SET_LOADING': {
      const listLoading = action.payload;
      return { ...state, listLoading };
    }
    case 'PROFILE_CARD_BINDING_INITIAL_URL_LOADING': {
      const initialUrlLoading = action.payload;
      return { ...state, initialUrlLoading };
    }
    case 'PROFILE_CARD_BINDING_UPDATE_LOADING': {
      const updateLoading = action.payload;
      return { ...state, updateLoading };
    }
    case 'PROFILE_CARD_BINDING_FINISH': {
      const finishCard = action.payload;
      return { ...state, finishCard };
    }
    case 'PROFILE_CARD_BINDING_SET_PRIMARY': {
      const cardId = action.payload;
      const cardsById = { ...state.cardsById };

      for (const id of Object.keys(cardsById)) {
        const currCard = cardsById[id];
        if (id !== cardId && currCard.isPrimary) {
          cardsById[id] = {
            ...cardsById[id],
            isPrimary: false,
          };
        }
      }

      cardsById[cardId] = {
        ...cardsById[cardId],
        isPrimary: true,
      };

      return { ...state, cardsById };
    }
    case 'PROFILE_CARD_BINDING_REMOVE': {
      const cardId = action.payload;

      const cardsById = { ...state.cardsById };
      delete cardsById[cardId];

      const cardsOrder = state.cardsOrder.filter((id) => id !== cardId);

      return { ...state, cardsById, cardsOrder };
    }
    case 'PROFILE_CARD_BINDING_SET_CARDS': {
      const cards = action.payload.data;

      const cardsById = {};
      const cardsOrder = [];

      for (const card of cards) {
        cardsById[card.id] = card;
        cardsOrder.push(card.id);
      }

      return { ...state, cardsById, cardsOrder };
    }
    default:
      return state;
  }
};

export default profileCardBindingReducer;
