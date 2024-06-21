<!--
 * new page
 * @author: blue
 * @since: 2024-06-17
 * OverView.vue
-->
<script setup lang="ts">
import { useECharts } from '@pureadmin/utils'

import type { InitMapsData, VaccineData } from '@/types/index'
import { useOverViewStore } from '@/store/modules/overView'
import '@/charts/china.js'

const chartRef = ref<HTMLDivElement | null>(null)
const { setOptions, echarts } = useECharts(chartRef)
const store = useOverViewStore()

const initMapsData = ref<InitMapsData[]>([])
/** 数据区 */
const overViewTitle = ref('数据概览')
const dialogVisible = ref(false)
const dialogInfo = ref<InitMapsData[]>()
const vaccineData = ref<VaccineData[]>([])

async function init() {
  await store._getOverViewData()
  await store._getArrivalCitysData()
  await store._getVaccineData()
  await store._getBoxMessageData()
  // await store._getPatchLocationData("101.285,39.930")
  await store._getInitMapsData()
  await store._getVaccineData()
  store.provinceNameFilter()
  initMapsData.value = store.getOverViewMapsData
  vaccineData.value = store.getVaccines
  console.log(initMapsData.value, 'initMapsData')
  console.log(vaccineData.value, 'VaccineData')
}

onMounted(async () => {
  await init()
  setOptions(
    {
      backgroundColor: 'transparent', // 设置背景色透明
      // 必须设置
      tooltip: {
        show: true,
      },
      geo: {
        tooltip: {
          show: false,
        },
        map: 'china',
        roam: false, // 开启鼠标缩放和平移
        label: {
          show: false,
        },
        top: '0.5%',
        left: 'center',
        aspectScale: 0.75,
        itemStyle: {
          borderColor: '#EDF1F5', // 省分界线颜色
          borderWidth: 1,
          opacity: 1,
          shadowBlur: 10,
          shadowColor: '#c7c7c7c2',
          shadowOffsetX: 1,
          shadowOffsetY: 1,
        },
      },

      series: [
        // 地图配置
        {
          type: 'map',
          map: 'china',
          zoom: 1,
          tooltip: {
            show: true,
            formatter: (params) => {
              return `${params.name}:${params.value || 0}`
              // return `<div style="color: #fff; background-color: #333; padding: 10px;"><h4 style="margin: 0;">${params.name}</h4></div>`
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
          progressive: 0,
          itemStyle: {
            borderColor: '#D5DAE9', // 省分界线颜色  阴影效果的
            borderWidth: 1,
            // areaColor: new echarts.graphic.LinearGradient(
            //     0,
            //     0,
            //     1,
            //     0,
            //     [
            //         {
            //             offset: 0,
            //             color: "#FEFEDF" // 0% 处的颜色
            //         },

            //         {
            //             offset: 1,
            //             color: "#00619A" // 0% 处的颜色
            //         }
            //     ]
            // ),
            areaColor: '#4280C7',
            opacity: 1,
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
          data: initMapsData.value.map((item) => {
            return {
              name: item.provinceName,
              value: item.value,
            }
          }),
        },
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
          data: initMapsData.value.map((item) => {
            return {
              name: item.coord.boxName,
              value: item.coord.value,
            }
          }),
          silent: true,
        },
      ],
    },
    {
      name: 'click',
      callback: (params: any) => {
        overViewTitle.value = params.name
        dialogVisible.value = true
        dialogInfo.value = initMapsData.value.filter(
          item => item.provinceName === params.name,
        )
        console.log(dialogInfo.value, 'dialogInfo')
      },
    },
  )
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
