<template>
  <div class="container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="点餐" name="tab1">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="(snack, index) in snacks" :key="index" :title="snack.name" :name="index.toString()">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>价格: {{ snack.price }}</div>
              <div>图片: <img :src="snack.img" style="max-width: 100px; max-height: 100px;" /></div>
            </div>

            <div>
              <el-button type="primary" @click="showRemarkDialog(snack)">点餐</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" 
          layout="prev, pager, next" :total="50">
        </el-pagination>
        <el-dialog ref="remarkDialog" v-model="dialogVisible" title="订餐详情" @close="clearRemark">
          <p v-if="currentSnack">{{ currentSnack.name }}</p>
          <p v-if="currentSnack">价格: {{ currentSnack.price }}</p>
          <div class="input-wrapper">
            <label for="remark">备注: </label>
            <div class="flex-container">
              <el-input v-if="currentSnack" v-model="currentSnack.remark" id="remark" placeholder="添加备注"></el-input>
            </div>
          </div>
          <label for="quantity">订单数量:</label>
          <div class="input-wrapper">
            <el-input-number v-model="quantity" :min="1" :max="10" @change="handleChange" />
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeRemarkDialog">取 消</el-button>
            <el-button type="primary" @click="addMeal">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="查看历史订单" name="tab2"  @tab-click="handleTabClick">
        <!-- 查看历史订单页面的内容 -->
        <div class="history">
          <ul class="infinite-list" style="overflow: auto;height:400px">
            <li v-for="order in visibleOrders" class="infinite-list-item">
              <el-timeline style="max-width: 600px">
                <el-timeline-item :timestamp="order.createAt" placement="top">
                  <el-card>
                    <p>用户姓名：{{ order.customerName }}</p>
                    <div v-for="(food, index) in order.foods" :key="index">
                      <p>食物：{{ food.name }}</p>
                      <p>价格：{{ food.price }}</p>
                      <p>图片: {{ food.img }}</p>
                    </div>
                    <p>总价：{{ order.totalPrice }} 元</p>
                    <p>备注：{{ order.remarks }}</p>
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
import axios from 'axios';
import store from '../store';
const baseURL = 'http://10.29.23.17:29010/api/customer/food/';

export default {
  data() {
    return {
      activeTab: 'tab1',
      snacks: [],
      currentPage: 1,
      page: 1,
      pageSize: 10,
      totalItems: 0,
      dialogVisible: false,
      visibleOrders:[],
      activeName:'',
    };
  },
  mounted() {
    
    this.showSnacks();
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    showRemarkDialog(snack) {
      this.currentSnack = snack;
      this.dialogVisible = true;
    },
    closeRemarkDialog() {
      this.dialogVisible = false;
      if (this.currentSnack !== null) {

        setTimeout(() => {
          this.clearRemark();
        }, 0);
      }
    },



    clearRemark() {
      this.currentSnack = null;
      this.quantity = 1;
    },
    /**
     * @description: 下单
     * @return {*}
     */
    addMeal() {

      var data = JSON.stringify({
        "order": {
          "key": this.currentSnack.id
        },
        "remarks": this.currentSnack.remark
      })
      axios({
        method: 'post',
        url: `${baseURL}order`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: store.getters.getToken // 获取存储的token
        },
        data: data
      }).then(response => {
        console.log(response.data);
        if (response.data.code == 200) {
          this.closeRemarkDialog();
        } else {
          console.error(response.data.message);
        }
      })
        .catch(error => {
          console.error("请求失败：", error.message || "未知错误");
        });
    },
    /**
     * @description: 查询历史订单
     * @return {*}
     */
    showHistoryOrders() {
      console.log("token:"+store.getters.getToken);
      axios({
        method: 'get',
        url: `${baseURL}history`,
        headers: {
          Authorization: store.getters.getToken // 获取存储的token
        }
      }).then(response => {
        console.log(response.data);
        if (response.data.code === 200) {
          // 遍历每个订单条目，提取出所需信息，并存储在visibleOrders中
          this.visibleOrders = response.data.data.map(order => {
            return {
              customerName: order.customerName, // 用户姓名
              foods: Object.values(order.foods), // 所有食物信息
              totalPrice: order.totalPrice,
              remarks: order.remarks,
              createAt: order.createAt
            };
          });
        } else {
          console.error(response.data.message);
        }
      }).catch(error => {
        console.error("请求失败：", error.message || "未知错误");
      });
    },

    handleTabClick() {
        this.showHistoryOrders();

    },
    showSnacks() {
      console.log("token:" + store.getters.getToken);
      console.log("page"+ this.page)
      axios({
        method: 'get',
        url: `${baseURL}page?page=${this.page}&pageSize=${this.pageSize}`,
        headers: {
          Authorization: store.getters.getToken
        }
      }).then(response => {
        console.log(response.data);
        if (response.data.code === 200) {
          this.snacks = response.data.data.records;
          this.totalItems = response.data.data.total;
        } else {
          console.error(response.data.message);
        }
      })
        .catch(error => {
          console.error("请求失败：", error.message || "未知错误");
        });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.page = page; // 设置当前页码
      this.showSnacks();
    },

  }
};
</script>

<style scoped>
.customer-snack {
  width: 80%;

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

.container {
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 80%;
  margin: auto;
}

.input-wrapper {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  justify-content: center;
}
</style>
