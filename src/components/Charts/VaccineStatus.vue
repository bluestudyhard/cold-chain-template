<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useECharts } from '@pureadmin/utils'
import { useOverViewStore } from '@/store/modules/overView'

const lineChart = ref<HTMLDivElement | null>(null)
const { setOptions } = useECharts(lineChart)

const store = useOverViewStore()

watchEffect(() => {
  const data = [
    { value: store.statusCount.normal, name: '正常', itemStyle: { color: '#10B981' } }, // 绿色
    { value: store.statusCount.abnormal, name: '异常', itemStyle: { color: '#EF4444' } }, // 红色
    { value: store.statusCount.total, name: '总计', itemStyle: { color: '#3B82F6' } }, // 蓝色
  ]

  setOptions({

    backgroundColor: '#F0F2F5',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data,
        type: 'bar',
        barWidth: '60%',
      },
    ],
  })
})
</script>

<template>
  <div
    class="font-bold flex  justify-between items-center p-4 bg-white shadow-md rounded-lg absolute top-0 left-0"
  >
    <h3>疫苗温度总览</h3>

    <div class="ml-10 flex-c gap-2">
      <span
        class="text-green-500"
      >{{ store.statusCount.normal }}
      </span>
      /
      <span
        class="text-red-500"
      >
        {{ store.statusCount.abnormal }}
      </span>
      /

      <span class="text-blue-500">
        {{ store.statusCount.total }}
      </span>
    </div>
  </div>
  <div ref="lineChart" class="lineChart-main absolute  left-0 p-2" />
</template>

<style scoped>
span {
  font-size: 1.2rem;
}

.lineChart-main {
  top:10%;
  left:-10px;
  width: 25%;
  height: 45vh;
  border-radius: 10rem;
}
</style>
