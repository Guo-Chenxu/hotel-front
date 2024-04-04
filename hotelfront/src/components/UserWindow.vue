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
import Page0 from './UserMain.vue';
import Page1 from './UserCool.vue'; 
import Page2 from './CustomerSnack.vue';
import Page3 from './UserLogin.vue';

export default {
    name: 'UserWindow',
    data() {
        return {
            sidebarItems: [
                { name: '主页', component: 'Page0' }, 
                { name: '纳凉服务', component: 'Page1' }, 
                { name: '进行点餐', component: 'Page2' },
                { name: '查看订单', component: 'Page3' }
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
        Page0,
        Page1,
        Page2,
        Page3
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
    width: 10%; /* 将宽度设置为百分比值 */
    background-color: #f5f9eb;
}

.sidebar-item {
    padding: 15px;
    cursor: pointer;
}

.sidebar-item:hover {
    background-color: #f0e6e6;
}

.sidebar-item.active {
    background-color: #bbb;
}

.content {
    
    flex: 1;
    padding: 2px;
    width: 90%;
}
</style>
