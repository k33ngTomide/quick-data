import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import SigninForm from '../components/SigninForm.vue'
import DashBoard from '../components/DashBoard.vue'

const routes = [
  { path: '/', component: LoginForm },
  { path: '/login', component: LoginForm },
  { path: '/signin', component: SigninForm },
  { path: '/dashboard', component: DashBoard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
