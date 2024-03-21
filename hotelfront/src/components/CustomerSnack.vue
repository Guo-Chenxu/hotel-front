<template>
    <div>
        <h2>餐饮服务</h2>

        <!-- 第一个档位 -->
        <div>
            <img src="../assets/first-level-snack.webp" alt="First Snack Level" style="width: 200px; height: 300px;">
            <button @click="requestFirstLevelFood">第一档位餐饮</button>
        </div>

        <!-- 第二个档位 -->
        <div>
            <img src="../assets/second-level-snack.webp" alt="Second Snack Level" style="width: 200px; height: 300px;">
            <button @click="requestSecondLevelFood">第二档位餐饮</button>
        </div>

        <!-- 第三个档位 -->
        <div>
            <img src="../assets/third-level-snack.webp" alt="Third Snack Level" style="width: 200px; height: 300px;">
            <button @click="requestThirdLevelFood">第三档位餐饮</button>
        </div>

        <div v-if="!requestAccepted">

        </div>

        <div v-else>
            <p v-if="!canceling">餐饮请求已被接受</p>
            <p v-if="canceling">{{ cancelMessage }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CustomerSnack',
    data() {
        return {
            requestAccepted: false,
            websocket: null,
            canceling: false,
            cancelMessage: ''
        };
    },
    mounted() {
        this.connectWebSocket();
    },
    methods: {
        connectWebSocket() {
            this.websocket = new WebSocket("address");

            this.websocket.onopen = () => {
                console.log("WebSocket 连接已开启");
            };

            this.websocket.onmessage = event => {
                const data = JSON.parse(event.data);
                if (data.requestAccepted) {
                    this.requestAccepted = true;
                } else {
                    this.requestAccepted = false;
                }
            };

            this.websocket.onclose = () => {
                console.log("WebSocket 连接已关闭");
            };

            this.websocket.onerror = error => {
                console.error("WebSocket 连接出错:", error);
            };
        },
        requestFirstLevelFood() {
            const message = { type: "requestFirstLevelFood" };
            this.websocket.send(JSON.stringify(message));
        },
        requestSecondLevelFood() {
            const message = { type: "requestSecondLevelFood" };
            this.websocket.send(JSON.stringify(message));
        },
        requestThirdLevelFood() {
            const message = { type: "requestThirdLevelFood" };
            this.websocket.send(JSON.stringify(message));
        }
    }
};
</script>


<style scoped>
button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
}

button:hover {
    background-color: #0056b3;
}

img {
    display: block;
    margin: 0 auto;
    margin-bottom: 10px;
}

div {
    text-align: center;
}

div>div {
    display: inline-block;
}
</style>