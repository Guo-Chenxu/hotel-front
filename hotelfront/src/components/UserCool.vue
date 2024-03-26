<template>
    <div class="air-conditioner-service">
        <div class="header">
            <h1>空调纳凉服务</h1>
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
                    <el-button @click="togglePower" :type="power ? 'danger' : 'primary'">{{ power ? '关闭' : '开启'
                        }}</el-button>
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
    data() {
        return {
            power: false,
            temperature: 22,
            fanSpeed: 2,
            accumulatedCost: 0
        };
    },
    methods: {
        togglePower() {
            this.power = !this.power;
            if (this.power) {
                // 开启空调时的逻辑
            } else {
                // 关闭空调时的逻辑
            }
        },
        increaseTemperature() {
            if (this.power && this.temperature < 30) this.temperature++;
        },
        decreaseTemperature() {
            if (this.power && this.temperature > 16) this.temperature--;
        },
        adjustFanSpeed() {
            if (this.power && this.fanSpeed < 3) this.fanSpeed++;
        }
    }
};
</script>

<style scoped>
.air-conditioner-service {
    height: 100vh;
    background-image: url('../assets/usercool.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
}


.header {
    margin-right: 700px;
    font-size: 40px;
    margin-top:-20px;
    color:#ffffff;
}

.content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
}

.control-panel,
.fees-panel {
    
    width: 45%;
    padding: 20px;
    border-radius: 10px;
    border-color: #111;
}

.title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color:rgb(28, 26, 14)
}

.status-display {
    
    margin-top: 20px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 250px;

    margin-bottom: 20px;

    background: linear-gradient(to right, #e65fd49e, #deea35b9 );

}

.led-row {
    display: flex;
    align-items: center;
}

.led-digit {
    font-size: 30px;
    font-family: monospace;
    margin-right: 5px;
    background: linear-gradient(to bottom, #e65fd49e, #deea35b9 );
    color: #e22929;
    padding: 5px;
    border-radius: 5px;

}

.temperature {
    font-size: 40px;
    
}

.fan-speed,
.power-status {
    font-size: 14px;
    color: #f8f8f8;
}

.subtext {
    font-size: 16px;
    margin-left: 5px;
    color: #f8f8f8;
}

.control-buttons {
    border-radius: 20px;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    height: 25px;
    color: #7c1b1b;
    background: linear-gradient(to right, #e65fd49e, #deea35b9 );

}

.control-buttons>.el-button {
    margin: 0 5px;
}

.cost-display {
    opacity: 0.8;
    margin-top: 20px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 250px;

    margin-bottom: 20px;

    background: linear-gradient(to left, #e65fd49e, #deea35b9 );

}
</style>