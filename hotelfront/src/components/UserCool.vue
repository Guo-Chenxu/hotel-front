<template>
  <div class="air-conditioner-service">
    <div class="content">
      <el-card class="control-panel" shadow="always">
        <template #header>
          <div class="card-header">
            <span>空调控制面板</span>
          </div>
        </template>
        <!-- 上半部分：温度、风速、空调状态 -->
        <div class="status-display">
          <div class="led-row">
            <el-text>当前温度: </el-text>
            <span>{{ this.currentTemperature }}</span>
            <span>°C</span>
          </div>
          <div class="led-row">
            <el-text>预期温度: </el-text>
            <el-input v-model="this.targetTemperature" style="width: 60px;" />
            <span>°C</span>
          </div>
          <div class="led-row">
            <el-text tag="b">空调状态: {{ this.statusText }}</el-text>
          </div>
          <div class="led-row">
            <el-text style="margin-left: 10px;">风速:{{ this.fanSpeed }}</el-text>
          </div>

        </div>
        <!-- 下半部分：调节按钮 -->
        <div class="control-buttons">
          <el-button @click="turn">开/关</el-button>
          <el-button @click="fresh">刷新</el-button>
          <el-button @click="adjustFanSpeed">调节风速</el-button>
        </div>

      </el-card>

    </div>
  </div>
</template>


<script>
import axios from 'axios';
const baseURL = 'http://10.29.23.17:29010/api/customer/cool';
const wsURL = `ws://10.29.23.17:29010/api/customer/cool/watchAC/${store.getters.getUserId}`
import store from '../store';
export default {
  data() {
    return {
      currentTemperature: '',
      targetTemperature: 25,
      status: '',
      fanSpeed: 1,
      statusText:'',
    }
  },
  mounted() {
    
    this.setupWebSocket(); // 设置WebSocket监听数据变化
  },
  created() {
    // 监听数据变化
    this.$watch(() => [this.currentTemperature], () => {
      console.log("watching");
      this.fetchData(); // 数据变化时重新获取数据
    }, { deep: true });
  },
  methods: {
    fresh(){
      this.fetchData(); // 页面加载时请求数据
    },
    setupWebSocket() {
      const ws = new WebSocket(wsURL);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        console.log('Received message:', event.data); // 打印消息到控制台
        const data = JSON.parse(event.data);
        this.currentTemperature = data;

      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
      };
    },
    fetchData() {
      axios({
        method: 'get',
        url: `${baseURL}/acStatus`,
        headers: {
          Authorization: store.getters.getToken
        },
      }).then(response => {
        if (response.data.code === 200) {
          console.log(response.data.data)
          var data = response.data.data;
          if (data.status == 0) {
            this.fanSpeed = 0;
            this.statusText = "关闭";
          } else if (data.status == 1) {
            this.fanSpeed = 1;
            this.statusText = "低速";
          } else if (data.status == 2) {
            this.fanSpeed = 2;
            this.statusText = "中速";
          } else if (data.status == 3) {
            this.fanSpeed = 3;
            this.statusText = "高速";
          } else if (data.status == 4) {
            this.fanSpeed = 0;
            this.statusText = "等待";
          }
          this.status = data.status;
          console.log("this.fanSpeed: " + this.fanSpeed);
          console.log("this.status: " + this.status);
          this.currentTemperature = data.temperature.toFixed(2); 
          this.targetTemperature = data.targetTemp.toFixed(2); 

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
      // console.log(this.targetTemperature)
      var data = JSON.stringify({
        "targetTemperature": this.targetTemperature,
        "status": this.fanSpeed
      });
      axios({
        method: 'post',
        url: `${baseURL}/change`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: store.getters.getToken
        },
        data: data
      }).then(response => {
        if (response.data.code === 200) {
          console.log(response.data.message)
          this.fetchData();
        } else {
          console.error(response.data.message);
        }
      }).catch(error => {
        console.error("请求失败：", error.message || "未知错误");
      });
    },
    adjustFanSpeed() {
      let fanSpeed = parseInt(this.fanSpeed);
      fanSpeed = (fanSpeed < 3) ? fanSpeed + 1 : 1;
      this.fanSpeed = fanSpeed.toString();
      
    },
    turn() {
      if (this.status == 0  )  {
        this.turnOnAC();
      } else if(this.status == 1 || this.status == 2 || this.status == 3 || this.status == 4){
        this.turnOffAC();
      }
    },
    turnOnAC() {
      console.log("处理打开空调操作")
      var data = JSON.stringify({
        "targetTemperature": this.targetTemperature,
        "status": this.fanSpeed
      });
      axios({
        method: 'post',
        url: `${baseURL}/turnOn`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: store.getters.getToken
        },
        data: data
      }).then(response => {
        if (response.data.code === 200) {
          console.log(response.data.message);
          this.fetchData();
        } else {

          console.error(response.data.message);
          this.power = !this.power;
        }
      }).catch(error => {
        console.error("请求失败：", error.message || "未知错误");
      });
    },
    turnOffAC() {
      console.log("处理关闭空调操作")
      console.log("关闭");
      axios({
        method: 'post',
        url: `${baseURL}/turnOff`,
        headers: {
          Authorization: store.getters.getToken
        },
      }).then(response => {
        if (response.data.code === 200) {

          console.log(response.data.message);
          this.fetchData();
        } else {

          console.error(response.data.message);
        }
      }).catch(error => {

        console.error('HTTP 请求失败：', error.message || '未知错误');
      });
    }
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

.status-display {
  margin-top: 20px;
}

.led-row {
  display: flex;
  align-items: center;
  margin-left: 30%;
  margin-bottom: 10px;
}

.control-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>