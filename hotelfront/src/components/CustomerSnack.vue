<template>
    <div class="food-selection">
        <el-row class="title">
            <el-col :span="30">
                <h2>餐饮服务</h2>
            </el-col>
        </el-row>

        <el-row class="tier-container">
            <el-col :span="8" v-for="tier in tiers" :key="tier.id">
                <div class="tier">
                    <div class="tier-header">
                        <h3>{{ tier.name }}</h3>
                        <p class="total-price">总价：{{ calculateTotalPrice(tier.foods) }}</p>
                    </div>
                    <ul class="food-list">
                        <li v-for="food in tier.foods" :key="food.id">
                            <span class="food-name">{{ food.name }}</span>
                            <span class="food-price">价格: {{ food.price }}</span>
                        </li>
                    </ul>
                    <div class="button-wrapper">
                        <el-button @click="selectTier(tier.id)">选择该档位</el-button>
                    </div>
                    
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectedTier: null,
            tiers: [
                {
                    id: 1,
                    name: '档位一',
                    foods: [
                        { id: 1, name: '食物1', price: 10 },
                        { id: 2, name: '食物2', price: 12 },
                    ]
                },
                {
                    id: 2,
                    name: '档位二',
                    foods: [
                        { id: 3, name: '食物10', price: 15 },
                        { id: 4, name: '食物4', price: 18 },
                    ]
                },
                {
                    id: 3,
                    name: '档位三',
                    foods: [
                        { id: 5, name: '食物5', price: 20 },
                        { id: 6, name: '食物6', price: 25 },
                    ]
                }
            ],
            websocket: null
        };
    },
    mounted() {
        this.websocket = new WebSocket(''); 
        this.websocket.onmessage = this.handleWebSocketMessage;
    },
    beforeDestroy() {
        if (this.websocket) {
            this.websocket.close();
        }
    },
    methods: {
        handleWebSocketMessage(event) {
            const message = JSON.parse(event.data);
            
            const tier = this.tiers.find(tier => tier.id === message.tierId);
            if (tier) {
                // 更新该档位的食物信息
                tier.foods.push(message.foodDetails);
            }
        },
        selectTier(tierId) {
            // 在这里向后端发送选择档位的请求
            
            const message = { action: 'selectTier', tierId };
            this.websocket.send(JSON.stringify(message));
        },
        calculateTotalPrice(foods) {
            return foods.reduce((total, food) => total + food.price, 0);
        }
    }
};
</script>

<style>
.food-selection {
    height: 100vh;
    background-image: url('../assets/点餐背景.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.title h2 {
    font-size: 50px; 
    
    color: #333333;
}


.title {
    width: 100%;
    text-align: center;
    margin-top: 50px;

    margin-bottom: 30px;

}

.tier-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 80%;
    height: 200%;
}

.tier {
    width: 100%;
    padding: 40px;
    background: linear-gradient(to right, #f1e0b5, #ffffff); 
   
    border-radius: 20px;

    opacity: 0.8;
    
    height: 300px; 
    color: #000000; 
}

.tier-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.food-list {
    list-style: none;
    padding: 0;
}

.food-list li {
    margin-bottom: 10px;
}

.food-name {
    font-weight: bold;
}

.food-price {
    margin-left: 10px;
}

.el-button:hover {
    border-color: #f7f9f7;
}

.button-wrapper {
    margin-top: 220px; 
    background: linear-gradient(to right, #f1b560, #cfcc30);
    border-radius: 10px;
    padding: 12px 24px;
    color: #ffffff; 
    border: none; 
    cursor: pointer; 
    transition: background-color 0.3s ease; 
}


.button-wrapper:hover {
    background: linear-gradient(to right, #cfcc30, #f1b560); 
}



</style>