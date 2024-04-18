
import { createStore } from 'vuex';

export default createStore({
  state: {
    userId: ''
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
  },
  actions: {
    updateUserId({ commit }, userId) {
      commit('setUserId', userId);
    },
  },
});
