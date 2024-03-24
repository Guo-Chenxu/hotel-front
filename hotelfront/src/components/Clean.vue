<template>
    <div class="clean">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span></span>
            </div>
            <el-button
                v-if="!cleaningInProgress"
                type="primary"
                @click="requestCleaning"
                :loading="cleaningRequesting"
                plain
                size="large"
                class="custom-button"
            >
                请求打扫
            </el-button>
            <p v-if="cleaningInProgress">正在打扫...</p>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cleaningRequesting: false,
            cleaningInProgress: false,
            websocket: null
        };
    },
    methods: {
        initWebSocket() {
            this.websocket = new WebSocket('');

            this.websocket.onopen = () => {
                console.log('WebSocket连接成功');
            };

            this.websocket.onmessage = (event) => {
                console.log('收到消息:', event.data);
                if (event.data === 'cleaning_finished') {
                    this.cleaningInProgress = false;
                    this.$message.success('打扫已完成');
                }
            };

            this.websocket.onclose = () => {
                console.log('WebSocket连接已关闭');
            };

            this.websocket.onerror = (error) => {
                console.error('WebSocket出现错误:', error);
            };
        },
        requestCleaning() {
            this.cleaningRequesting = true;
            this.initWebSocket();
            // 模拟请求发送后端
            setTimeout(() => {
                this.websocket.send('request_cleaning');
                this.cleaningInProgress = true;
                this.cleaningRequesting = false;
            }, 1000);
        }
    },
    beforeDestroy() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
};
</script>

<style scoped>
.clean {
    height: 100vh;
    background-image: url('../assets/clean.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.box-card {
    width: 400px;
    margin: 50px auto;
}
.custom-button {
    border: 1px solid #409eff; 
    background: linear-gradient(to right, #409eff, #73bfff);
    color: #fff;
}
</style>
