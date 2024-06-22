<script setup lang="ts">
import { ref } from 'vue'
// 传入起点终点和当前车位置
const path = ref<[number, number][]>([
  [116.5, 40],
  [113.2, 24.1],
])
const carPosition = ref<[number, number]>([116.5, 40])
</script>

<template>
  <div id="container">
    <amapContainer :path="path" :car-position="carPosition" />
  </div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 800px;
}
</style>
