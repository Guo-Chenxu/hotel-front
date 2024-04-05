<template>
    <div class="customer-snack">
        <el-carousel :interval="4000" type="card" height="300px">
            <el-carousel-item v-for="snack in snacks" :key="snack.title">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span>{{snack.title}}</span>
                        </div>
                    </template>
                    <p>{{ snack.description }}</p>
                    <p>价格：{{ snack.price }} 元</p>
                    <el-button>订餐</el-button>
                </el-card>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
export default {
    data() {
        return {
            snacks: [
                { title: "档位一", description: "美味餐饮信息1", price: 20 },
                { title: "档位二", description: "美味餐饮信息2", price: 30 },
                { title: "档位三", description: "美味餐饮信息3", price: 40 },
                // 添加更多档位信息...
            ]
        };
    }
};
</script>

<style scoped>
.customer-snack {
    width: 70%;
    /* 调整宽度为您需要的大小 */
    margin: 20% auto;

}


</style>