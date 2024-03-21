<template>
  <img alt="Vue logo" src="../assets/logo.png">
  <div v-if="!isLoggedIn" class="message-input">
    <h1>用户登录</h1>
    <form @submit.prevent="login" ref="loginForm">
      <div class="label-container">
        <label1 for="roomid" style="font-size: 25px;" >房间号：</label1>
        <input type="text" id="roomid" v-model="roomid" required>
      </div>
      <div class="label-container">
        <label1 for="consumername" style="font-size: 25px;">客户名：</label1>
        <input type="text" id="consumername" v-model="consumername" required>
      </div>
      <div class="login-button">
        <button>登录</button>
      </div>
    </form>
  </div>
</template>


<script>

export default {
  name: 'UserLogin',
  data() {
    return {
      roomid: '',
      consumername: '',
      isLoggedIn: false
    }
  },
  methods: {
    login() {
      if (this.roomid === '1' && this.consumername === '1') {
        this.isLoggedIn = true;
      } else {
        window.alert('用户名或房间号错误');
      }
    }
  }
}
</script>

<style>

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background-image: url(''); 
  background-size: 100%;
  font-family: 'Roboto', sans-serif; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff; 
  margin-top: 10%;
  overflow: hidden;
}

.label-container {
  margin-bottom: 20px;
}

button {
  margin-top: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-right: 68px;
  padding-left: 68px;
  margin-left: 7px;
  background-color: rgba(150, 150, 150, 0.224); 
  color: #ffffff; 
  border: none; 
  border-radius: 5px; 
  cursor: pointer; 
  font-size: 16px;
}

input {
    font-size: 19px;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-right: 5px;
    padding-left: 20px;
    background-color: #fbf9f979; 
    border: none;
    margin-right: 7px;
    margin-bottom: 12px;
}

label1 {
    color: #f0f0f4; 
}

h1 {
    color: #f0f0f4; 
}
</style>
