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
                    <div>
                        <p><strong>房间号:</strong> {{ this.bill.roomId }}</p>
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
                <el-form-item label="详单类型:" style="margin-left:35%">
                    <el-select v-model="selectedDetailType" multiple placeholder="Select" style="width: 240px">
                        <el-option label="住宿" value="1"></el-option>
                        <el-option label="纳凉" value="2"></el-option>
                        <el-option label="餐饮" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="fetchDetail" round style="margin-bottom:20px">查看详单</el-button>
                <el-button @click="downloadBillStatementPdf" class="el-button el-button--default" style="margin-bottom:20px">下载详单PDF</el-button>
                
                <div v-if="this.ROOM">
                    <el-card class="control-panel" shadow="always">
                        <template #header>
                            <div class="card-header">
                                <span>住宿详单</span>
                            </div>
                        </template>
                        <div>
                            <p><strong>房间号:</strong> {{ this.Roomdetail.roomId }}</p>
                            <p><strong>入住时间:</strong> {{ this.Roomdetail.checkInTime }}</p>
                            <p><strong>退房时间:</strong> {{ this.Roomdetail.checkOutTime }}</p>
                            <p><strong>截止目前房费:</strong> {{ this.Roomdetail.roomPrice }} 元</p>
                            <p><strong>截止目前总房费:</strong> {{ this.Roomdetail.roomTotPrice }} 元</p>
                            <p><strong>押金:</strong> {{ this.Roomdetail.deposit }} 元</p>
                        </div>
                        
                    </el-card>
                </div>
                <div v-if="this.COOL">
                    
                        <el-card class="control-panel" shadow="always">
                            <template #header>
                                <div class="card-header">
                                    <span>纳凉详单</span>
                                </div>
                            </template>
                            <p> <strong>空调详单:</strong>
                                <li v-for="acbill in this.Cooldetail.acBillList" class="infinite-list-item">
                                    <el-timeline style="max-width: 600px">
                                        <el-timeline-item :timestamp="formatDateTime(acbill.createAt)" placement="top">
                                            <el-card>

                                                <p>单价：{{ acbill.price }} 元/分钟 </p>
                                                <p>档位：{{ acbill.status }}</p>
                                                <p>改变温度：{{ acbill.changeTemperature }} °C</p>
                                                <p>此次服务时长：{{ acbill.duration }} 分钟</p>
                                                <p>此次服务总价：{{ acbill.totalPrice }} 元</p>

                                            </el-card>
                                        </el-timeline-item>
                                    </el-timeline>
                                </li>
                            </p>
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
                        <ul>
                            <li v-for="(foodBill, index) in Fooddetail" :key="index">
                                <el-card>
                                    <p><strong>总价:</strong> {{ foodBill.totalPrice }} 元</p>
                                    <p><strong>备注:</strong> {{ foodBill.remarks }}</p>
                                    <p><strong>创建时间:</strong> {{ new Date(foodBill.createAt).toLocaleString() }}</p>
                                    <p><strong>食物清单:</strong></p>
                                    <ul>
                                        <li v-for="(food, foodIndex) in foodBill.foods" :key="foodIndex" class="food-item">
                                            <p><strong>食物：</strong>{{ food.name }}</p>
                                            <p><strong>价格：</strong>{{ food.price }}</p>
                                            <p><strong>图片：</strong><img :src="food.img" style="max-width: 100px; max-height: 100px;" /></p>
                                        </li>
                                    </ul>
                                </el-card>
                            </li>
                        </ul>
                        
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
        formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
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
                this.Fooddetail = response.data.data.foodBillList.map(foodBill => {
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
                })

            })
                .catch(error => {
                    console.error("请求失败：", error.message || "未知错误");
                });
        },
        fetchRoomBill() {
            console.log("fecthRoom")

            axios({
                method: 'get',
                url: `${baseURL}/billStatement?type=${1}`,
                headers: {
                    Authorization: localStorage.getItem('token')
                },
            }).then(response => {
                console.log(response.data.data)
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
                    Authorization: localStorage.getItem('token')
                },
                responseType: 'blob'
            }).then(response => {

                console.log(response)
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
    margin: auto;
}
.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh; 
  }
  
  #pieChart {
    width: 80%; 
    max-width: 1000px;
    height: 100%;
  }

  .food-item {
    justify-content: space-between; /* 在容器内部平均分配空间，使子元素对齐 */
  }
</style>