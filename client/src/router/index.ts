import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import scoring from "@/views/scoring.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Scoring',
    component: scoring
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
