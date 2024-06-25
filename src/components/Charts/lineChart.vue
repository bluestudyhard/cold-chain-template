<!--
 * new page
 * @author: blue
 * @since: 2024-06-22
 * lineChart.vue
-->
<script setup lang="ts">
import { useECharts } from '@pureadmin/utils'
import { useOverViewStore } from '@/store/modules/overView'

const lineChart = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(lineChart)
const store = useOverViewStore()

const temperatureRange = ref<[number, number]>([2, 8])

watchEffect(() => {
  setOptions({
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
        const vaccine = store.vaccines.find(v => v.name === item.name)
        return `${item.name}<br/>最低温度: ${vaccine.low} °C<br/>最高温度: ${vaccine.high} °C`
      },
    },
    legend: {
      data: store.vaccines.map(item => item.name),
      left: 'left',
    },
    xAxis: {
      type: 'category',
      data: store.vaccines.map(item => item.name),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} °C',
      },
      min: temperatureRange.value[0],
      max: temperatureRange.value[1] + 10,
    },

    series: [{
      type: 'bar',
      data: store.vaccines.map(item => ({
        name: item.name,
        value: Number.parseFloat(item.high),
      })),
      itemStyle: {
        color(params) {
          const colors = ['#5470C6', '#91CC75', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC']
          return colors[params.dataIndex % colors.length]
        },
      },
    }, {
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    }],
  })
})
</script>

<template>
  <div
    class="bg-white shadow-md py-4 rounded-lg absolute bottom-0 left-0"
  >
    <div ref="lineChart" class="main" />
  </div>
</template>

<style scoped lang="scss">
.main {
  z-index: 10;
  width: 24rem;
  height: 20rem;
}
</style>
