import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      token: '', // 初始化状态
      roomId: '',
      userId: ''
    };
  },
  mutations: {
    setToken(state, newToken) {
      state.token = newToken; 
    },
    setRoomId(state, newRoomId) {
      state.roomId = newRoomId; 
    },
    setUserId(state, newUserId) {
      state.userId = newUserId; 
    }
  },
  actions: {
    updateToken({ commit }, newToken) {
      commit('setToken', newToken); 
    },
    updateRoomId({ commit }, newRoomId) {
      commit('setRoomId', newRoomId); 
    },
    updateUserId({ commit }, newUserId) {
      commit('setUserId', newUserId); 
    }
  },
  getters: {
    getToken(state) {
      return state.token;
    },
    getRoomId(state) {
      return state.roomId;
    },
    getUserId(state) {
      return state.userId;
    },
    
  }
});
