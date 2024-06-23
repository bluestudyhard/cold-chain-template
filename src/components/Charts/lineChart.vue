<!--
 * new page
 * @author: blue
 * @since: 2024-06-22
 * lineChart.vue
-->
<script setup lang="ts">
import { useECharts } from '@pureadmin/utils'
import { VaccineData } from '@/types/index'

const lineChart = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(lineChart)

/**
 * @description: 初始化直线图
 */

const vaccines: VaccineData[] = [
  {
    id: '6671a3457a9d1ceaf8386e45',
    name: '辉瑞新冠疫苗',
    low: '-25.0',
    high: '-15.0',
  },
  {
    id: '6671a3877a9d1ceaf8386e54',
    name: '狂犬疫苗',
    low: '2 ',
    high: '8',
  },
  {
    id: '6671a3c17a9d1ceaf8386e5f',
    name: '乙肝疫苗',
    low: '2',
    high: '8',
  },
  {
    id: '6671a3c17a9d1ceaf8386e60',
    name: '流感疫苗',
    low: '2',
    high: '8',
  },
]
const temperatureRange = ref([])
function getTemperatureThresholds(vaccines) {
  const temperatures = vaccines.map(vaccine => [Number.parseFloat(vaccine.low), Number.parseFloat(vaccine.high)])
  const minTemp = Math.min(...temperatures.flat())
  const maxTemp = Math.max(...temperatures.flat())
  return [minTemp, maxTemp]
}
temperatureRange.value = getTemperatureThresholds(vaccines)
console.log(temperatureRange.value)
watchEffect(() => {
  setOptions(
    {
      backgroundColor: '#fff',
      title: {
        text: '疫苗总览',
        left: 'center',
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '10%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          const item = params[0]
          const vaccine = vaccines.find(v => v.name === item.name)
          return `${item.name}<br/>最低温度: ${vaccine.low} °C<br/>最高温度: ${vaccine.high} °C`
        },
      },
      legend: {
        data: vaccines.map(item => item.name),
        left: 'left',
      },
      xAxis: {
        type: 'category',
        data: vaccines.map(item => item.name),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C',
        },
        min: temperatureRange.value[0],
        max: temperatureRange.value[1] + 10,
      },

      series: [
        {
          type: 'bar',
          data: vaccines.map(item => ({
            name: item.name,
            value: Number.parseFloat(item.high),
          })),
          itemStyle: {
            // 每一列颜色不同
            color(params) {
              // 预定义一个颜色数组
              const colors = ['#5470C6', '#91CC75', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC']
              // 根据条形图项的索引返回颜色，使用模运算确保颜色数组循环使用
              return colors[params.dataIndex % colors.length]
            },
          },
        },

        {
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    },
  )
})
</script>

<template>
  <div ref="lineChart" class="line-chart" />
</template>

<style scoped lang="scss">
.line-chart {
  width: 100%;
  height: 40vh;
}
</style>
