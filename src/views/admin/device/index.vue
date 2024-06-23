<!--
 * new page
 * @author: blue
 * @since: 2024-06-18
 * index.vue
-->
<script setup lang="ts">
import { pollingBoxMessages } from '@/api/amap'

onMounted(async () => {
  pollingBoxMessages(async data => console.log(data[0]))
})
</script>

<template>
  <div class="container">
    <h1>设备管理</h1>
  </div>
</template>
