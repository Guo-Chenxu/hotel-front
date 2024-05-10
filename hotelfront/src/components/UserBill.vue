<template>
    <div class="container">
        <el-tabs v-model="activeTab" type="border-card">
            <el-tab-pane label="消费图表" name="chart">
                <div class="chart-container">
                    <div id="pieChart"></div>
                </div>
            </el-tab-pane>

            <el-tab-pane label="账单" name="summary">
                <el-card class="control-panel" shadow="always">
                    <template #header>
                        <div class="card-header">
                            <span>账单</span>
                        </div>
                    </template>
                    <el-table :data="[
                        { label: '房间号', value: this.bill.roomId },
                        { label: '入住时间', value: this.bill.checkInTime },
                        { label: '退房时间', value: this.bill.checkOutTime },
                        { label: '截止目前总房费', value: `${this.bill.roomTotPrice}元` },
                        { label: '押金', value: `${this.bill.deposit}元` },
                        { label: '餐饮消费', value: `${this.bill.foodBill}元` },
                        { label: '空调消费', value: `${this.bill.acBill}元` },
                        { label: '扣除押金后的总价', value: `${this.bill.totalPrice}元` }
                    ]" border style="width: 350px;margin-left:36%;margin-bottom:20px">
                        <el-table-column label="属性" width="150">
                            <template v-slot="{ row }">
                                <strong>{{ row.label }}</strong>
                            </template>
                        </el-table-column>
                        <el-table-column label="值" width="200">
                            <template v-slot="{ row }">
                                {{ row.value }}
                            </template>
                        </el-table-column>
                    </el-table>

                    <button @click="downloadBillPdf" class="el-button el-button--default">下载账单PDF</button>
                </el-card>
            </el-tab-pane>

            <el-tab-pane label="详单" name="detailed">
                <el-form-item label="详单类型:" style="margin-left:35%">
                    <el-select v-model="selectedDetailType" multiple placeholder="Select" style="width: 240px">
                        <el-option label="住宿" value="1"></el-option>
                        <el-option label="纳凉" value="2"></el-option>
                        <el-option label="餐饮" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="fetchDetail" round style="margin-bottom:20px">查看详单</el-button>
                <el-button @click="downloadBillStatementPdf" class="el-button el-button--default"
                    style="margin-bottom:20px">下载详单PDF</el-button>

                <div v-if="this.ROOM">
                    <el-card class="control-panel" shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>住宿详单</span>
                            </div>
                        </template>
                        <el-table :data="[
                            { label: '房间号', value: this.Roomdetail.roomId },
                            { label: '入住时间', value: this.Roomdetail.checkInTime },
                            { label: '退房时间', value: this.Roomdetail.checkOutTime },
                            { label: '截止目前房费', value: `${this.Roomdetail.roomPrice} 元` },
                            { label: '截止目前总房费', value: `${this.Roomdetail.roomTotPrice} 元` },
                            { label: '押金', value: `${this.Roomdetail.deposit} 元` }
                        ]" border style="width: 350px;margin-left:38%;">
                            <el-table-column label="属性" width="150">
                                <template v-slot="{ row }">
                                    <strong>{{ row.label }}</strong>
                                </template>
                            </el-table-column>
                            <el-table-column label="值" width="200">
                                <template v-slot="{ row }">
                                    {{ row.value }}
                                </template>
                            </el-table-column>
                        </el-table>


                    </el-card>
                </div>
                <div v-if="this.COOL">

                    <el-card class="control-panel" shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>纳凉详单</span>
                            </div>
                        </template>

                        <div v-for="acbill in this.Cooldetail.acBillList" class="infinite-list-item"
                            style="margin-left:13%;margin-top:10px">

                            <el-timeline style="max-width: 600px">
                                <el-timeline-item :timestamp="acbill.createAt" placement="top">
                                    <el-card>

                                        <el-table :data="[{
                                            label: '单价',
                                            value: `${acbill.price} 元/分钟`
                                        },
                                        {
                                            label: '档位',
                                            value: statusText(acbill.status),
                                        },
                                        {
                                            label: '改变温度',
                                            value: `${acbill.changeTemperature} °C`
                                        },
                                        {
                                            label: '此次服务时长',
                                            value: `${acbill.duration} 分钟`
                                        },
                                        {
                                            label: '此次服务总价',
                                            value: `${acbill.totalPrice} 元`
                                        },
                                        {
                                            label: '请求时间',
                                            value: acbill.requestTime
                                        },
                                        {
                                            label: '服务结束时间',
                                            value: acbill.endTime
                                        }
                                        ]" border style="width: 400px;margin-left:50px">
                                            <el-table-column label="属性" width="150">
                                                <template v-slot="{ row }">
                                                    <strong>{{ row.label }}</strong>
                                                </template>
                                            </el-table-column>
                                            <el-table-column label="值" width="250">
                                                <template v-slot="{ row }">
                                                    {{ row.value }}
                                                </template>
                                            </el-table-column>
                                        </el-table>

                                    </el-card>
                                </el-timeline-item>
                            </el-timeline>
                        </div>

                        <p><strong>空调总价:</strong> {{ this.Cooldetail.acPrice }}</p>


                    </el-card>

                </div>
                <div v-if="this.SNACK">
                    <el-card class="control-panel" shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>餐饮详单</span>
                            </div>
                        </template>

                        <div v-for="(foodBill, index) in Fooddetail" :key="index"
                            style="margin-left:13%;margin-top:10px">
                            <el-timeline style="max-width: 600px">
                                <el-timeline-item :timestamp="foodBill.createAt" placement="top">
                                    <el-card>
                                        <el-table :data="[
                                            { label: '总价', value: `${foodBill.totalPrice} 元` },
                                            { label: '备注', value: foodBill.remarks },
                                            { label: '创建时间', value: new Date(foodBill.createAt).toLocaleString() },
                                            { label: '食物清单', value: '' } // Placeholder for nested food items
                                        ]" border style="width: 400px;margin-left:50px">
                                            <el-table-column prop="label" label="属性" width="150">
                                                <template v-slot="{ row }">
                                                    <strong>{{ row.label }}</strong>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="value" label="值" width="250">
                                                <template v-slot="{ row }">
                                                    <span v-if="row.label !== '食物清单'">{{ row.value }}</span>
                                                    <div v-else>
                                                        <div v-for="(food, foodIndex) in foodBill.foods"
                                                            :key="foodIndex" class="food-item">
                                                            <h3><strong>食物{{ foodIndex + 1 }}：</strong>{{ food.name }}
                                                            </h3>
                                                            <p>食物价格：{{ food.price }}</p>
                                                            <p>食物图片：<img :src="food.img"
                                                                    style="max-width: 100px; max-height: 100px;" /></p>
                                                        </div>
                                                    </div>
                                                </template>
                                            </el-table-column>
                                        </el-table>

                                    </el-card>
                                </el-timeline-item>

                            </el-timeline>

                        </div>


                    </el-card>
                </div>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>
import { ROOM_TYPE, COOL_TYPE, SNACK_TYPE } from '../constants/constants';
import axios from 'axios'
import api from '@/api';
const baseURL = `${api.baseURL}/bill`;
import * as echarts from 'echarts';

export default {
    data() {
        return {
            ROOM: false,
            COOL: false,
            SNACK: false,
            selectedDetailType: [],
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
            Roomdetail: {},
            Fooddetail: {},
            Cooldetail: {},
        };
    },
    mounted() {
        this.fetchBill();
    },
    watch: {
        bill: {
            handler() {
                this.drawPieChart();
            },
            deep: true
        }
    },
    methods: {

        statusText(status) {
            switch (status) {
                case 1:
                    return '低';
                case 2:
                    return '中';
                case 3:
                    return '高';
                default:
                    return '';
            }
        },

        fetchBill() {

            axios({
                method: 'get',
                url: `${baseURL}/bill`,
                headers: {
                    Authorization: localStorage.getItem('token')
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
        fetchDetail() {
            this.ROOM = false;
            this.COOL = false;
            this.SNACK = false;
            // 将用户选择的详单类型转换为字符串，用逗号分隔发送给后端
            const types = this.selectedDetailType.join(',');
            if (this.selectedDetailType.includes(ROOM_TYPE))
                this.ROOM = true;
            if (this.selectedDetailType.includes(COOL_TYPE))
                this.COOL = true;
            if (this.selectedDetailType.includes(SNACK_TYPE))
                this.SNACK = true;
            axios({
                method: 'get',
                url: `${baseURL}/billStatement/?type=${types}`,
                headers: {
                    Authorization: localStorage.getItem('token')
                },
            }).then(response => {
                // 根据后端返回的数据更新对应的详单数据
                // 注意：需要根据实际返回的数据结构进行修改
                this.Roomdetail = response.data.data;
                this.Cooldetail = response.data.data;
                this.Fooddetail = response.data.data.foodBillList ? response.data.data.foodBillList.map(foodBill => {
                    var foods = [];
                    for (const [foodStr] of Object.entries(foodBill.foods)) {
                        const food = JSON.parse(foodStr);
                        foods.push({
                            name: food.name,
                            price: food.price,
                            img: food.img,
                        });
                    }

                    return {
                        id: foodBill.id,
                        customerId: foodBill.customerId,
                        foods: foods,
                        totalPrice: foodBill.totalPrice,
                        remarks: foodBill.remarks,
                        createAt: foodBill.createAt
                    };
                }) : [];


            })
                .catch(error => {
                    console.error("请求失败：", error.message || "未知错误");
                });
        },
        fetchRoomBill() {
            axios({
                method: 'get',
                url: `${baseURL}/billStatement?type=${1}`,
                headers: {
                    Authorization: localStorage.getItem('token')
                },
            }).then(response => {
                if (response.data.code === 200) {
                    this.Roomdetail = response.data.data;
                } else {
                    console.error(response.data.message);
                }
            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },
        drawPieChart() {

            const pieChartContainer = document.getElementById('pieChart');

            echarts.dispose(pieChartContainer);
            const pieChart = echarts.init(pieChartContainer);

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
                    Authorization: localStorage.getItem('token')
                },
                responseType: 'blob'
            }).then(response => {
                // 创建一个临时的下载链接
                const url = window.URL.createObjectURL(new Blob([response.data]));

                // 创建一个虚拟的链接元素
                const link = document.createElement('a');
                link.href = url;
                link.download = 'bill.pdf';

                // 模拟点击下载链接
                link.click();

                // 清理临时链接
                window.URL.revokeObjectURL(url);

                this.$message.success("下载账单成功")

            }).catch(error => {
                console.error("请求失败：", error.message || "未知错误");
            });
        },
        downloadBillStatementPdf() {
            const types = this.selectedDetailType.join(',');
            if (!types) {
                this.$message.error('请先选择详单类型');
            } else {
                axios({
                    method: 'get',
                    url: `${baseURL}/downloadBillStatement/?type=${types}`,
                    headers: {
                        Authorization: localStorage.getItem('token')
                    },
                    responseType: 'blob'
                }).then(response => {
                    // 创建一个临时的下载链接
                    const url = window.URL.createObjectURL(new Blob([response.data]));

                    // 创建一个虚拟的链接元素
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'RoomBill.pdf';

                    // 模拟点击下载链接
                    link.click();

                    // 清理临时链接
                    window.URL.revokeObjectURL(url);

                    this.$message.success("下载详单成功")

                }).catch(error => {
                    console.error("请求失败：", error.message || "未知错误");
                });
            }
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
    margin-left: 100px;
}

.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
}

.bill-content {
    margin-left: 40%;
    margin-bottom: 10px;
    text-align: left;
}

#pieChart {
    width: 80%;
    max-width: 1000px;
    height: 100%;
}



.food-list {
    display: flex;
    flex-wrap: wrap;
    /* 允许在需要时折行 */
    justify-content: center;
    /* 从左向右对齐 */
}

.food-item {
    margin-right: 20px;
    /* 可选：为每个食物项目添加间距 */
}
</style>