
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import UserLogin from './components/UserLogin.vue'
import CustomerSnack from './components/CustomerSnack.vue'
import UserCool from './components/UserCool.vue'
import UserWindow from './components/UserWindow.vue'
const routes = [
    { path: '/', component: UserLogin },
    { path: '/CustomerSnack', component: CustomerSnack },
    { path: '/Usercool', component: UserCool },
    { path: '/window', component: UserWindow },
    { path: '/UserMain', component: UserWindow },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
