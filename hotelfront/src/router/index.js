import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../components/UserLogin.vue';
import UserHome from '../components/UserHome.vue';




const routes = [
  { path: '/', component: UserLogin },
  // { path: '/home', component: UserHome },
  { path: '/home', component: UserHome, meta: { requiresAuth: true }  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


export default router
