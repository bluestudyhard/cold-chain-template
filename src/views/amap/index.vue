<script setup lang="ts">
import { ref } from 'vue'
import { useUrlSearchParams } from '@vueuse/core'
// 传入起点终点和当前车位置
const path = ref<[number, number][]>([
  [116.5, 30],
  [113.2, 24.1],
])
const carPosition = ref<[number, number]>([116.5, 40])
const params = useUrlSearchParams('history')
// 转为number：
console.log('params', params)

if (params.startPosition && params.endPosition) {
  path.value = [
    (params.startPosition as string)?.split(',').map(item => Number(item)) as [number, number],
    (params.endPosition as string)?.split(',').map(item => Number(item)) as [number, number],
  ]
}
if (params.carPosition) {
  carPosition.value = (params.carPosition as any)?.split(',').map(item => Number(item)) as [number, number]
}
</script>

<template>
  <div id="container">
    <amapContainer :path="path" :car-position="carPosition" />
  </div>
</template>

<style scoped>
#container {
  position: relative;
  width: 100%;
  height: 90vh;
}
</style>
