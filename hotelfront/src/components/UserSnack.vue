<template>
    <div class="container">
      <el-tabs v-model="activeTab" >
        <el-tab-pane label="点餐" name="tab1" >
          <!-- 点餐页面的内容 -->
          <div class="customer-snack">
            <el-carousel :interval="4000" type="card" height="260px">
              <el-carousel-item v-for="snack in snacks" :key="snack.title">
                <el-card>
                  <template #header>
                    <div class="card-header">
                      <span>{{ snack.title }}</span>
                    </div>
                  </template>
                  <p>{{ snack.description }}</p>
                  <p>价格：{{ snack.price }} 元</p>
                  <el-button>订餐</el-button>
                </el-card>
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-tab-pane>
        <el-tab-pane label="查看历史订单" name="tab2">
          <!-- 查看历史订单页面的内容 -->
          <div class="history" >
            <ul class="infinite-list" style="overflow: auto;height:400px">
              <li v-for="order in visibleOrders" :key="order.timestamp" class="infinite-list-item">
                <el-timeline style="max-width: 600px">
                  <el-timeline-item :timestamp="order.timestamp" placement="top">
                    <el-card>
                      <h4>{{ order.title }}</h4>
                      <p>{{ order.details }}</p>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </li>
            </ul>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  
  export default {
    data() {
      return {
        activeTab: 'tab1', // 初始时点餐页面为活动页面
        snacks: [
          { title: "档位一", description: "美味餐饮信息1", price: 20 },
          { title: "档位二", description: "美味餐饮信息2", price: 30 },
          { title: "档位三", description: "美味餐饮信息3", price: 40 },
          // 添加更多档位信息...
        ],
        visibleOrders: [
          { title: "订单1", details: "订单1的详细信息", timestamp: "2018/4/12" },
          { title: "订单2", details: "订单2的详细信息", timestamp: "2018/4/3" },
          { title: "订单3", details: "订单3的详细信息", timestamp: "2018/4/2" },
          // 添加更多订单历史数据...
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    
    justify-content: center;
    align-items: center;
    height: 100%;
    width:80%;
    margin: auto;
  }
  .customer-snack {
    width: 80%;
    /* 调整宽度为您需要的大小 */
    margin: 10% auto;
    margin-left: 150px;
  }
  .history{
    margin-top:50px;
    margin-left: 200px;
  }
  .infinite-list {
    height: 300px;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .infinite-list .infinite-list-item {
    margin-bottom: 20px;
  }

  </style>
  