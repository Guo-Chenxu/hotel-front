<template>
    <el-card class="control-panel" shadow="always">
        <div slot="header">
            <h2>房间详情</h2>
        </div>
        <el-table :data="[
            { label: '顾客姓名', value: room.customerName },
            { label: '入住时间', value: room.startTime },
            { label: '退房时间', value: room.leaveTime },
            { label: '房间号', value: room.roomId },
            { label: '价格', value: room.price },
            { label: '房间默认温度', value: room.indoorTemperature },
            { label: '温度', value: room.temperature },
            { label: '备注', value: '[此项温度不为实时温度, 实时温度请查看空调页面]' }
        ]" border style="width: 600px;margin-left:50px">
            <el-table-column prop="label" label="属性" width="150">
                <template v-slot="{ row }">
                    <strong>{{ row.label }}</strong>
                </template>
            </el-table-column>
            <el-table-column prop="value" label="值" width="450">
                <template v-slot="{ row }">
                    {{ row.value }}
                </template>
            </el-table-column>
        </el-table>

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
                    this.room.indoorTemperature = parseFloat(response.data.data.indoorTemperature).toFixed(2)
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
    width: 60%;
    padding: 20px;
    border-radius: 10px;
    margin-top: 30px;
    margin-left: 200px;
}
</style>