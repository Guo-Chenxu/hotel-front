<template>
    <div class="user-window">
        <el-container>

            <el-header class="header">
                <div class="header-content">
                    <h1 class="title-logo">@BUPTER</h1>
                </div>
                <el-icon class="timer-icon" size="large">
                    <Timer />
                </el-icon>
                <span class="time">{{ this.currentTime }}</span>
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
import { ElIcon } from 'element-plus';
import { Timer } from '@element-plus/icons';

import Main from './UserMain.vue';
import cool from './UserCool.vue';
import snack from './UserSnack.vue';
import login from './UserLogin.vue';
import detail from './UserRoomDetail.vue';
import bill from './UserBill.vue';

import api from '@/api';
const timerURL = `${api.timerURL}`;

export default {

   
    components: {
        Timer
    },
    mounted() {
        this.getTimer()
    },
    data() {
        return {
            currentTime: '',
            sidebarItems: [
                { name: '主页', component: 'Main' },
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
        getTimer() {
            let source = new EventSource(
                `${timerURL}/timer/now`);

            // 使用箭头函数来保持正确的上下文
            source.onmessage = (e) => {
                this.currentTime = e.data;
            };
        },
        showPage(index) {
            this.currentPage = index;
        },

    },

    components: {
        Main,
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
    height: 98.2vh;
    width: 100%;

}

.header {

    margin-top: 0%;
    height: 10vh;
    display: flex;
}

.title-logo {
    margin-top: 2.2%;
}

.sidebar {
    margin-top: 10%;

    width: 18vh;

}

.sidebar-item {

    padding: 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.sidebar-item:hover {
    background-color: #eaeaea;
    /* 鼠标悬停时的背景色 */
}

.sidebar-item.active {
    background-color: #fffefe;
}

.main-content {
    height: 88.5vh;
    margin-left: 0px;
    background-color: rgb(255, 255, 255);

}

/* 标题样式 */
h1 {
    font-size: 24px;
    margin: 0;
    padding: 10px;
}

.timer-icon {
    margin-top:10px;
    margin-left:800px;
    margin-right: 10px;
    /* Add space between icon and time */
}

.time {
    margin-top:10px;
    font-size: 18px;
    /* Adjust font size */
}
</style>
