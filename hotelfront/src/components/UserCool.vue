<template>
  <div class="air-conditioner-service">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="调节空调" name="tab1">
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
                <span>{{ currentTemperature }}</span>
                <span>°C</span>
              </div>
              <div class="led-row">
                <el-text>预期温度: </el-text>
                <div v-if="this.status == 0">
                  <el-input-number v-model="targetTemperature" controls-position="right" style=" width:100px">
                  </el-input-number>
                </div>
                <div v-if="this.status != 0">
                  <el-input-number v-model="targetTemperatureValue" controls-position="right" style=" width:100px"
                    @change="changeAC">
                  </el-input-number>
                </div>
                <span>°C</span>
              </div>
              <div class="led-row">
                <el-text>空调状态: {{ statusText }}</el-text>
              </div>
              <div v-if="this.status == 0">
                <div class="led-row">
                  <el-text>风速: {{ fanSpeedOff }}</el-text>
                </div>
              </div>
              <div v-if="this.status != 0">
                <div class="led-row">
                  <el-text>风速: {{ fanSpeed }}</el-text>
                </div>
              </div>

              <div class="led-row">
                <el-text>空调每分钟变化温度: {{ changeTmp }}</el-text>
              </div>
              <div class="led-row">
                <el-text>空调价格: {{ price }}</el-text>
              </div>

            </div>
            <!-- 下半部分：调节按钮 -->
            <div class="control-buttons">

              <el-button :type="this.status == 0 ? 'success' : 'danger'" @click="turn">{{ this.status == 0 ? '开启' :
                '关闭' }}</el-button>
              <div v-if="this.status == 0">
                <el-button @click="adjustFanSpeedOff">调节风速</el-button>
              </div>
              <div v-if="this.status != 0">
                <el-button @click="adjustFanSpeed">调节风速</el-button>
              </div>
            </div>
          </el-card>

        </div>
      </el-tab-pane>
      <el-tab-pane label="查看空调参数" name="tab2">
        <el-table :data="tableData" style="width: 100%;margin-left:25%;margin-top:8%">
          <el-table-column prop="parameter" label="参数" width="200"></el-table-column>
          <el-table-column prop="value" label="值" width="200"></el-table-column>
          <el-table-column align="right">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import store from '@/store';
import axios from 'axios';
import api from '@/api';
const baseURL = `${api.baseURL}/cool`;
let reconnectTimer = null;
let isConnected = false;
export default {
  data() {
    return {
      activeTab: 'tab1',
      changeTmp: '',
      currentTemperature: '',
      targetTemperature: null,
      fanSpeedOff: '',
      targetTemperatureValue: 25,
      status: '',
      fanSpeed: 1,
      price: '',
      statusText: '',
      airConditioningProperties: {
        mode: '',
        count: '',
        upperBoundTemperature: '',
        lowerBoundTemperature: '',
        defaultTargetTemp: '',
        defaultStatus: '',
        high: {
          changeTemperature: '',
          price: ""
        },
        middle: {
          changeTemperature: '',
          price: ""
        },
        low: {
          changeTemperature: '',
          price: ""
        }
      },
    }
  },
  mounted() {

    this.setupWebSocket();
  },

  computed: {
    

    tableData() {
      let modeText = this.airConditioningProperties.mode == 0 ? "制冷" : "制热";
      return [
        { parameter: '空调模式', value: modeText },
        { parameter: '空调台数', value: this.airConditioningProperties.count },
        { parameter: '上限温度', value: this.airConditioningProperties.upperBoundTemperature + '℃' },
        { parameter: '下限温度', value: this.airConditioningProperties.lowerBoundTemperature + '℃' },
        { parameter: '默认空调目标温度', value: this.airConditioningProperties.defaultTargetTemp + '℃' },
        {
          parameter: '默认空调档位',
          value: this.getGearName(this.airConditioningProperties.defaultStatus)
        },
        {
          parameter: '高档变化温度',
          value: this.airConditioningProperties.high.changeTemperature + '℃/分钟，价格：' + this.airConditioningProperties.high.price + '元/分钟'
        },
        {
          parameter: '中档变化温度',
          value: this.airConditioningProperties.middle.changeTemperature + '℃/分钟，价格：' + this.airConditioningProperties.middle.price + '元/分钟'
        },
        {
          parameter: '低档变化温度',
          value: this.airConditioningProperties.low.changeTemperature + '℃/分钟，价格：' + this.airConditioningProperties.low.price + '元/分钟'
        }
      ];
    },
    paginatedRoomStatus() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.roomCoolRecords.slice(start, end);
    }
  },
  methods: {
    setupWebSocket() {
      const ws = store.state.websocket;
      this.setupReconnectTimer();
      ws.onmessage = (event) => {
        isConnected = true;
        this.resetReconnectTimer();
        this.handleWebSocketMessage(event);
      }
    },

    resetReconnectTimer() {
      clearTimeout(reconnectTimer);
    },

    setupReconnectTimer() {
      if (!isConnected) {
        reconnectTimer = setTimeout(() => {
          this.reconnectWebSocket();
          console.log("off");
        }, 2000);
      }
    },

    reconnectWebSocket() {
        const newWs = new WebSocket(`${api.wsURL}/${localStorage.getItem('userId')}`);
        this.setupReconnectTimer();
        newWs.onopen = () => {
          store.dispatch('setWebSocket', newWs);
          //this.setupWebSocket();
        };
        newWs.onmessage = (event) => {
          //isConnected = true;
          this.resetReconnectTimer();
          this.handleWebSocketMessage(event);
        };
        
    },

    handleWebSocketMessage(event) {
      const data = JSON.parse(event.data);
      console.log(data)
      this.currentTemperature = data.temperature.toFixed(2);
      this.status = data.status;
      this.changeTmp = data.changeTemp != null ? data.changeTemp : '';
      this.targetTemperatureValue = data.targetTemp != null ? data.targetTemp : '';
      this.price = data.price != null ? data.price : '';
      switch (data.status) {
        case 0:
          this.fanSpeed = 0;
          this.statusText = "关闭";
          break;
        case 1:
          this.fanSpeed = 1;
          this.statusText = "低速";
          break;
        case 2:
          this.fanSpeed = 2;
          this.statusText = "中速";
          break;
        case 3:
          this.fanSpeed = 3;
          this.statusText = "高速";
          break;
        case 4:
          this.fanSpeed = 0;
          this.statusText = "等待";
          break;
        default:
          break;
      }
    },

    handleTabClick() {
      this.showCoolData();
    },
    showCoolData() {
      axios({
        method: 'get',
        url: `${baseURL}/properties`,
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(response => {
        if (response.data.code === 200) {

          this.airConditioningProperties = response.data.data
        } else {
          this.showErrorAlert = true;
          console.error(response.data.message);
        }

      })
        .catch(error => {
          console.error('获取空调属性失败:', error);
        });
    },

    turn() {
      if (this.status == 0) {
        this.targetTemperatureValue = this.targetTemperature
        this.fanSpeed = this.fanSpeedOff
        this.changeAC();
      } else if (this.status == 1 || this.status == 2 || this.status == 3 || this.status == 4) {
        this.turnOffAC();
      }

    },
    turnOffAC() {
      axios({
        method: 'post',
        url: `${baseURL}/turnOff`,
        headers: {

          Authorization: localStorage.getItem('token')
        },
      }).then(response => {
        if (response.data.code === 200) {

          this.$message.success("关闭空调成功")

        } else {
          this.$message.error(response.data.message)
        }
      }).catch(error => {
        console.error('HTTP 请求失败：', error.message || '未知错误');
      });
    },
    adjustFanSpeed() {
      let fanSpeed = parseInt(this.fanSpeed);
      fanSpeed = (fanSpeed < 3) ? fanSpeed + 1 : 1;
      this.fanSpeed = fanSpeed.toString();
      this.changeAC()
    },
    adjustFanSpeedOff() {
      let fanSpeedOff = parseInt(this.fanSpeedOff);
      fanSpeedOff = (fanSpeedOff < 3) ? fanSpeedOff + 1 : 1;
      this.fanSpeedOff = fanSpeedOff.toString();
    },

    changeAC() {

      var data = JSON.stringify({
        "targetTemperature": this.targetTemperatureValue,
        "status": this.fanSpeed
      });
      axios({
        method: 'post',
        url: `${baseURL}/change`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token')
        },
        data: data
      }).then(response => {
        if (response.data.code === 200) {
          this.$message.success("调节空调成功")
        } else {
          this.$message.error(response.data.message);
        }
      }).catch(error => {
        console.error("请求失败：", error.message || "未知错误");
      });
    },
    getGearName(gear) {
      switch (gear) {
        case 1:
          return '低档';
        case 2:
          return '中档';
        case 3:
          return '高档';
        default:
          return '未知';
      }
    },
  }
}
</script>



<style scoped>
.air-conditioner-service {

  margin-left: 60px;
  width: 80%;
  display: flex;
  flex-direction: column;
}


.control-panel {
  width: 50%;
  padding: 20px;
  border-radius: 10px;
  margin-top: 50px;
  margin-left: 250px;
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
