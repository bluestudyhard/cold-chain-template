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

const dataScrollConfig = reactive({
  header: ['列1', '列2', '列3'],
  data: [
    ['行1列1', '行1列2', '行1列3', '行1列4', 'hang', 'hangs', 'hang'],
    ['行2列1', '行2列2', '行2列3'],
    ['行3列1', '行3列2', '行3列3'],
    ['行4列1', '行4列2', '行4列3'],
    ['行5列1', '行5列2', '行5列3'],
    ['行6列1', '行6列2', '行6列3'],
    ['行7列1', '行7列2', '行7列3'],
    ['行8列1', '行8列2', '行8列3'],
    ['行9列1', '行9列2', '行9列3'],
    ['行10列1', '行10列2', '行10列3'],
  ],
  index: true,
  columnWidth: [50],
  align: ['center'],
  haderBGC: '#f5f7fa',
  headerHeight: 40,

})

onMounted(async () => {
  await store.init()

  setOptions({
    title: {
      text: '全国冷链设备概览',
      left: 'center',

      textStyle: {
        color: '#6981CD',
        fontSize: 24,
      },
    },
    backgroundColor: 'transparent', // 设置背景色透明
    // 必须设置
    tooltip: {
      show: true,
    },
    geo: {
      tooltip: {
        show: true,
        formatter(params: any) {
          const provinceName = params.name as string
          const count = store.overViewMapsData
            .filter(item => item.provinceName === provinceName)
            .length
          return `${provinceName}: ${count}`
        },
      },
      map: 'china',
      roam: false, // 开启鼠标缩放和平移
      zoom: 0.75,
      label: {
        show: true, // 显示省份名称
        color: '#F0F2F5',
        align: 'center',
        fontSize: 12,
        position: 'inside',
      },
      emphasis: {
        // 聚焦后颜色
        disabled: false, // 开启高亮
        label: {

          color: '#F0F2F5',
        },
        itemStyle: {
          color: '#ffffff',
          areaColor: '#0075f4', // 阴影效果 鼠标移动上去的颜色
        },
      },
      top: '0.5%',
      left: 'center',
      aspectScale: 0.75,
      itemStyle: {
        borderColor: '#D5DAE9', // 省分界线颜色  阴影效果的
        borderWidth: 1,
        areaColor: '#4280C7',
        opacity: 1,
      },
    },
    series: [
    //   {
    //   type: 'map',
    //   map: 'china',
    //   zoom: 1,
    //   tooltip: {
    //     show: true,
    //     formatter(params: any) {
    //       return `${params.name}:${params.value || 0}`
    //       // return `<div style="color: #fff; background-color: #333; padding: 10px;"><h4 style="margin: 0;">${params.name}</h4></div>`
    //     },
    //   },
    //   label: {
    //     show: true, // 显示省份名称
    //     color: '#F0F2F5',
    //     align: 'center',
    //     fontSize: 12,
    //     position: 'inside',
    //   },

      //   roam: 'scale', // 地图缩放和平移
      //   progressive: 0,
      //   itemStyle: {
      //     borderColor: '#D5DAE9', // 省分界线颜色  阴影效果的
      //     borderWidth: 1,
      //     // areaColor: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      //     //   {
      //     //     offset: 0,
      //     //     color: '#FEFEDF', // 0% 处的颜色
      //     //   },

      //     //   {
      //     //     offset: 1,
      //     //     color: '#00619A', // 0% 处的颜色
      //     //   },
      //     // ]),
      //     // areaColor: '#4280C7',
      //     // opacity: 1,
      //   },
      //   // 去除选中状态
      //   select: {
      //     disabled: true,
      //   },
      //   // 控制鼠标悬浮上去的效果
      //   emphasis: {
      //     // 聚焦后颜色
      //     disabled: false, // 开启高亮
      //     label: {
      //       align: 'center',
      //       color: '#F0F2F5',
      //     },
      //     itemStyle: {
      //       color: '#ffffff',
      //       areaColor: '#0075f4', // 阴影效果 鼠标移动上去的颜色
      //     },
      //   },
      //   z: 2,
      //   data: store.overViewMapsData.map((item) => {
      //     return {
      //       name: item.provinceName,
      //       value: item.value,
      //     }
      //   }),
      // },
      {
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
      overViewTitle.value = params.name
      dialogVisible.value = true

      dialogInfo.value = store.overViewMapsData.filter(
        item => item.provinceName === params.name,
      )
      console.log(dialogInfo.value, 'dialogInfo')
    },
  })
})

onUnmounted(() => {
  chartRef.value = null
})
</script>

<template>
  <div class="container relative">
    <div ref="chartRef" style="z-index: 10;width: 100%; height: 100vh;" />
    <TableChart
      v-model="dialogVisible"
      :over-view-title="overViewTitle"
      :dialog-info="dialogInfo"
    />
    <line-chart class="line-chart" />
    <dv-scroll-board :config="dataScrollConfig" class="dv-scroll-board" />
  </div>
</template>

<style scoped lang="scss">
.line-chart {
  position: absolute;
  top: 0;
  z-index: 10;
  width:20vw;
  height: 40vh;
}

.dv-scroll-board {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  width: 20vw;
  height: 40vh;
  margin: 0 4rem;
}
</style>
