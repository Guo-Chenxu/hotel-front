<template>
  <div class="user-login">
    <div class="rectangle1-container">
      <div class="rectangle1">
        <h2>@ Buper</h2>
        <img class="logo" src="../assets/1.png">
      </div>
      <div class="rectangle2">
        <div v-if="!isLoggedIn" class="message-input">
          <h1>欢迎入住！</h1>
          <form @submit.prevent="login" ref="loginForm">
            <div class="label-container">
              <label1 for="username" style="font-size: 25px;">房间号：</label1>
              <input type="text" id="username" v-model="username" required>
            </div>
            <div class="label-container">
              <label1 for="roomId" style="font-size: 25px;">用户名：</label1>
              <input type="text" id="roomId" v-model="roomId" required>
            </div>
            <h6 style="color: black">房间号1用户名1(以后删)</h6>
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
export default {
  name: 'UserLogin',
  data() {
    return {
      username: '', // 将userid改为username以匹配后端的参数名
      roomId: '', // 添加roomId字段
      isLoggedIn: false,
      token: null // 添加token字段
    }
  },
  created() {
    localStorage.clear();
  },
  methods: {
    login() {
      if (this.username == '1' && this.roomId == '1') {
        // 设置token为一个随机字符串，模拟登录成功后后端返回的token
        this.token = 'mocked_token';
        // 标记用户为已登录状态
        this.isLoggedIn = true;
        // 将登录状态保存到本地存储中 
        // 只是测试用
        localStorage.setItem('token', true);
        
        this.$router.push('/home'); // 在登录成功后立即跳转
      } else {
        window.alert('账号或密码错误');
      }
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

label1 {
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
