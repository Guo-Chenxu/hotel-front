<template>
    <div class="user-window">
        <div class="sidebar">
            <div v-for="(item, index) in sidebarItems" :key="index" 
                class="sidebar-item" 
                @click="showPage(index)"
                :class="{ active: currentPage === index }">
                {{ item.name }}
            </div>
        </div>
        <div class="content">
            <component :is="currentPageComponent"></component>
        </div>
    </div>
</template>


<script>
import main from './UserMain.vue';
import cool from './UserCool.vue'; 
import snack from './UserSnack.vue';
import login from './UserLogin.vue';

export default {
    name: 'UserWindow',
    data() {
        return {
            sidebarItems: [
                { name: '主页', component: 'main' }, 
                { name: '纳凉服务', component: 'cool' }, 
                { name: '进行点餐', component: 'snack' },
                { name: '查看订单', component: 'login' }
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
        login
    }
};
</script>

<style scoped>
.user-window {
    display: flex;
    height: 97.8vh;
    
}

.sidebar {
    margin-top: 0.3vh;
    width: 10%;
    background-color: #f0f0f0;
    /* 使用 Flex 布局 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.sidebar-item {
    padding: 15px;
    cursor: pointer;
}

.sidebar-item.active {
    background-color: #fbfbfb;
}

.content {
    
    flex: 1;
    padding: 2px;
    width: 90%;
}
</style>
