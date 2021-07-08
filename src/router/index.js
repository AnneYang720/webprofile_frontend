import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/signup', component: () => import('@/views/signup/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/task',
    component: Layout,
    name: 'Task',
    meta: { title: '任务', icon: 'example' },
    children: [
      {
        path: 'create',
        name: 'Create',
        component: () => import('@/views/table/create'),
        meta: { title: '新建任务', icon: 'table', reuse: false }
      },
      {
        path: 'all',
        name: 'All',
        component: () => import('@/views/table/projectcenter'),
        meta: { title: '任务列表', icon: 'table', reuse: false  }
      },
      {
        path: 'result',
        name: 'Result',
        component: () => import('@/views/table/projectsearch'),
        meta: { title: '任务结果', icon: 'table', reuse: false  }
      }
    ]
  },

  {
    path: '/reference',
    component: Layout,
    //redirect: '/maven/release',
    name: 'Reference',
    meta: { title: '文献', icon: 'example' },
    children: [
      {
        path: 'mine',
        name: 'mine',
        component: () => import('@/views/table/project'),
        meta: { title: '我的文献', icon: 'table', reuse: false  }
      },
      {
        path: 'all',
        name: 'all',
        component: () => import('@/views/table/project'),
        meta: { title: '全部文献', icon: 'table', reuse: false  }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

