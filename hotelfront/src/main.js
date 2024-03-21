/*
 * @Author: hvinci
 * @Date: 2024-03-21 14:39:13
 * @LastEditors: hvinci
 * @LastEditTime: 2024-03-21 14:48:06
 * @Description: 
 * 
 * Copyright (c) 2024 by ${hvinci}, All Rights Reserved. 
 */
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import UserLogin from './components/UserLogin.vue'
import VueRouter from 'vue-router';

const routes = [
    { path: '/', component: UserLogin }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
