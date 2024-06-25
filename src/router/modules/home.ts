const { VITE_HIDE_HOME } = import.meta.env
const Layout = () => import('@/layout/index.vue')

export default {
  path: '/',
  name: 'Home',
  component: Layout,
  redirect: '/dashboard',
  meta: {
    icon: 'ep:home-filled',
    title: '首页',
    rank: 0,
  },
  children: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '数据大屏',
        showLink: VITE_HIDE_HOME !== 'true',
      },
    },
  ],
} satisfies RouteConfigsTable
