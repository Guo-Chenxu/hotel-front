// main.js
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router/index';

const app = createApp(App);

// 注册路由导航守卫
router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('token');

    // 检查用户是否已登录
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLoggedIn) {
            // 如果用户未登录，重定向到登录页面
            next('/');
        } else {
            // 用户已登录，继续导航
            next();
        }
    } else {
        // 不需要鉴权的页面，直接继续导航
        next();
    }
})


app.use(ElementPlus); 
app.use(router);
app.mount('#app'); 
