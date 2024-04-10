<template>
    <div class="air-conditioner-service">
      <!-- 放在整个页面的顶部 -->
      <el-alert v-if="power" title="开启成功" type="success" center show-icon class="floating-alert" />
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
              <span class="subtext">当前温度: </span>
              <span class="led-digit temperature">{{ currentTemperature }}</span>
              <span class="led-digit temperature">°C</span>
            </div>
            <div class="led-row">
              <span class="subtext">预期温度: </span>
              <span class="led-digit temperature">{{ targetTemperature }}</span>
              <span class="led-digit temperature">°C</span>
            </div>
            <div class="led-row" style="margin-top: 40px;">
              <span class="subtext" style="margin-left: 10px;">风速</span>
              <span class="subtext fan-speed" style="margin-right: 200px">{{ fanSpeed }}</span>
              <span class="subtext power-status">{{ power ? '开启' : '关闭' }}</span>
            </div>
          </div>
  
          <!-- 下半部分：调节按钮 -->
          <div class="control-buttons">
            <el-switch v-model="power" inline-prompt active-text="ON" inactive-text="OFF" />
            <el-button @click="increaseTemperature" :disabled="!power">+</el-button>
            <el-button @click="decreaseTemperature" :disabled="!power">-</el-button>
            <el-button @click="adjustFanSpeed" :disabled="!power">调节风速</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  
  export default {
    name: 'UserCool',
    setup() {
      const power = ref(false) // 定义开关状态
      const showAlert = ref(false) // 定义控制是否显示 alert 的状态
  
      // 10秒后自动关闭 alert
      setTimeout(() => {
        showAlert.value = false
      }, 5000)
  
      return { power, showAlert } // 返回响应式数据
    },
    data() {
      return {
        currentTemperature: 25, // 当前温度
        targetTemperature: 20, // 预期温度
        fanSpeed: '中速', // 风速
        accumulatedCost: 0, // 累计费用
      }
    },
    methods: {
      increaseTemperature() {
        this.targetTemperature++;
      },
      decreaseTemperature() {
        this.targetTemperature--;
      },
      adjustFanSpeed() {
        // 调节风速的逻辑
      }
    }
  }
  </script>
  
  <style scoped>
  .air-conditioner-service {
    height: 100vh;
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
  
  .control-panel{
    width: 40%;
    padding: 20px;
    border-radius: 10px;
    margin-top:60px;
    margin-left: 450px;
    
    margin-top:13%;
    
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
    margin:auto;
    margin-top:9%;
    margin-left:35%;
    width: 30%;
  }
  </style>
  