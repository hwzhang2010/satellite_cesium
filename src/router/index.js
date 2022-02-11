import Vue from 'vue'
import VueRouter from 'vue-router'
import CesiumViewer from '../views/CesiumViewer'
import Detail from '../views/Detail'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'viewer',
    component: CesiumViewer
  },
  { 
	  path: '/detail', 
	  name: 'detail',
	  component: Detail 
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
