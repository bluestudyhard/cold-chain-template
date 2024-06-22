<!--
 * new page
 * @author: blue
 * @since: 2024-06-17
 * OverView.vue
-->
<script setup lang="ts">
import { useECharts } from '@pureadmin/utils'
import { InitMapsData } from '@/types/index'
import { useOverViewStore } from '@/store/modules/overView'
import '@/charts/china.js'

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(chartRef)
const store = useOverViewStore()

const overViewTitle = ref('数据概览')
const dialogVisible = ref(false)
const dialogInfo = ref<InitMapsData[]>([])

onMounted(async () => {
  await store.init()

  setOptions({
    backgroundColor: 'transparent', // 设置背景色透明
    // 必须设置
    tooltip: {
      show: true,
    },
    geo: {
      type: 'map',
      map: 'china',
      zoom: 1,
      tooltip: {
        show: true,
        formatter(params: any) {
          const provinceName = params.name as string

          const count = store.cityData.get(provinceName) || 0

          return `${provinceName}：${count}`
        },
      },
      label: {
        show: true, // 显示省份名称
        color: '#F0F2F5',
        align: 'center',
        fontSize: 12,
        position: 'inside',
      },
      top: '0%',
      left: 'center',
      aspectScale: 0.75,
      roam: 'scale', // 地图缩放和平移
      itemStyle: {
        borderColor: '#D5DAE9', // 省分界线颜色  阴影效果的
        borderWidth: 1,
      },
      // 去除选中状态
      select: {
        disabled: true,
      },
      // 控制鼠标悬浮上去的效果
      emphasis: {
        // 聚焦后颜色
        disabled: false, // 开启高亮
        label: {
          align: 'center',
          color: '#F0F2F5',
        },
        itemStyle: {
          color: '#ffffff',
          areaColor: '#0075f4', // 阴影效果 鼠标移动上去的颜色
        },
      },
      z: 2,
    },
    series: [{
      type: 'scatter',
      coordinateSystem: 'geo',
      symbol: 'pin',
      symbolSize: 25,
      label: {
        show: false,
        color: '#fff',
        formatter: '{b}',
      },
      itemStyle: {
        color: '#6E48D1', // 标志颜色
      },
      z: 2,
      data: store.overViewMapsData.map((item) => {
        return {
          name: item.coord.boxName,
          value: item.coord.value,
        }
      }),
      silent: true,
    },
    ],
  }, {
    name: 'click',
    callback: (params: any) => {
      const provinceName = params.name as string

      overViewTitle.value = `数据详情 - ${provinceName}`
      dialogVisible.value = true

      dialogInfo.value = store.overViewMapsData.filter(
        item => item.provinceName === params.name,
      )

      console.log(toRaw(dialogInfo.value), 'dialogInfo')
    },
  })
})

onUnmounted(() => {
  chartRef.value = null
})
</script>

<template>
  <div class="container">
    <div ref="chartRef" style="width: 100%; height: 90vh" />
    <TableChart
      v-model="dialogVisible"
      :over-view-title="overViewTitle"
      :dialog-info="dialogInfo"
    />
  </div>
</template>
