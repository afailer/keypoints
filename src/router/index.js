import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/pages/Layout/index.vue'
import Login from '@/pages/Login/index.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
      hidden: true
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/main',
      name: 'main',
      component: Layout,
      children: [
        {
          path: '/category',
          name: 'category',
          component: () =>
            import("@/pages/Category"),
          meta: {title: 'category'}
        },
        {
          path: '/drawTools/:batchId',
          name: 'drawTools',
          component: () =>
            import("@/pages/DrawTools")
        },
        {
          path: '/batches',
          name: 'batches',
          component: () =>
            import('@/pages/Batches')
        }

      ]
    }
  ]
})
