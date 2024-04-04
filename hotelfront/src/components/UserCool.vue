<template>
    <div class="air-conditioner-service">
        <div class="header">
            
        </div>
        <div class="content">
            <!-- 左侧空调控制面板 -->
            <div class="control-panel">
                <div class="title">空调控制面板</div>

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
                    <el-button @click="togglePower" :type="power ? 'danger' : 'primary'">{{ power ? '关闭' : '开启' }}</el-button>
                    <el-button @click="increaseTemperature" :disabled="!power">+</el-button>
                    <el-button @click="decreaseTemperature" :disabled="!power">-</el-button>
                    <el-button @click="adjustFanSpeed" :disabled="!power">调节风速</el-button>
                </div>
            </div>

            <!-- 右侧空调费用面板 -->
            <div class="fees-panel">
                <div class="title">空调费用面板</div>
                <div class="cost-display">
                    <span class="subtext">累计费用: ${{ accumulatedCost.toFixed(2) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'UserCool',
    data() {
        return {
            currentTemperature: 25, // 当前温度
            targetTemperature: 20, // 预期温度
            fanSpeed: '中速', // 风速
            power: true, // 空调开关状态
            accumulatedCost: 0, // 累计费用
        }
    },
    methods: {
        togglePower() {
            this.power = !this.power;
        },
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

.control-panel,
.fees-panel {
    width: 40%;
    padding: 20px;
    border-radius: 10px;
    margin-top: 50px;
    margin-right: 20px;
    margin-left: 40px;
    background-color: #f5f5f5;
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
</style>
