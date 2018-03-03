import Vue from 'vue'
import Router from 'vue-router'
import secat from '@/components/secat'
import admin from '@/components/admin'
import preview from '@/components/preview'
// import player from '@/components/player'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'secat',
      component: secat
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin
    },
    {
      path: '/preview',
      name: 'preview',
      component: preview
    }
    // {
    //   path: '/player',
    //   name: 'player',
    //   component: player
    // }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/admin' || window.localStorage.getItem('token')) {
    next()
  } else {
    next('/')
  }
})
export default router
