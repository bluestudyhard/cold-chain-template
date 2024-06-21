export default {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/views/dashboard/index.vue'),
  meta: {
    icon: 'ri:dashboard-line',
    title: 'Dashboard',
    rank: 1,
  },
}
