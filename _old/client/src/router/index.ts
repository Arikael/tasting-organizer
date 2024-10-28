import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import scoring from "@/views/scoring.vue";
import results from "@/views/results.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/scoring/:id',
    name: 'Scoring',
    component: scoring
  },
  {
    path: '/results/:id',
    name: 'Results',
    component: results
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
