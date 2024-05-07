<template>
    <el-card class="control-panel" shadow="always">
        <div slot="header">
            <h2>房间详情</h2>
        </div>
        <div>
            <p><strong>顾客姓名:</strong> {{ room.customerName }}</p>
            <p><strong>入住时间:</strong> {{ room.startTime }}</p>
            <p><strong>退房时间:</strong> {{ room.leaveTime }}</p>
            <p><strong>房间号:</strong> {{ room.roomId }}</p>
            <p><strong>价格:</strong> {{ room.price }}</p>
            <p><strong>温度:</strong> {{ room.temperature }}</p>
            <h6>[此项温度不为实时温度, 实时温度请查看空调页面]</h6>
        </div>
    </el-card>
</template>

<script>
import axios from 'axios';
import api from '@/api'; 
const baseURL = `${api.baseURL}/room/info`
export default {

    data() {
        return {
            
            room: {
                customerName: "",
                startTime: "",
                leaveTime: "",
                roomId: "",
                price: "",
                temperature: ""
            }
        };
    },
    mounted() {
        this.fetchRoomDetails();
    },
    methods: {
        fetchRoomDetails() {
            
            axios({
                method: 'get',
                url: `${baseURL}/${localStorage.getItem('roomId')}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                },
            }).then(response => {
                if (response.data.code === 200) {
                    this.room = response.data.data;
                    // 将字符串类型的温度转换为数字类型，然后保留两位小数
                this.room.temperature = parseFloat(response.data.data.temperature).toFixed(2);
                    
                } else {
                    console.error(response.data.message);
                }
            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        }
    }
};
</script>

<style scoped>
.control-panel {
    width: 40%;
    padding: 20px;
    border-radius: 10px;
    margin-top: 100px;
    margin-left: 450px;
}
</style>