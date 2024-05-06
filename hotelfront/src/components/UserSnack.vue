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
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" layout="prev, pager, next"
          :total= this.totalItems  :page-size="this.pageSize">
        </el-pagination>
        <el-dialog ref="remarkDialog" v-model="dialogVisible" title="订餐详情">
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
            <el-input-number v-model="currentSnack.quantity" :min="1" :max="10" @change="handleChange" />
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeRemarkDialog">取 消</el-button>
            <el-button type="primary" @click="addMeal">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="查看历史订单" name="tab2" @tab-click="handleTabClick">
        <!-- 查看历史订单页面的内容 -->
        <div class="history">
          <ul class="infinite-list" style="overflow: auto;height:400px">
            <li v-for="order in visibleOrders" class="infinite-list-item">
              <el-timeline style="max-width: 600px">
                <el-timeline-item :timestamp="formatDateTime(order.createAt)" placement="top">
                  <el-card>

                    <div>
                      <div v-for="(food, index) in order.foods" :key="index" class="food-item">
                        <p><strong>食物：</strong>{{ food.name }}</p>
                        <p><strong>价格：</strong>{{ food.price }}</p>
                        <p><strong>图片：</strong><img :src="food.img" style="max-width: 100px; max-height: 100px;" /></p>
                      </div>
                      <p><strong>总价：</strong>{{ order.totalPrice }} 元</p>
                      <p><strong>备注：</strong>{{ order.remarks }}</p>
                    </div>
                    
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
import api from '@/api'; 
const baseURL = `${api.baseURL}/food`;

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
      visibleOrders: [],
      activeName: '',
      currentSnack: '',
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


    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },


    /**
     * @description: 下单
     * @return {*}
     */
    addMeal() {

      // 构造订单对象
      var order = {
        "order": {
          [this.currentSnack.id]: this.currentSnack.quantity
        },
        "remarks": this.currentSnack.remark
      };


      var data = JSON.stringify(order);
      axios({
        method: 'post',
        url: `${baseURL}/order`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') // 获取存储的token
        },
        data: data
      }).then(response => {
        console.log(response.data);
        if (response.data.code == 200) {
          this.dialogVisible = false;
          this.$message.success('点餐成功');
          this.currentSnack.quantity = ''
          this.currentSnack.remark = ''
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
      console.log("token:" + localStorage.getItem('token'));
      axios({
        method: 'get',
        url: `${baseURL}/history`,
        headers: {
          Authorization: localStorage.getItem('token') // 获取存储的token
        }
      }).then(response => {
        console.log(response.data);
        if (response.data.code === 200) {
          // 遍历每个订单条目，提取出所需信息，并存储在visibleOrders中
          this.visibleOrders = response.data.data.map(order => {
            const foods = [];
            for (const key in order.foods) {
              if (order.foods.hasOwnProperty(key)) {
                // 提取食物信息字符串中的各个属性值
                const [, id, name, price, img] = key.match(/id=(.*?), name=(.*?), price=(.*?), img=(.*?), deleted=(.*?)\)$/);
                foods.push({
                  id: id,
                  name: name,
                  price: price,
                  img: img,
                  quantity: order.foods[key]
                });
              }
            }
            return {
              customerName: order.customerName, // 用户姓名
              foods: foods, // 所有食物信息
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
      axios({
        method: 'get',
        url: `${baseURL}/page?page=${this.page}&pageSize=${this.pageSize}`,
        headers: {
          Authorization: localStorage.getItem('token')
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
.food-item {
  justify-content: space-between; /* 在容器内部平均分配空间，使子元素对齐 */
}

</style>
