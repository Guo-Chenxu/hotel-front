<template>
  <div class="container">
    <el-dialog ref="remarkDialog" v-model="dialogVisible" title="订餐详情">
      <div v-for="snack in multipleSelection" :key="snack.id">
        <div class="food-info">
          <p>{{ snack.name }}</p>
          <img :src="snack.img" class="snack-image" />
        </div>
        <div class="input-wrapper">
          <label for="quantity">数量:</label>
          <el-input-number v-model="snack.quantity" :min="1" :max="10"  size="small"  />
        </div>
      </div>
      <h3><strong>总价：</strong>{{ totalPrice }} 元</h3>
      <div class="input-wrapper">
        <label for="remark" style="margin-right:20px">备注: </label>
        <div class="flex-container">
          <el-input v-model="remark" id="remark" placeholder="添加备注"></el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeRemarkDialog">取 消</el-button>
        <el-button type="primary" @click="addMeal">确 定</el-button>
      </div>
    </el-dialog>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="点餐" name="tab1">
        <el-table :data="snacks" style="width: 100%" @selection-change="handleSelectionChange" ref="snackTable"
          :row-key="row => row.id" :selectable="row => !row.disabled">
          <el-table-column type="selection" width="55" />
          <el-table-column label="Name" prop="name" />
          <el-table-column label="Price" prop="price" />
          <el-table-column label="Image">
            <template #default="scope">
              <img :src="scope.row.img" style="max-width: 100px; max-height: 100px;" />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" layout="prev, pager, next"
          :total= this.totalItems  :page-size="this.pageSize" style="margin-left:40%;margin-top:10px">
        </el-pagination>
        <div style="margin-top: 20px">
          <el-button @click="showRemarkDialog()" :disabled="multipleSelection.length === 0">点餐</el-button>
        </div>
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
      totalPrice: 0, 
      currentSnack: '',
      multipleSelection: [], 
      remark: null 
    };
  },
  mounted() {

    this.showSnacks();
  },
  computed: {
    // 计算订单总价
    totalPrice() {
      return this.multipleSelection.reduce((total, snack) => {
        return total + snack.price * snack.quantity;
      }, 0);
    }
  },
  methods: {
    handleSelectionChange(selection) {
      this.multipleSelection = selection;

    },
    handleCurrentChange(val) {
            this.currentPage = val;
            this.showSnacks();
        },

    showRemarkDialog() {
      // 将多选菜品的数量设置为1
      this.multipleSelection.forEach(snack => {
        snack.quantity = 1;
      });
      this.dialogVisible = true;
    },
    closeRemarkDialog(){
      this.dialogVisible = false;
      this.multipleSelection = [];
          this.remark = '';
          // 清空表格的选项
          this.$refs.snackTable.clearSelection();
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
      if (this.multipleSelection.length == 0) {
        return;
      }

      const order = {
        order: this.multipleSelection.reduce((acc, snack) => {
          acc[snack.id] = snack.quantity;
          return acc;
        }, {}),
        remarks: this.remark
      };

      axios({
        method: 'post',
        url: `${baseURL}/order`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token') 
        },
        data: JSON.stringify(order)
      }).then(response => {
        if (response.data.code === 200) {
          this.dialogVisible = false;
          this.$message.success('点餐成功');
          this.multipleSelection = [];
          this.remark = '';

          // 清空表格的选项
          this.$refs.snackTable.clearSelection();
        } else {
          console.error(response.data.message);
        }
      }).catch(error => {
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
          Authorization: localStorage.getItem('token') 
        }
      }).then(response => {
        console.log(response.data);
        if (response.data.code === 200) {

          this.visibleOrders = response.data.data.map(order => {
            const foods = [];
            for (const key in order.foods) {
              if (order.foods.hasOwnProperty(key)) {

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
              customerName: order.customerName, 
              foods: foods, 
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
      this.page = page; 
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
  justify-content: space-between;
  /* 在容器内部平均分配空间，使子元素对齐 */
}
.snack-image {
  max-width: 50px;
  max-height: 50px;
}
.food-info {
  display: flex;
  align-items: center;
  margin-left:40%
}

</style>
