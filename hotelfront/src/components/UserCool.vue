<template>
  <div class="air-conditioner-service">
    <!-- 放在整个页面的顶部 -->
    <el-alert v-if="showAlert" title="开启成功" type="success" center show-icon class="floating-alert" />
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
            <span class="led-digit temperature">{{ currentTemperature }}</span>
            <span class="led-digit temperature">°C</span>
          </div>
          <div class="led-row">
            <el-text>预期温度: </el-text>
            <span class="led-digit temperature">{{ targetTemperature }}</span>
            <span class="led-digit temperature">°C</span>
          </div>
          <div class="led-row" style="margin-top: 40px;">
            <el-text style="margin-left: 10px;">风速</el-text>
            <span class="subtext fan-speed" style="margin-right: 200px">{{ fanSpeed }}</span>
            <el-text tag="b">空调{{ power ? '开启' : '关闭' }}</el-text>
          </div>
        </div>

        <!-- 下半部分：调节按钮 -->
        <div class="control-buttons">
          <el-switch v-model="power" inline-prompt active-text="ON" inactive-text="OFF" />
          <el-button @click="increaseTemperature" :disabled="power">+</el-button>
          <el-button @click="decreaseTemperature" :disabled="power">-</el-button>
          <el-button @click="adjustFanSpeed" :disabled="power">调节风速</el-button>
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
    const power = ref(false) 
    const showAlert = ref(false) 
    // TODO: 登录时后端返回temperture
    const currentTemperature = ref(25) 
    const targetTemperature = ref(20) 
    const fanSpeed = ref(1) 

    
    const ws = new WebSocket('ws://localhost:29010/api/customer/cool/turnOn')

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.code == 200) {
        showAlert.value = true 
      } else {
        console.error(message.message)

      }
    }

    // 发送开启空调请求
    const turnOnAC = () => {
      const message = {
        targetTemperature: targetTemperature.value,
        status: power.value ? fanSpeed.value : 0 // 若开启则返回风速大小，否则返回 0
      }
      ws.send(JSON.stringify(message))
    }

    const increaseTemperature = () => {
      targetTemperature.value++
    }

    const decreaseTemperature = () => {
      targetTemperature.value--
    }

    const adjustFanSpeed = () => {
      // 切换风速在 1、2、3 之间循环
      fanSpeed.value = fanSpeed.value < 3 ? fanSpeed.value + 1 : 1
    }

    return { power, showAlert, currentTemperature, targetTemperature, fanSpeed, turnOnAC, increaseTemperature, decreaseTemperature, adjustFanSpeed }
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
  margin-top: 9%;
  margin-left: 35%;
  width: 30%;
}
</style>
