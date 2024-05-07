<template>
    <div class="user-window">
        <el-container>
            <el-header class='header'>
                <h1 class="title-logo">@BUPTER</h1>
            </el-header>
            <el-container>
                <el-aside class="sidebar">
                    <div v-for="(item, index) in sidebarItems" :key="index" class="sidebar-item"
                        @click="showPage(index)" :class="{ active: currentPage === index }">
                        {{ item.name }}
                    </div>
                </el-aside>
                <el-main class="main-content">
                    <component :is="currentPageComponent"></component>
                </el-main>
            </el-container>
        </el-container>
        
    </div>
</template>


<script>
import main from './UserMain.vue';
import cool from './UserCool.vue';
import snack from './UserSnack.vue';
import login from './UserLogin.vue';
import detail from './UserRoomDetail.vue';
import bill from './UserBill.vue';
export default {
    name: 'UserWindow',
    data() {
        return {
            sidebarItems: [
                { name: '主页', component: 'main' },
                { name: '房间详情', component: 'detail' },
                { name: '纳凉服务', component: 'cool' },
                { name: '进行点餐', component: 'snack' },
                { name: '账单', component: 'bill' },
                
            ],
            currentPage: 0
        };
    },
    computed: {
        currentPageComponent() {
            return this.sidebarItems[this.currentPage].component;
        }
    },
    methods: {
        showPage(index) {
            this.currentPage = index;
        }
    },
    components: {
        main,
        cool,
        snack,
        login,
        detail,
        bill
    }
};
</script>

<style scoped>
.user-window {
    width: 100%;
    height: 100%;
    position:fixed;
}

.header {
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    padding: 10px;
}

.title-logo {
    margin: 0;
    font-size: 24px;
}

.sidebar {
    position:fixed;
    height: 100%;
    width: 10%; /* 调整侧边栏宽度 */
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    justify-content: center;
    
}

.sidebar-item {
    padding: 15px;
    cursor: pointer;
    transition: background-color 0.3s ease; 
}

.sidebar-item:hover {
    background-color: #eaeaea; /* 鼠标悬停时的背景色 */
}

.sidebar-item.active {
    background-color: #fffefe;
}

.main-content {
    padding: 20px;
    
}

/* 标题样式 */
h1 {
    font-size: 24px;
    margin: 0;
    padding: 10px;
}

</style>

