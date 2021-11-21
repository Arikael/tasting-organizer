import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import scoring from "@/views/scoring.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/scoring/:id',
    name: 'Scoring',
    component: scoring
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
