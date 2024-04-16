<template>
  <div class="container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="点餐" name="tab1">
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
                <el-button @click="showRemarkDialog(snack)">订餐</el-button>
              </el-card>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-tab-pane>
      <el-tab-pane label="查看历史订单" name="tab2" >
        <!-- 查看历史订单页面的内容 -->
        <div class="history">
          <ul class="infinite-list" style="overflow: auto;height:400px">
            <li v-for="order in visibleOrders" :key="order.timestamp" class="infinite-list-item">
              <el-timeline style="max-width: 600px">
                <el-timeline-item :timestamp="order.createAt" placement="top">
                  <el-card>
                    <h4>订单编号：{{ order.id }}</h4>
                    <p>顾客编号：{{ order.customerId }}</p>
                    <p>总价：{{ order.totalPrice }} 元</p>
                    <p>备注：{{ order.remarks }}</p>
                    <p>创建时间：{{ order.createAt }}</p>
                    <p>食物清单：</p>

                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog ref="remarkDialog" v-model="dialogVisible" title="订餐详情" @close="clearRemark">
      <p>{{ currentSnack.title }}</p>
      <p>{{ currentSnack.description }}</p>
      <div class="input-wrapper">
        <label for="remark">备注: </label>
        <div class="flex-container">
          <el-input v-model="currentSnack.remark" id="remark" placeholder="添加备注"></el-input>
        </div>
      </div>

      <label for="quantity">订单数量:</label>
      <div class="input-wrapper">
        <el-input-number v-model="quantity" :min="1" :max="10" @change="handleChange" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeRemarkDialog">取 消</el-button>
        <el-button type="primary" @click="addRemark">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

import axios from 'axios';

export default {
  data() {
    return {
      activeTab: 'tab1', // 初始时点餐页面为活动页面
      snacks: [
        { id: 1, title: "档位一", description: "美味餐饮信息1", price: 20, remark: "" },
        { id: 2, title: "档位二", description: "美味餐饮信息2", price: 30, remark: "" },
        { id: 3, title: "档位三", description: "美味餐饮信息3", price: 40, remark: "" },
        
      ],
      visibleOrders: [],
      dialogVisible: false,
      currentSnack: null,
      quantity: 1
    }
  },
  methods: {
    handleChange(value) {
      console.log(value)
    },
    showRemarkDialog(snack) {
      if (snack) {
        this.currentSnack = snack;
        this.dialogVisible = true;
      } else {
        console.error("未能正确设置 currentSnack。");
      }
    },
    closeRemarkDialog() {
      this.dialogVisible = false;
      this.clearRemark();
    },
    clearRemark() {
      this.currentSnack = null;
      this.quantity = 1; // 重置订餐数量为1
    },
    addRemark() {
      const order = {
        order: {
          [this.currentSnack.id]: this.quantity
        },
        remarks: this.currentSnack.remark
      };
      console.log(order)
      axios.post('http://localhost:29010/api/customer/food/order', order)
        .then(response => {
          console.log(response);
          if (response.code == 200) {
            this.closeRemarkDialog();
          }
          else {
            console.error(response.message);
          }
        })
        .catch(error => {
          console.error("请求失败：", error.response.data.message || "未知错误");
        });
    },
    handleTabClick() {
      if (this.activeTab === "tab1" ) {
        console.log("1111");
        this.showHistoryOrders();
      }
      
    },
    showHistoryOrders() {
      axios.get('http://localhost:29010/api/customer/food/history')
        .then(response => {
          console.log(response);
          if (response.code === 200) {
            this.visibleOrders = response.data;
            console.log("response.data:"+response.data)
          }
          else {
            console.error(response.message);
          }
        })
        .catch(error => {
          console.error("请求失败：", error.response.data.message || "未知错误");
        });
    }
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

.customer-snack {
  width: 80%;
  /* 调整宽度为您需要的大小 */
  margin: 10% auto;
  margin-left: 150px;
}

.history {
  margin-top: 50px;
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

.slider-demo-block {
  margin-top: 20px;
}

.demonstration {
  margin-right: 10px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;

  justify-content: center;
}

.label {
  margin-right: 100px;
}
</style>
