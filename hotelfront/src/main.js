
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import UserLogin from './components/UserLogin.vue'
import CustomerSnack from './components/CustomerSnack.vue'
import UserView from './components/UserView.vue'
import UserCool from './components/UserCool.vue'
const routes = [
    { path: '/', component: UserLogin },
    { path: '/CustomerSnack', component: CustomerSnack },
    { path: '/uservieW',component: UserView},
    { path: '/Usercool',component: UserCool},
    
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
