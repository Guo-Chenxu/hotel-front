<template>
    <div class="container">
        <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane label="消费图表" name="chart">
                <div id="pieChart" style="width: 100%; height: 400px;"></div>
            </el-tab-pane>
            <el-tab-pane label="账单" name="summary">
                <el-card class="control-panel" shadow="always">
                    <template #header>
                        <div class="card-header">
                            <span>账单</span>
                        </div>
                    </template>
                    <div>
                        
                        <p><strong>房间ID:</strong> {{ this.bill.roomId }}</p>
                        <p><strong>入住时间:</strong> {{ this.bill.checkInTime }}</p>
                        <p><strong>退房时间:</strong> {{ this.bill.checkOutTime }}</p>
                        <p><strong>截止目前总房费:</strong> {{ this.bill.roomTotPrice }}</p>
                        <p><strong>押金:</strong> {{ this.bill.deposit }}</p>
                        <p><strong>餐饮消费:</strong> {{ this.bill.foodBill }}</p>
                        <p><strong>空调消费:</strong> {{ this.bill.acBill }}</p>
                        <p><strong>扣除押金后的总价:</strong> {{ this.bill.totalPrice }}</p>
                    </div>
                    <button @click="downloadBillPdf" class="el-button el-button--default">下载账单PDF</button>
                </el-card>
            </el-tab-pane>

            <el-tab-pane label="详单" name="detailed">

                <el-tabs v-model="detailTab" type="border-card">
                    <el-tab-pane label="查看住宿详单" name="accommodation">
                        <el-card class="control-panel" shadow="always">
                            <template #header>
                                <div class="card-header">
                                    <span>住宿详单</span>
                                </div>
                            </template>
                            <div>
                                <p><strong>顾客ID:</strong> {{ this.detail.customerId }}</p>
                                <p><strong>房间ID:</strong> {{ this.detail.roomId }}</p>
                                <p><strong>入住时间:</strong> {{ this.detail.checkInTime }}</p>
                                <p><strong>退房时间:</strong> {{ this.detail.checkOutTime }}</p>
                                <p><strong>截止目前房费:</strong> {{ this.detail.roomPrice }}</p>
                                <p><strong>截止目前总房费:</strong> {{ this.detail.roomTotPrice }}</p>
                                <p><strong>押金:</strong> {{ this.detail.deposit }}</p> 
                            </div>
                            <button @click="downloadRoomBillPdf" class="el-button el-button--default">下载房间详单PDF</button>
                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane label="餐饮详单" name="dining">
                        <el-card class="control-panel" shadow="always">
                            <template #header>
                                <div class="card-header">
                                    <span>餐饮详单</span>
                                </div>
                            </template>
                            <p> <strong>餐饮详单:</strong>
                                <li v-for="foodbill in this.detail.foodBillList" class="infinite-list-item">
                                    <el-timeline style="max-width: 600px">
                                        <el-timeline-item :timestamp="foodbill.createAt" placement="top">
                                            <el-card>
                                                
                                                <div v-for="(food, index) in foodbill.foods" :key="index">
                                                    <p>食物：{{ food.name }}</p>
                                                    <p>价格：{{ food.price }}</p>
                                                    <p>图片: {{ food.img }}</p>
                                                </div>
                                                <p>总价：{{ foodbill.totalPrice }} 元</p>
                                                <p>备注：{{ foodbill.remarks }}</p>
                                            </el-card>
                                        </el-timeline-item>
                                    </el-timeline>
                                </li>
                            </p>
                            <p><strong>餐饮总价:</strong> {{ this.detail.foodPrice }}</p>
                            <button @click="downloadSnackBillPdf"
                                class="el-button el-button--default">下载餐饮详单PDF</button>
                        </el-card>
                    </el-tab-pane>

                    <el-tab-pane label="纳凉详单" name="cooling">
                        <el-card class="control-panel" shadow="always">
                            <template #header>
                                <div class="card-header">
                                    <span>纳凉详单</span>
                                </div>
                            </template>
                            <p> <strong>空调详单:</strong>
                                <li v-for="acbill in this.detail.acBillList" class="infinite-list-item">
                                    <el-timeline style="max-width: 600px">
                                        <el-timeline-item :timestamp="acbill.createAt" placement="top">
                                            <el-card>
                                                
                                                <p>单价：{{ acbill.price }}</p>
                                                <p>档位：{{ acbill.status }}</p>
                                                <p>改变温度：{{ acbill.changeTemperature }} 元</p>
                                                <p>此次服务时长：{{ acbill.duration }}</p>
                                                <p>此次服务总价：{{ acbill.totalPrice }}</p>

                                            </el-card>
                                        </el-timeline-item>
                                    </el-timeline>
                                </li>
                            </p>
                            <p><strong>空调总价:</strong> {{ this.detail.acPrice }}</p>
                            
                            <button @click="downloadCoolBillPdf" class="el-button el-button--default">下载纳凉详单PDF</button>
                        </el-card>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>

import axios from 'axios'
import store from '../store';
const baseURL = 'http://10.29.23.17:29010/api/customer/bill';
import * as echarts from 'echarts';

export default {
    data() {
        return {
            activeTab: 'chart',
            detailTab: '',
            bill: {
                customerId: "",
                roomId: "",
                checkInTime: "",
                checkOutTime: "",
                roomTotPrice: "",
                deposit: "",
                foodBill: "",
                acBill: "",
                totalPrice: "",
            },
            detail: {
                customerId: "",
                roomId: "",
                checkInTime: "",
                checkOutTime: "",
                roomPrice: "",
                roomTotPrice: "",
                deposit: "",
                foodBillList: [],
                foodPrice: "",
                acBill: [],
                totalPrice: "",
            }
        };
    },
    mounted() {
        this.fetchBill();
    },
    watch: {
        detailTab(newTab, oldTab) {
            // 根据选中的详单标签页调用不同的方法
            switch (newTab) {
                case 'accommodation':
                    this.fetchRoomBill();
                    break;
                case 'dining':
                    this.fetchSnackBill();
                    break;
                case 'cooling':
                    this.fetchCoolBill();
                    break;
                default:
                    break;
            }
        },
        bill: {
            handler() {
                this.drawPieChart();
            },
            deep: true
        }
    },

    methods: {
        fetchBill() {

            axios({
                method: 'get',
                url: `${baseURL}/bill`,
                headers: {
                    Authorization: store.getters.getToken
                },
            }).then(response => {
                if (response.data.code === 200) {
                    this.bill = response.data.data;
                    this.drawPieChart();
                } else {
                    console.error(response.data.message);
                }
            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },
        fetchRoomBill() {
            console.log("fecthRoom")

            axios({
                method: 'get',
                url: `${baseURL}/billStatement?type=${1}`,
                headers: {
                    Authorization: store.getters.getToken
                },
            }).then(response => {
                console.log(response.data.data)
                if (response.data.code === 200) {
                    this.detail = response.data.data;
                } else {
                    console.error(response.data.message);
                }
            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },
        fetchSnackBill() {
            console.log("fecthSnack")

            axios({
                method: 'get',
                url: `${baseURL}/billStatement?type=${3}`,
                headers: {
                    Authorization: store.getters.getToken
                },
            }).then(response => {
                console.log(response.data.data)
                if (response.data.code === 200) {
                    this.detail = response.data.data;
                } else {
                    console.error(response.data.message);
                }
            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },
        fetchCoolBill() {
            console.log("fecthCool")

            axios({
                method: 'get',
                url: `${baseURL}/billStatement?type=${2}`,
                headers: {
                    Authorization: store.getters.getToken
                },
            }).then(response => {
                console.log(response.data.data)
                if (response.data.code === 200) {
                    this.detail = response.data.data;
                } else {
                    console.error(response.data.message);
                }
            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },



        drawPieChart() {

            const pieChart = echarts.init(document.getElementById('pieChart'));

            const option = {
                title: {
                    text: '消费比例',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: ['房间', '空调', '简餐']
                },
                series: [
                    {
                        name: '消费比例',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: this.bill.roomTotPrice, name: '房间' },
                            { value: this.bill.acBill, name: '空调' },
                            { value: this.bill.foodBill, name: '简餐' }
                        ]
                    }
                ]
            };

            pieChart.setOption(option);
        },

        downloadBillPdf() {
            axios({
                method: 'get',
                url: `${baseURL}/downloadBill`,
                headers: {
                    Authorization: store.getters.getToken
                },
            }).then(response => {

                console.log(response)

            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },
        downloadRoomBillPdf() {
            axios({
                method: 'get',
                url: `${baseURL}/downloadBillStatement?type=${1}`,
                headers: {
                    Authorization: store.getters.getToken
                },
            }).then(response => {
                console.log(response)
            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },
        downloadSnackBillPdf() {
            axios({
                method: 'get',
                url: `${baseURL}/downloadBillStatement?type=${2}`,
                headers: {
                    Authorization: store.getters.getToken
                },
            }).then(response => {
                console.log(response)
            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },
        downloadCoolBillPdf() {
            axios({
                method: 'get',
                url: `${baseURL}/downloadBillStatement?type=${3}`,
                headers: {
                    Authorization: store.getters.getToken
                },
            }).then(response => {
                console.log(response)
            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },

    }

}
</script>

<style scoped>
.container {
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 80%;
    margin: auto;
}
</style>