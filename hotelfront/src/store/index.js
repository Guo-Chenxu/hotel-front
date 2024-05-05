import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      token: '', // 初始化状态
      roomId: '',
      userId: '',
      cool: '',
      websocket: null // Store WebSocket instance
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
    },
    setCool(state, newCool) {
      state.cool = newCool; 
    },
    setWebSocket(state, ws) {
      state.websocket = ws; // Store WebSocket instance
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
    },
    updateCool({ commit }, newCool) {
      commit('setCool', newCool); 
    },
    setWebSocket({ commit }, ws) {
      commit('setWebSocket', ws); // Store WebSocket instance in Vuex store
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
    getCool(state) {
      return state.cool;
    },
    getWebSocket(state) {
      return state.websocket; // Get WebSocket instance from Vuex store
    }
  }
});
