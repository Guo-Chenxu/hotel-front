<template>
  <div class="air-conditioner-service">
    <!-- 放在整个页面的顶部 -->
    <el-alert v-if="showSuccessAlert" title="操作成功" type="success" center show-icon class="floating-alert" />
    <el-alert v-if="showErrorAlert" title="操作失败" type="error" center show-icon class="floating-alert" />
    <el-alert v-if="showConnectErrorAlert" title="连接失败" type="error" center show-icon class="floating-alert" />
    <div class="content">
      <el-card class="control-panel" shadow="always">
        <template #header>
          <div class="card-header">
            <span>空调控制面板</span>
          </div>
        </template>
        <!-- 上半部分：温度、风速、空调状态 -->
        <div class="status-display">
          <div class="led-row" style="margin-top: 0px;">
            <el-text>当前温度: </el-text>
            <div :key="updateKey"> <span>{{ currentTemperature }}</span> </div>

            <span>°C</span>
          </div>
          <div class="led-row">
            <el-text>预期温度: </el-text>
            <el-input v-model="this.targetTemperature" style="width: 60px;" />
            <span>°C</span>
          </div>
          <div class="led-row" style="margin-top: 40px;">
            <el-text style="margin-left: 10px;">风速</el-text>
            <span class="subtext fan-speed" style="margin-right: 200px">{{ this.fanSpeed }}</span>
            <el-text tag="b">空调状态:{{ this.power ? '开启' : '关闭' }}</el-text>
          </div>
        </div>

        <!-- 下半部分：调节按钮 -->
        <div class="control-buttons">
          <el-switch v-model="this.power" inline-prompt active-text="ON" inactive-text="OFF"
            @change="handleSwitchChange" />
          <el-button @click="adjustFanSpeed">调节风速</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const baseURL = 'http://10.29.23.17:29010/api/customer/cool/';
import store from '../store';
import { ref } from 'vue';
export default {
  name: 'UserCool',
  methods: {
    initWebSocket() {

      this.ws = new WebSocket(`ws://10.29.23.17:29010/api/customer/cool/watchAC/${store.getters.getUserId}`);
      this.ws.onopen = () => {
        console.log('WebSocket 连接已建立');
      };
      this.ws.onmessage = (event) => {
        const temperature = parseFloat(event.data).toFixed(2);
        this.currentTemperature = temperature;
        this.$set(this, 'currentTemperature', temperature);
        console.log(temperature)
      };
      this.ws.onclose = () => {
        console.log('WebSocket 连接已关闭');
      };
      this.ws.onerror = (error) => {
        console.error('WebSocket 连接发生错误:', error);
      };
    },
    closeWebSocket() {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
    },
    handleSwitchChange() {
      if (this.power !== null) {
        if (this.power) {
          this.turnOnAC();
        } else {
          this.turnOffAC();
        }
      }
    },
    turnOnAC() {
      console.log("token:" + store.getters.getToken);
      var data = JSON.stringify({
        "targetTemperature": this.targetTemperature,
        "status": this.fanSpeed
      });
      axios({
        method: 'post',
        url: `${baseURL}turnOn`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: store.getters.getToken
        },
        data: data
      }).then(response => {
        if (response.data.code === 200) {
          this.showSuccessAlert = true;
          console.log(response.data.message)
        } else {
          this.showErrorAlert = true;
          console.error(response.data.message);
          this.power = !this.power;
        }
      }).catch(error => {
        console.error("请求失败：", error.message || "未知错误");
      });
    },
    turnOffAC() {
      console.log("token:" + store.getters.getToken);
      axios({
        method: 'post',
        url: `${baseURL}turnOff`,
        headers: {

          Authorization: store.getters.getToken
        },
      }).then(response => {
        if (response.data.code === 200) {
          this.showSuccessAlert = true;
          console.log(response.data.message)
        } else {
          this.showErrorAlert = true;
          console.error(response.data.message);
        }
      }).catch(error => {
        this.showConnectErrorAlert = true;
        console.error('HTTP 请求失败：', error.message || '未知错误');
      });
    },
    changeAC() {

      var data = JSON.stringify({
        "targetTemperature": this.targetTemperature,
        "status": this.fanSpeed
      });

      axios({
        method: 'post',
        url: `${baseURL}change`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: store.getters.getToken
        },
        data: data
      }).then(response => {
        if (response.data.code === 200) {
          this.showSuccessAlert = true;
          console.log(response.data.message)
        } else {
          this.showErrorAlert = true;
          console.error(response.data.message);
        }
      }).catch(error => {
        console.error("请求失败：", error.message || "未知错误");
      });
    },
    getACStatus() {
      axios({
        method: 'get',
        url: `${baseURL}acStatus`,
        headers: {
          Authorization: store.getters.getToken
        },
      }).then(response => {
        if (response.data.code === 200) {
          console.log(response.data.data)
          const data = response.data.data;
          if (data) {
            this.power = data.status != 0 ? (true) : false;
            this.currentTemperature = data.temperature.toFixed(2);
            this.targetTemperature = data.targetTemp.toFixed(2);
            this.fanSpeed = data.status;
            this.price = data.price;
          }
        } else {
          this.showErrorAlert = true;
          console.error(response.data.message);
        }
      }).catch(error => {
        this.showConnectErrorAlert = true;
        console.error('HTTP 请求失败：', error.message || '未知错误');
      });
    },
    
    adjustFanSpeed() {
      this.fanSpeed = this.fanSpeed < 3 ? this.fanSpeed + 1 : 1;
      this.changeAC();
    }
  },
  data() {
    return {
      power: false,
      showSuccessAlert: false,
      showErrorAlert: false,
      showConnectErrorAlert: false,
      currentTemperature: ref(''),
      targetTemperature: '24',
      
      fanSpeed: '',
      price: '',
      ws: ''
    }
  },
  mounted() {
    this.getACStatus()
    this.initWebSocket()
  },
  beforeUnmount() {
    this.closeWebSocket()
  }

}
</script>

<style scoped>
.air-conditioner-service {
  height: 100%;
  background-size: cover;
  background-position: center;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.header {
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px;
}

.content {
  display: flex;
  justify-content: space-between;
}

.control-panel {
  width: 40%;
  padding: 20px;
  border-radius: 10px;
  margin-top: 60px;
  margin-left: 450px;
  margin-top: 13%;
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.status-display {
  margin-top: 20px;
}

.led-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.subtext {
  margin-left: 10px;
}

.control-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.cost-display {
  margin-top: 20px;
  font-weight: bold;
}

.floating-alert {
  position: fixed;
  margin: auto;
  margin-top: 8%;
  margin-left: 520px;
  width: 30%;
}
</style>
