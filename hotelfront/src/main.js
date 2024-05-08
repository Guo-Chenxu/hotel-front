import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router';
import store from './store';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
const app = createApp(App);

// // 注册路由导航守卫
// router.beforeEach((to, from, next) => {
//     const isLoggedIn =  store.getters.getToken;

//     // 检查用户是否已登录
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (!isLoggedIn) {
//             // 如果用户未登录，重定向到登录页面
//             next('/');
//         } else {
//             // 用户已登录，继续导航
//             next();
//         }
//     } else {
//         // 不需要鉴权的页面，直接继续导航
//         next();
//     }
// })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(ElementPlus); 
app.use(router);
app.use(store);
app.mount('#app');


