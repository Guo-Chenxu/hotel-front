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
          <el-switch v-model="power" inline-prompt active-text="ON" inactive-text="OFF" @change="handleSwitchChange" />
          <el-button @click="increaseTemperature" :disabled="!power">+</el-button>
          <el-button @click="decreaseTemperature" :disabled="!power">-</el-button>
          <el-button @click="adjustFanSpeed" :disabled="!power">调节风速</el-button>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>

import { ref, onMounted } from 'vue'
import axios from 'axios';


export default {
  name: 'UserCool',
  setup() {
    const power = ref(null)
    const showSuccessAlert = ref(false)
    const showErrorAlert = ref(false)
    const showConnectErrorAlert = ref(false)
    const currentTemperature = ref(null)
    const targetTemperature = ref(null)
    const fanSpeed = ref(null)
    const price = ref(null)

    const baseURL = 'http://localhost:29010/api/customer/cool/';

    const handleSwitchChange = () => {
      if (power.value) {
        turnOnAC()
      } else {
        turnOffAC()
      }
    }

    const turnOnAC = () => {
      axios.post(`${baseURL}turnOn`, {
        targetTemperature: targetTemperature.value,
        status: fanSpeed.value
      })
        .then(response => {
          if (response.data.code === 200) {
            showSuccessAlert.value = true;
          } else {
            showErrorAlert.value = true;
            console.error(response.data.message);
            power.value = !power.value; // 恢复原来的状态
          }
        })
        .catch(error => {
          showConnectErrorAlert.value = true;
          console.error('HTTP 请求失败：', error.message || '未知错误');
          power.value = !power.value; // 恢复原来的状态
        });
    };

    const turnOffAC = () => {
      axios.post(`${baseURL}turnOff`, {})
        .then(response => {
          if (response.data.code === 200) {
            showSuccessAlert.value = true;
          } else {
            showErrorAlert.value = true;
            console.error(response.data.message);
          }
        })
        .catch(error => {
          showConnectErrorAlert.value = true;
          console.error('HTTP 请求失败：', error.message || '未知错误');
        });
    };

    const changeAC = () => {
      axios.post(`${baseURL}change`, {
        targetTemperature: targetTemperature.value,
        status: fanSpeed.value
      })
        .then(response => {
          if (response.data.code === 200) {
            showSuccessAlert.value = true;
          } else {
            showErrorAlert.value = true;
            console.error(response.data.message);
            targetTemperature.value = currentTemperature.value;
            fanSpeed.value = fanSpeed.value;
          }
        })
        .catch(error => {
          showConnectErrorAlert.value = true;
          console.error('HTTP 请求失败：', error.message || '未知错误');
          targetTemperature.value = currentTemperature.value;
          fanSpeed.value = fanSpeed.value;
        });
    };

    // 获取空调状态函数
    const getACStatus = () => {
      axios.get(`${baseURL}status`)
        .then(response => {
          if (response.data.code === 200) {
            const data = response.data.data;
            if (data) {
              power.value = data.status != null ? (data.status == 1) : power.value;
              currentTemperature.value = data.temperature != null ? data.temperature : currentTemperature.value;
              targetTemperature.value = data.targetTemp != null ? data.targetTemp : targetTemperature.value;
              fanSpeed.value = data.status != null ? data.status : fanSpeed.value;
              price.value = data.price != null ? data.price : price.value;
            }
          } else {
            showErrorAlert.value = true;
            console.error(response.data.message);
          }
        })
        .catch(error => {
          showConnectErrorAlert.value = true;
          console.error('HTTP 请求失败：', error.message || '未知错误');
        });
    };

    
    onMounted(() => {
      getACStatus();
    });

    /**
     * @description: 用户调整目标温度/风速
     * @return {*}
     */
    const increaseTemperature = () => {
      changeAC()
      targetTemperature.value++

    }

    const decreaseTemperature = () => {
      changeAC()
      targetTemperature.value--
    }

    const adjustFanSpeed = () => {
      changeAC()
      fanSpeed.value = fanSpeed.value < 3 ? fanSpeed.value + 1 : 1

    }

    return {
      power,
      showSuccessAlert,
      showErrorAlert,
      showConnectErrorAlert,
      currentTemperature,
      targetTemperature,
      fanSpeed,
      price,
      handleSwitchChange,
      increaseTemperature,
      decreaseTemperature,
      adjustFanSpeed,
      getACStatus
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
