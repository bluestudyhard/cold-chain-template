export default {
  path: '/Amap',
  name: 'Amap',
  component: () => import('@/views/amap/index.vue'),
  meta: {
    icon: 'ri:map-pin-2-line',
    title: '设备地图',
    rank: 1,
  },
} satisfies RouteConfigsTable
