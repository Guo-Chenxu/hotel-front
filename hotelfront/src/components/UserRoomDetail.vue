<template>
    <el-card class="control-panel" shadow="always">
        <div slot="header">
            <span>Room Details</span>
        </div>
        <div>
            <p><strong>Customer Name:</strong> {{ room.customerName }}</p>
            <p><strong>Start Time:</strong> {{ room.startTime }}</p>
            <p><strong>Leave Time:</strong> {{ room.leaveTime }}</p>
            <p><strong>Room ID:</strong> {{ room.roomId }}</p>
            <p><strong>Price:</strong> {{ room.price }}</p>
            <p><strong>Temperature:</strong> {{ room.temperature }}</p>
        </div>
    </el-card>
</template>

<script>
import axios from 'axios';

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
                url: `http://10.29.23.17:29010/api/customer/room/info/${localStorage.getItem('roomId')}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                },
            }).then(response => {
                if (response.data.code === 200) {
                    this.room = response.data.data;
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
    margin-top: 60px;
    margin-left: 450px;
    margin-top: 13%;
}
</style>