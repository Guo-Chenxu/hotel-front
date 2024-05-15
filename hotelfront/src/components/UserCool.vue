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
              <!-- 第一排：风速 -->
              <div class="led-row">
                <el-icon :size="20" color="blue">
                  <Cloudy />
                </el-icon>
                <el-text style="margin-left: 5px; margin-bottom: 3px;">风速:</el-text>
                <div class="fan-speed-icons">
                  <template v-for="index in fanSpeedIcons">
                    <el-icon style="font-size: 30px; color: blue; margin-right: 10px;">
                      <WindPower />
                    </el-icon>

                  </template>
                </div>
              </div>

              <!-- 分隔线 -->


              <!-- 第二排：温度 -->
              <div class="led-row" style="display: flex; justify-content: space-between;">
                <div class="temperature-left" style="display: flex; align-items: center;">
                  <el-icon :size="20" color="red">
                    <Odometer />
                  </el-icon>
                  <el-text style="margin-left: 5px; margin-bottom: 3px;">当前温度:</el-text>
                  <div style="margin-left: 5px;">
                    <span class="current-temperature" style="color: red; font-size: 50px;">{{ currentTemperature
                      }}</span>
                    <span class="unit" style="color: red; font-size: 50px;">°C</span>
                  </div>
                </div>




                <div class="temperature-right" style="display: flex; flex-direction: column;">
                  <div class="led-row">
                    <el-text style="margin-bottom: 5px;margin-left:-50px">预期温度:</el-text>
                  </div>


                  <div class="led-row" style="display: flex; align-items: center;margin-left:20px">
                    <div v-if="this.status == 0">
                      <el-input-number v-model="targetTemperature" size="large" style="font-size: 40px;">
                      </el-input-number>
                    </div>
                    <div v-if="this.status != 0">
                      <el-input-number v-model="targetTemperatureValue" size="large" style="font-size: 40px;"
                        @change="changeAC"></el-input-number>
                    </div>
                    <span class="unit" style="color: lightblue; font-size: 40px;">°C</span>
                  </div>
                </div>

              </div>
              <!-- 第三排：空调状态 -->
              <div class="led-row">
                <div>
                  <el-icon :size="20" style="margin-right: 5px; margin-bottom: 5px;">
                    <Monitor />
                  </el-icon>
                  <el-text>空调状态: {{ statusText }}</el-text>
                </div>
              </div>
              <div class="led-row" style="margin-top:20px">
                <div>
                  <el-icon :size="20" style="margin-right: 5px;">
                    <Odometer />
                  </el-icon>
                  <el-text>空调每分钟变化温度: {{ changeTmp }}</el-text>
                </div>
              </div>
            </div>

            <!-- 下半部分：调节按钮 -->
            <div class="control-buttons-wrapper" style="display: flex; justify-content: center; margin-top: 20px;">
              <div class="control-buttons">
                <el-button :type="this.status == 0 ? 'success' : 'danger'" @click="turn" style="margin-right:50px">{{
                  this.status ==
                    0 ? '开启' :
                    '关闭'
                }}
                </el-button>
                <div v-if="this.status == 0">
                  <el-button @click="adjustFanSpeedOff">调节风速</el-button>
                </div>
                <div v-if="this.status != 0">
                  <el-button @click="adjustFanSpeed">调节风速</el-button>
                </div>
              </div>
            </div>

          </el-card>
          <el-card class="price-card" shadow="always">
            <template #header>
              <div class="card-header">
                <span>价格信息</span>
              </div>
            </template>

            <el-table :data="priceData" style="width: 100%; font-size: 18px; font-weight: bold; color: #333;">
              <el-table-column label="项目">
                <template v-slot="scope">
                  <div>
                    <el-icon :size="20">
                      <Money />
                    </el-icon>
                    {{ scope.row.name }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="value" label="金额"></el-table-column>
            </el-table>



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
import { WindPower, Odometer, Cloudy, Monitor } from '@element-plus/icons';
const baseURL = `${api.baseURL}/cool`;
let reconnectTimer = null;
let isConnected = false;
export default {
  components: {
    WindPower,
    Odometer,
    Cloudy,
    Monitor
  },
  data() {
    return {
      activeTab: 'tab1',
      changeTmp: '',
      currentTemperature: '',
      targetTemperature: null,
      fanSpeedOff: '',
      targetTemperatureValue: 25,
      currentPrice: '',
      totalPrice: '',
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
    priceData() {
      return [
        { name: '空调价格', value: this.price },
        { name: '当前费用', value: this.currentPrice },
        { name: '累计费用', value: this.totalPrice }
      ];
    },

    fanSpeedIcons() {
      const icons = [];
      const fanSpeed = this.status == 0 ? parseInt(this.fanSpeedOff) : parseInt(this.fanSpeed);
      for (let i = 0; i < fanSpeed; i++) {
        icons.push(i);
      }
      return icons;
    },

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
      };
      newWs.onmessage = (event) => {
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
      this.currentPrice = parseFloat(data.currentPrice).toFixed(3) != null ? parseFloat(data.currentPrice).toFixed(3) : '';
      this.totalPrice = parseFloat(data.totalPrice).toFixed(3) != null ? parseFloat(data.totalPrice).toFixed(3) : '';
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
        case 5:
          this.fanSpeed = 0;
          this.statusText = "回温";
          break;
        default:
          this.fanSpeed = 0;
          this.statusText = "关机";
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
      } else if (this.status == 1 || this.status == 2 || this.status == 3 || this.status == 4 || this.status == 5) {
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
      console.log("this.fanSpeedOff" + this.fanSpeedOff)
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

}


.control-panel {
  width: calc(65% - 20px);
  /* 左侧宽度为50%，减去间隔 */
  padding: 20px;
  border-radius: 10px;
  margin-top: 50px;
  margin-left: 10px;
  /* 左侧面板的左边距 */
  float: left;
  /* 左浮动，使得右侧价格卡片在其旁边 */
  height: 400px;
}

.status-display {
  margin-top: 20px;
}

/* Adjust layout of temperature rows */
.led-row {
  display: flex;
  align-items: center;
}

.led-row el-text {
  margin-right: 0;
}


.temperature-left,
.temperature-right {
  display: flex;
  align-items: center;
}

.temperature-right {
  text-align: right;
}


/* 控制左右两侧卡片排列 */
.control-panel,
.price-card {
  margin-right: 20px;
  /* 间隔 */
  font-size: 18px;
  /* Adjust the font size as needed */
}

.control-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

/* 价格卡片样式 */
.price-card {
  width: calc(35% - 20px);
  /* 右侧宽度为50%，减去间隔 */
  border-radius: 10px;
  margin-top: 50px;
  margin-right: 10px;
  /* 右侧价格卡片的右边距 */
  float: right;
  /* 右浮动，使得价格卡片在右侧 */
}

/* 价格内容样式 */
.price-content {
  padding: 20px;
  font-size: 18px;
  /* Adjust the font size as needed */
}

.content {
  display: flex;
  justify-content: space-between;
  /* 左右对齐 */
}

.temperature-wrapper {
  display: flex;
  align-items: center;
}

.temperature-label {
  margin-right: 10px;
  font-weight: bold;
}

.temperature {
  font-size: 20px;
  /* 加大字体 */
  color: red;
  /* 红色字体 */
}

.unit {
  margin-left: 5px;
  font-size: 16px;
  color: #666;
}

.temperature-input {
  width: 100px;
}

/* Align text to the left */
.el-text,
.led-row,
.control-buttons {
  text-align: left;
}

.fan-speed {
  display: flex;
  align-items: center;
}


/* Style for fan speed icons */
.fan-speed-icons {
  display: flex;
  align-items: center;
}

.fan-speed-icons el-icon {
  margin-right: 5px;
  /* Adjust the margin between icons as needed */
}

.control-panel span,
.control-panel el-text,
.control-panel el-icon {
  font-size: 18px;
  /* Adjust the font size as needed */
  font-weight: bold;
  /* Make the font bold */
  color: #575252;
  /* Change the font color */
}

/* Adjust the font size and style for elements in the price card */
.price-card span,
.price-card el-text,
.price-card el-icon {
  font-size: 18px;
  /* Adjust the font size as needed */
  font-weight: bold;
  /* Make the font bold */
  color: #333;
  /* Change the font color */
}

/* Adjust the font size and style for temperature labels and values */
.temperature-left el-text,
.temperature-left .current-temperature,
.temperature-left .unit,
.temperature-right el-text,
.temperature-right .current-temperature,
.temperature-right .unit {
  font-size: 24px;
  /* Adjust the font size as needed */
  font-weight: bold;
  /* Make the font bold */
  color: red;
  /* Change the font color */
}

/* Adjust the font size and style for buttons in the control panel */
.control-buttons el-button {
  font-size: 18px;
  /* Adjust the font size as needed */
  font-weight: bold;
  /* Make the font bold */
  color: white;
  /* Change the font color */
}
</style>
