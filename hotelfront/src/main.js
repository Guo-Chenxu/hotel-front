
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import UserLogin from './components/UserLogin.vue'
import CustomerSnack from './components/CustomerSnack.vue'
import VueRouter from 'vue-router';

const routes = [
    { path: '/', component: UserLogin },
    { path: '/CustomerSnackView',component:CustomerSnack}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
