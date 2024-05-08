<template>
  <div class="user-login">
    <div class="rectangle1-container">
      <div class="rectangle1">
        <h2>@ Bupter</h2>
        <img class="logo" src="../assets/1.png">
      </div>
      <div class="rectangle2">
        <div v-if="!isLoggedIn" class="message-input">
          <h1>欢迎入住！</h1>
          <form @submit.prevent="login" ref="loginForm">
            <div class="label-container">
              <label for="roomId" style="font-size: 25px;">房间号：</label>
              <input type="text" id="username" v-model="roomId" required>
            </div>
            <div class="label-container">
              <label for="username" style="font-size: 25px;">用户名：</label>
              <input type="text" id="roomId" v-model="username" required>
            </div>
            <div class="login-button">
              <button>登录</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import store from '@/store';
import axios from 'axios';
const wsURL = `ws://10.29.23.17:29050/api/customer/cool/watchAC/${localStorage.getItem('userId')}`;
import api from '@/api'; 
const baseURL = `${api.baseURL}/customer/login`;
export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      roomId: '',
      isLoggedIn: false,
      token: null,
      ws: null // WebSocket instance
    }
  },
  methods: {
    login() {
      if (this.username !== '' && this.roomId !== '') {
        axios({
          method: 'post',
          url: `${baseURL}?name=${this.username}&room=${this.roomId}`,
        }).then(response => {
          if (response.data.code == 200) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('roomId', response.data.data.room);
            localStorage.setItem('userId', response.data.data.customerId);
            this.$router.push('/home');
            
            // 监控空调
            axios({
              method: 'get',
              url: `${api.baseURL}/cool/watchAC`,
              headers: {
                Authorization: localStorage.getItem('token')
              },
            }).then(response => {
              if (response.data.code === 200) {
                console.log("watchAC success")
                this.setupWebSocket();
              } else {
                console.error(response.data.message);
              }
            }).catch(error => {
              console.error("请求失败：", error.message || "未知错误");
            });
            // this.initWebSocket();
          } else {
            console.error("error:" + response.data.message);
          }
        }).catch(error => {
          console.error("请求失败：", error.message || "未知错误");
        });
      }
    },
    setupWebSocket() {
      const ws = new WebSocket(wsURL);

      ws.onopen = () => {
        console.log('WebSocket connected');
        // const ws = new WebSocket(wsURL);
        //localStorage.setItem('WebSocket', ws)
      // Store WebSocket instance in Vuex
        store.dispatch('setWebSocket', ws);
      };

      // ws.onmessage = (event) => {
      //   //console.log('Received message:', event.data); // 打印消息到控制台
      //   //const data = JSON.parse(event.data);
      // //   const ws = new WebSocket(wsURL);
      
      // // // Store WebSocket instance in Vuex
      // // this.$store.dispatch('setWebSocket', ws);
        
        
      //   // this.currentTemperature = data.toFixed(2);

      // };

    },
  },
}
</script>

<style scoped>
.user-login {
  background-image: url('../assets/hotel1.png');
  background-color: #ffffffab;
  background-size: cover;
  background-position-x: center;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  color: #ffffff;
  overflow: hidden;
  height: 98vh;
}

.rectangle1-container {
  display: flex;
  justify-content: space-between;
  margin: 10.4% auto 10.4%;
  height: 55.5vh;
  width: 50%;
  align-items: center;
  background-color: #e5e1ea77;
}

.rectangle1 {
  margin: 10.4% auto 10.4%;
  height: 54vh;
  width: 45vh;
  align-items: center;
  background-color: rgb(255, 255, 255);
  margin-left: 0.6vh;
}

.rectangle2 {
  margin: 10.4% auto 10.4%;
  height: 54vh;
  width: 48vh;
  align-items: center;
  background-color: rgba(255, 255, 255);
  margin-right: 0.6vh;
}

.label-container {
  margin-bottom: 20px;
}

button {
  margin-top: 4vh;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-right: 68px;
  padding-left: 68px;
  margin-left: 7px;
  background-color: rgba(192, 177, 228, 0.224);
  color: #030336;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 16.8%;
}

input {
  font-size: 19px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 0.4vh;
  padding-left: 0.4vh;
  background-color: #e4e4f3b3;
  border-color: #bdbdf3;
  margin-right: 3vh;
  margin-bottom: 2vh;
}

label {
  color: #bdbdf3;
}

h1 {
  color: #9481fd;
  margin-top: 8vh;
  margin-bottom: 5vh;
  font-size: 5.2vh;
}

h2 {
  color: #ada2ee;
  text-align: left;
  margin-left: 3vh;
  margin-top: 5vh;
}

.logo {
  width: 84%;
  height: auto;
  margin-top: 5vh;
}
</style>
